console.clear();
import * as R from 'ramda';

import {clickTile, flipDone, unFlipDone, matchAnimDone, flipping, unFlipping} from './actions';
import rootReducer from './reducers';
import createStoreWithMiddleware from './middleware';

import * as Anim from './animations';

const store = createStoreWithMiddleware(rootReducer);

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';

class AppW extends Component {

  componentDidUpdate() {
    const {match, noMatch, toFlip} = this.props;

    if (match.length) {
      const [i, j] = match[0];
      Anim.match([this.refs[i], this.refs[j]], () => store.dispatch(matchAnimDone([i, j])));
    }

    if (noMatch.length) {
      const [i, j] = noMatch[0];
      store.dispatch(unFlipping([i, j]))
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
        <li key={e.id} ref={e.id} onClick={this.handleClick.bind(this, e)}><pre>{v}</pre></li>
      );
    });
    return (
      <ul>
        {list}
      </ul>
    );
  }
}
const App = connect(state => state)(AppW);

ReactDOM.render(<App store={store} />, document.querySelector('#app'));

