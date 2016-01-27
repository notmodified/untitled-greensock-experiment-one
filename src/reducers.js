import {combineReducers} from 'redux';

import * as R from 'ramda';
import emojione from 'emojione';
import people from './people';
import shuffle from './shuffle';


const _anim = (animating, e) => Object.assign({}, e, {animating});
const doneAnimating = R.curry(_anim)(false);
const animating = R.curry(_anim)(true);

const _flipped = (flipped, e) => Object.assign({}, e, {flipped});
const flipped = R.curry(_flipped)(true);
const notFlipped = R.curry(_flipped)(false);
const toggleFlip = e => Object.assign({}, e, {flipped: !e.flipped});

const markFound = e => Object.assign({}, e, {found: true});

const doneAnimateToggleFlip = R.adjust(R.compose(doneAnimating, notFlipped));
const doneAnimateMarkFound = R.adjust(R.compose(doneAnimating, notFlipped, markFound));

const Tile = {
  id: undefined,
  value: '',
  animating: false,
  flipped: false,
  found: false,
  img: '',
  name: '',
  role: ''
}

const keys = Object.keys(emojione.emojioneList);
const randomKey = _ => ({value: keys[Math.floor(Math.random() * keys.length)]});

const halfRandom = _ => R.times(randomKey, people.length/2);
const allRandom = _ => {
  const half = halfRandom();
  return shuffle([...half, ...half]);
}

const tiles = people.map((p, id) => Object.assign(Object.create(Tile), p, {id}));

const emodTiles = _ => {
  const random = allRandom();
  const assign = R.curry(Object.assign, {});

  return R.zipWith(assign, tiles, random);
}

function board(state, {type, payload}) {

  if (!state) {
    return emodTiles();
  }

  switch (type) {
    case 'CLICK_TILE':
      return R.adjust(animating, payload, state);
    case 'FLIP_DONE':
      return R.adjust(R.compose(doneAnimating, toggleFlip), payload, state);
    case 'UN_FLIP_DONE': {
      const [one, two] = payload;
      state = doneAnimateToggleFlip(one, state);
      state = doneAnimateToggleFlip(two, state);
      return state;
    }
    case 'MATCH_ANIM_DONE': {
      const [one, two] = payload;

      state = doneAnimateMarkFound(one, state);
      state = doneAnimateMarkFound(two, state);
      return state;
    }
    default:
      return state;
  }
}

function match(state = [], {type, payload}) {
  switch (type) {
    case 'MATCH':
      return R.append(payload, state);
    case 'MATCH_ANIM_DONE':
      return [];
    default:
      return state;
  }
}

function noMatch(state = [], {type, payload}) {
  switch (type) {
    case 'NO_MATCH':
      return R.append(payload, state);
    case 'UN_FLIPPING':
      return R.reject(R.equals(payload), state);
    case 'UN_FLIP_DONE':
      return [];
    default:
      return state;
  }
}

function toFlip(state = [], {type, payload}) {
  switch (type) {
    case 'CLICK_TILE':
      return R.append(payload, state);
    case 'FLIPPING':
      return R.reject(R.equals(payload), state);
    default:
      return state;
  }
}

export default combineReducers({board, match, noMatch, toFlip});

