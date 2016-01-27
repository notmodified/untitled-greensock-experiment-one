import * as R from 'ramda';

import {clickTile, flipDone, unFlipDone, matchAnimDone, flipping, unFlipping} from './actions';
import rootReducer from './reducers';
import createStoreWithMiddleware from './middleware';

import * as Anim from './animations';

import people from './people';

const store = createStoreWithMiddleware(rootReducer);

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

import emojione from 'emojione';
const sprites = require('file!emojione/assets/sprites/emojione.sprites.svg');
require('./main.scss');
emojione.imageType = 'svg';
emojione.sprites = true;

class Emo extends Component {
  render () {
    let e = this.props.code;
    const unicode = emojione.emojioneList[e][emojione.emojioneList[e].length-1];
    const path = `/${sprites}#emoji-${unicode}`;
    return (
      <svg className="emojione">
        <use xlinkHref={path}></use>
      </svg>
    );
  }
}

class AppW extends Component {

  componentDidUpdate() {
    const {match, noMatch, toFlip} = this.props;

    if (match.length) {
      const [i, j] = match[0];
      Anim.match([this.refs[i], this.refs[j]], () => store.dispatch(matchAnimDone([i, j])));
    }

    if (noMatch.length) {
      const [i, j] = noMatch[0];
      Anim.noMatch([this.refs[i], this.refs[j]], () => store.dispatch(unFlipDone([i, j])));
    }

    if (toFlip.length) {
      const f = toFlip[0];
      store.dispatch(flipping(f))
      Anim.flip(this.refs[f], () => store.dispatch(flipDone(f)));
    }
  }

  handleClick(e) {
    this.props.dispatch(clickTile(e.id));
  }

  render() {
    const {board} = this.props;

    const list = board.map(e => {
      const v = JSON.stringify(e);
      return (
        <li className="tile" key={e.id} ref={e.id} onClick={this.handleClick.bind(this, e)}>
          <img src="" />
          <div className="tile__back">
            <Emo code={e.value} />
          </div>
        </li>
      );
    });
    return (
      <ul className="board">
        {list}
      </ul>
    );
  }
}
const App = connect(state => state)(AppW);

ReactDOM.render(<App store={store} />, document.querySelector('#app'));

