import React from 'react';
import ReactDOM from 'react-dom';
import emojione from 'emojione';
import 'gsap';

require('./main.scss');

const sprites = require('file!emojione/assets/sprites/emojione.sprites.svg');
emojione.imageType = 'svg';
emojione.sprites = true;
const keys = Object.keys(emojione.emojioneList);
const max = keys.length;
console.log(max);

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
  render () {
    return (
      <div className="board">
        {[1,2,3,4,5,6,7,8,9,10].map(i => <Tile key={i}/>)}
      </div>
    );
  }
});

const Tile = React.createClass({

  handleClick () {
    TweenMax.to(this.container, 1.5, {
      css: {rotationY: "+=180"},
      ease: Power2.easeInOut
    });
    TweenMax.to(this.container, 1, {
      css: {z: "+=180"},
      yoyo: true,
      repeat: 1,
      ease: Power2.easeInOut
    });
  },

  render () {
    return (
      <div className="tile" onClick={this.handleClick} ref={ref => this.container = ref}>
        <div className="tile__front" ref={ref => this.front = ref}><Emo /></div>
        <div className="tile__back" ref={ref => this.back = ref}><Emo /></div>
      </div>
    );
  }
});

ReactDOM.render(<Main/>, document.querySelector('#app'));
