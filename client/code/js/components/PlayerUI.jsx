// builds the UI for playing music

import { secondsToTime } from '../common';

import { Map } from 'immutable';
import React, { PropTypes } from 'react';
import classNames from 'classnames';

import PureControllerView from './PureControllerView';

import {
  ctrlPrevious,
  ctrlNext,
  togglePause,
  ctrlSeek,
} from '../actions/PlayerActions';

import {
//  canplay,
//  loadstart,
//  durationchange,
//  error,
//  progress,
//  timeupdate,
  audioVolumeChange,
} from '../actions/AudioActions';

export default class PlayerUI extends PureControllerView {
  render() {
    const playPauseText = this.props.paused ? 'Play' : 'Pause';

    const currentSong = this.props.currentSong === null ? (
      <song-info className="no-info"></song-info>
    ) : (
      <song-info>
        <info-title>{this.props.currentSong.get('title')}</info-title>
        <info-artist>{this.props.currentSong.get('artist')}</info-artist>
        <seekbar>
          <current-time>{secondsToTime(this.props.currentTime)}</current-time>
          <input id="seekbar" className="ctrl-seekbar" ref="ctrlSeekbar" type="range"
            min="0" max={this.props.currentSong.get('time')} value={this.props.currentTime}
            onChange={this._seek.bind(this)}
          />
          <total-time>{secondsToTime(this.props.currentSong.get('time'))}</total-time>
        </seekbar>
      </song-info>
    );

    const playerClass = classNames({
      player: true,
      paused: this.props.paused
    });

    return (
      <audio-player id="player" className={playerClass}>
        <section className="controls">
          <div className="controls-player-btns">
            <button className="ctrl ctrl-previous" ref="ctrlPrevious"
              onClick={this._ctrlPrevious.bind(this)}>Previous</button>
            <button className="ctrl ctrl-playpause" ref="ctrlPlayPause"
              onClick={this._ctrlPlayPause.bind(this)}>{playPauseText}</button>
            <button className="ctrl ctrl-next" ref="ctrlNext"
              onClick={this._ctrlNext.bind(this)}>Next</button>
          </div>
          <div className="controls-volume">
            <input className="ctrl-volume" ref="ctrlVolume" type="range"
              min="0" max="1" step="0.001"
              value={this.props.volume} onChange={this._ctrlVolume.bind(this)}/>
          </div>
        </section>
        {currentSong}
      </audio-player>
    );
  }

  _ctrlVolume(ev) {
    this.dispatchAction(audioVolumeChange(ev.target.value));
  }

  _ctrlPrevious() {
    this.dispatchAction(ctrlPrevious());
  }

  _ctrlNext() {
    this.dispatchAction(ctrlNext());
  }

  _ctrlPlayPause() {
    this.dispatchAction(togglePause(!this.props.paused));
  }

  _seek(ev) {
    this.dispatchAction(ctrlSeek(ev.target.value));
  }
}

PlayerUI.propTypes = {
  paused: PropTypes.bool,
  currentTime: PropTypes.number,
  volume: PropTypes.number,
  currentSong: PropTypes.instanceOf(Map)
};

