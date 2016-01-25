
import * as R from 'ramda';

const clickAction = id => ({type: 'CLICK_TILE', payload: id});
const flipDoneAction = id => ({type: 'FLIP_DONE', payload: id});
export const unFlipDone = id => ({type: 'UN_FLIP_DONE', payload: id});
const matchFound = payload => ({type: 'MATCH', payload});
export const matchAnimDone = payload => ({type: 'MATCH_ANIM_DONE', payload});
const noMatchFound = payload => ({type: 'NO_MATCH', payload});
export const flipping = payload => ({type: 'FLIPPING', payload});
export const unFlipping = payload => ({type: 'UN_FLIPPING', payload});

export const clickTile = id => (dispatch, getState) => {

  const busyTiles = getState().board.filter(e => e.flipped || e.animating).length;
  const alreadyBusy = getState().board[id].flipped || getState().board[id].animating || getState().board[id].found;

  if (busyTiles > 1 || alreadyBusy) return;

  dispatch(clickAction(id));
}

const pluckId = R.pluck('id');
const matchIds = R.compose(pluckId, R.flatten, R.filter(e => e.length>1), R.values, R.groupBy(e => e.value));

export const flipDone = id => (dispatch, getState) => {

  dispatch(flipDoneAction(id));

  const flipped = getState().board.filter(e => e.flipped);

  if (flipped.length > 1) {
    const matches = matchIds(flipped);

    if (matches.length) {
      dispatch(matchFound(matches));
    } else {
      dispatch(noMatchFound(pluckId(flipped)));
    }
  }
}

export default {clickTile, flipDone, unFlipDone, matchAnimDone}
