// provides an engine to play music streams

import { STREAM_URL } from '../config';

import { List, Map } from 'immutable';
import React, { PropTypes } from 'react';

import PureControllerView from './PureControllerView';

import {
  addTrack,
  togglePause,
} from '../actions/PlayerActions';

export default class PlayerEngine extends PureControllerView {
  render() {
    const source = this.props.currentTrack === null ? false : (
      <source src={STREAM_URL + this.props.currentTrack.id} type="audio/mpeg"/>
    );

    return (
      <audio ref="audioObject" id="playerEngine">
        {source}
      </audio>
    );
  }

  _addTrack(track) {
    this.dispatchAction(addTrack(track));
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
  history: PropTypes.instanceOf(List),
  currentTrack: PropTypes.instanceOf(Map),
};

