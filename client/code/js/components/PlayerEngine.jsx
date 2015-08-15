// provides an engine to play music streams

import { STREAM_URL } from '../config';

import { List, Map } from 'immutable';
import React, { PropTypes } from 'react';

import PureControllerView from './PureControllerView';

import {
  addToQueue,
  playQueueItem,
  togglePause,
  ctrlNext,
  ctrlSeek,
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
      this._addToQueue({
        id: 11,
        artist: 'Agnes Obel',
        album: 'Aventine',
        title: 'Fivefold',
        track: 10,
        genre: 'Alternative',
        time: 119,
      });
      this._playQueueItem(0);
    }, 1000);
  }

  shouldComponentUpdate(nextProps) {
    const audioElem = this.refs.audioObject.getDOMNode();

    const paused = this.isPaused();

    if (paused && !nextProps.paused) {
      this._play();
    } else if (!paused && nextProps.paused) {
      this._pause();
    }

    const volumeChanged = nextProps.volume !== this.props.volume;
    if (volumeChanged) {
      audioElem.volume = parseFloat(nextProps.volume, 10);
    }

    console.log(nextProps.setTime, typeof nextProps.setTime);
    if (nextProps.setTime > -1) {
      audioElem.currentTime = nextProps.setTime;
      this.dispatchAction(ctrlSeek(-1));
    }

    const trackChanged =
      (nextProps.currentTrack === null && this.props.currentTrack !== null) ||
      (nextProps.currentTrack !== null && this.props.currentTrack === null) ||
      (nextProps.currentTrack !== null && this.props.currentTrack !== null &&
       nextProps.currentTrack.id !== this.props.currentTrack.id);

    // only need to re-render <audio> element if the track (source) changed
    return trackChanged;
  }

  componentDidUpdate() {
    if (!this.props.paused) {
      this._play();
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
    this.dispatchAction(volumechange(ev.target.volume));
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

  _playQueueItem(queueId) {
    this.dispatchAction(playQueueItem(queueId));
  }

  _addToQueue(track) {
    this.dispatchAction(addToQueue(track));
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
  volume: PropTypes.number,
  setTime: PropTypes.number,
  history: PropTypes.instanceOf(List),
  currentTrack: PropTypes.instanceOf(Map),
};

