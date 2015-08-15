// provides an engine to play music streams

import { STREAM_URL } from '../config';

import { List, Map } from 'immutable';
import React, { PropTypes } from 'react';

import PureControllerView from './PureControllerView';

import {
  addTrack,
  togglePause,
  ctrlNext,
} from '../actions/PlayerActions';

import {
  canplay,
  loadstart,
  durationchange,
  error,
  progress,
  timeupdate,
  volumechange,
} from '../actions/AudioActions';

export default class PlayerEngine extends PureControllerView {
  componentDidMount() {
    const audioElement = this.refs.audioObject.getDOMNode();

    // <audio> event listeners
    audioElement.addEventListener('canplay', this._canplay.bind(this));
    audioElement.addEventListener('loadstart', this._loadstart.bind(this));
    audioElement.addEventListener('durationchange', this._durationchange.bind(this));
    audioElement.addEventListener('error', this._error.bind(this));
    audioElement.addEventListener('progress', this._progress.bind(this));
    audioElement.addEventListener('timeupdate', this._timeupdate.bind(this));
    audioElement.addEventListener('volumechange', this._volumechange.bind(this));

    // this is for testing purposes, obviously
    window.setTimeout(() => {
      this._addTrack({
        id: 11,
        artist: 'Agnes Obel',
        album: 'Aventine',
        title: 'Fivefold',
        track: 10,
        genre: 'Alternative',
        time: 119,
      });
      this._play();
    }, 1000);
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

  /* these correspond to HTML5 audio events */
  _ended() {
    this.dispatchAction(ctrlNext());
  }

  _canplay() {
    this.dispatchAction(canplay(true));
  }

  _loadstart() {
    this.dispatchAction(loadstart());
  }

  _durationchange(ev) {
    this.dispatchAction(durationchange(ev.target.duration));
  }

  _error() {
    this.dispatchAction(error());
  }

  _progress(ev) {
    this.dispatchAction(progress(ev.target.buffered));
  }

  _timeupdate(ev) {
    this.dispatchAction(timeupdate(ev.target.currentTime));
  }

  _volumechange(ev) {
    this.dispatchAction(volumechange(ev.target.volume * 10));
  }
  /* end HTML5 audio event abstraction */

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

