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
  componentDidMount() {
    window.setTimeout(() => {
      this._addTrack({
        id: 8,
        track: 3,
        title: 'Royals',
        artist: 'Lorde',
        album: 'Pure Heroine',
        genre: 'Indie Pop',
        time: 190.25405,
        year: 2013,
      });

      // this._togglePause(false);
    }, 1500);
  }
  render() {
    const source = this.props.currentTrack === null ? false : (
      <source src={STREAM_URL + this.props.currentTrack.get('id')} type="audio/mpeg"/>
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

