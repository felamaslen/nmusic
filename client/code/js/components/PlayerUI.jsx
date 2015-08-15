// builds the UI for playing music

import { secondsToTime } from '../common';

import { Map } from 'immutable';
import React, { PropTypes } from 'react';

import PureControllerView from './PureControllerView';

import {
  ctrlPrevious,
  ctrlNext,
  togglePause,
  ctrlSeek,
} from '../actions/PlayerActions';

export default class PlayerUI extends PureControllerView {
  render() {
    const playPauseText = this.props.paused ? 'Play' : 'Pause';

    const songInfo = this.props.currentTrack === null ? (
      <song-info className="no-info"></song-info>
    ) : (
      <song-info>
        <info-title>{this.props.currentTrack.get('title')}</info-title>
        <info-artist>{this.props.currentTrack.get('artist')}</info-artist>
        <seekbar>
          <current-time>{secondsToTime(this.props.currentTime)}</current-time>
          <input className="ctrl-seekbar" ref="ctrlSeekbar" type="range"
            min="0" max={this.props.currentTrack.get('time')} value={this.props.currentTime}
            onChange={this._seek.bind(this)}
          />
          <total-time>{secondsToTime(this.props.currentTrack.get('time'))}</total-time>
        </seekbar>
      </song-info>
    );


    return (
      <player>
        <controls>
          <control className="ctrl-previous" ref="ctrlPrevious"
            onClick={this._ctrlPrevious.bind(this)}>Previous</control>
          <control className="ctrl-next" ref="ctrlPlayPause"
            onClick={this._ctrlPlayPause.bind(this)}>{playPauseText}</control>
          <control className="ctrl-next" ref="ctrlNext"
            onClick={this._ctrlNext.bind(this)}>Next</control>
          <input className="ctrl-volume" ref="ctrlVolume" type="range" min="0" max="100"
            defaultValue={this.props.volume} onChange={this.ctrlVolume}/>
        </controls>
        {songInfo}
      </player>
    );
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
    console.log(ev);
    this.dispatchAction(ctrlSeek(ev.target.value));
  }
}

PlayerUI.propTypes = {
  paused: PropTypes.bool,
  currentTime: PropTypes.number,
  volume: PropTypes.number,
  currentTrack: PropTypes.instanceOf(Map),
};

