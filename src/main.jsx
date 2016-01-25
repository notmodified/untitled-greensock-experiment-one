import React from 'react';
import ReactDOM from 'react-dom';
import {connect, Provider} from 'react-redux';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import emojione from 'emojione';
import 'gsap';
import * as R from 'ramda';

import {intro, flip, match, noMatch} from './animations';

const rootReducer = combineReducers({activeTiles, matches, lastClicked, numberFlipped});
// create a store that has redux-thunk middleware enabled
const createStoreWithMiddleware = applyMiddleware(thunk, logger())(createStore);
const store = createStoreWithMiddleware(rootReducer);

require('./main.scss');

const sprites = require('file!emojione/assets/sprites/emojione.sprites.svg');
emojione.imageType = 'svg';
emojione.sprites = true;
const keys = Object.keys(emojione.emojioneList);
const max = keys.length;
const randomKey = _ => keys[Math.floor(Math.random() * max)];
const fiveRandom = _ => R.times(randomKey, 5);
const tenRandom = _ => {
  const five = fiveRandom();
  return shuffle([...five, ...five]);
}

// stolen from http://bost.ocks.org/mike/shuffle/
function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

const Emo = React.createClass({
  render () {
    let e = this.props.code;
    if (!e) {
      e = keys[Math.floor(Math.random() * max)];
    }
    const unicode = emojione.emojioneList[e][emojione.emojioneList[e].length-1];
    const path = `/${sprites}#emoji-${unicode}`;
    return (
      <svg className="emojione">
        <use xlinkHref={path}></use>
      </svg>
    );
  }
});

const Main = React.createClass({
  getInitialState () {
    return {emos: tenRandom()}
  },

  handleClick () {
    this.setState({emos: tenRandom()});
    intro('.tile');
  },

  render () {
    return (
      <Provider store={store}>
        <div>
          <button onClick={this.handleClick}>start</button>
          <div className="countdown">
            <div id="three">3</div>
            <div id="two">2</div>
            <div id="one">1</div>
          </div>
          <div className="board">
            {this.state.emos.map((i, j) => <Tile key={j} value={i} code={i}/>)}
          </div>
        </div>
      </Provider>
    );
  }
});

function activeTiles(state = [], {type, payload}) {
  switch (type) {
    case 'TILE_CLICKED':
      return R.concat(state, payload);
    case 'NO_MATCH':
      return [];
    case 'MATCH':
      return [];
    default:
      return state;
  }
}

function lastClicked(state = {}, {type, payload}) {
  switch (type) {
    case 'TILE_CLICKED':
      return payload;
    case 'TILE_FLIPPED':
      return {};
    default:
      return state;
  }
}

function matches(state = [], {type, payload}) {
  switch (type) {
    case 'MATCH':
      return R.concat(state, payload);
    default:
      return state;
  }
}

function numberFlipped(state = 0, {type}) {
  switch (type) {
    case 'TILE_FLIPPED':
      return state + 1;
    default:
      return state;
  }
}

function tileClicked({element, value}) {
  return (dispatch, getState) => {

    if (getState().activeTiles.length < 1) {
      dispatch({type: 'TILE_CLICKED', payload: {element, value}});
    } else {
      dispatch({type: 'TILE_CLICKED', payload: {element, value}});
      // then this is the second, so compare
      const current = R.head(getState().activeTiles);
      if (current.value === value && current.element !== element) {
        dispatch({type: 'MATCH', payload: [current, {element, value}]});
     //   let onComplete = _ => dispatch({type: 'MATCH', payload: [current, {element, value}]});
     //   noMatch([element, current.element], onComplete);
      } else {
        dispatch({type: 'NO_MATCH', payload: [current, {element, value}]});
       // let onComplete = _ => dispatch({type: 'NO_MATCH', payload: [current, {element, value}]});
       // match([element, current.element], onComplete);
      }
    }

  };
}

function tileFlipped(payload) {
  return {
    type: 'TILE_FLIPPED',
    payload
  }
}

function mapStateToProps(state) {
  return {
    activeTiles: state.activeTiles,
    lastClicked: state.lastClicked,
    numberFlipped: state.numberFlipped
  };
}
function mapDispatchToProps(d) {
  return {
    tileClicked: v => d(tileClicked(v)),
    tileFlipped: v => d(tileFlipped(v))
  }
}

const TileUnwrapped = React.createClass({
  componentDidUpdate () {
    if (this.props.lastClicked.element === this.container) {
      flip(this.container, _ => this.props.tileFlipped({element:this.container, value:this.props.value}));
    }
  },
  handleClick () {
    if (!R.find(R.propEq('element', this.container))(this.props.activeTiles)) {
      this.props.tileClicked({element:this.container, value: this.props.value});
    }
  },
  render () {
    return (
      <div onClick={this.handleClick} className="tile" ref={ref => this.container = ref}>
        <div className="tile__front" ref={ref => this.front = ref}>front</div>
        <div className="tile__back" ref={ref => this.back = ref}><Emo code={this.props.code}/></div>
      </div>
    );
  }
});

const Tile = connect(mapStateToProps, mapDispatchToProps)(TileUnwrapped);
ReactDOM.render(<Main />, document.querySelector('#app'));
