// provides an engine to play music streams

import { STREAM_URL } from '../config';

import { List } from 'immutable';
import React, { PropTypes } from 'react';

import PureControllerView from './PureControllerView';

import {
  addTrack,
  togglePause,
} from '../actions/PlayerActions';

export default class PlayerEngine extends PureControllerView {
  componentDidMount() {
    window.setTimeout(() => {
      this._addTrack(3);
      this._togglePause(false);
    }, 2000);
  }

  render() {
    const source = this.props.playingId === null ? false : (
      <source src={STREAM_URL + this.props.playingId} type="audio/mpeg"/>
    );

    return (
      <audio ref="audioObject" id="playerEngine">
        {source}
      </audio>
    );
  }

  _addTrack(trackId) {
    this.dispatchAction(addTrack(trackId));
  }

  _togglePause(paused) {
    this.dispatchAction(togglePause(paused));

    if (paused) {
      this.refs.audioObject.getDOMNode().pause();
    } else {
      this.refs.audioObject.getDOMNode().play();
    }
  }
}

PlayerEngine.propTypes = {
  paused: PropTypes.bool,
  playingId: PropTypes.number,
  history: PropTypes.instanceOf(List),
};

