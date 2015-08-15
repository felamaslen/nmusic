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

  componentDidUpdate() {
    const paused = this.isPaused();

    if (paused && !this.props.paused) {
      this._play();
    } else if (!paused && this.props.paused) {
      this._pause();
    }
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

  isPaused() {
    return this.refs.audioObject.getDOMNode().paused;
  }

  _play() {
    this.refs.audioObject.getDOMNode().play();
  }

  _pause() {
    this.refs.audioObject.getDOMNode().pause();
  }

  _addTrack(track) {
    this.dispatchAction(addTrack(track));
  }

  _togglePause(paused) {
    this.dispatchAction(togglePause(paused));

    if (paused) {
      this._play();
    } else {
      this._pause();
    }
  }
}

PlayerEngine.propTypes = {
  paused: PropTypes.bool,
  history: PropTypes.instanceOf(List),
  currentTrack: PropTypes.instanceOf(Map),
};

