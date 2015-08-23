// builds the UI for playing music

import { secondsToTime } from '../common';

import { List, Map } from 'immutable';
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Dispatcher } from 'flux';

import PureControllerView from './PureControllerView';

import {
  volumeClicked
} from '../actions/PlayerActions';

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

import CustomSlider from './CustomSlider';

const volumeControlColors = volume =>
  List.of(
    16 / 9 * Math.pow(volume - 0.25, 2),
    Math.pow(Math.E, -2.5 * Math.pow(volume, 2)),
    volume * Math.sin(3 * volume)
  );

export default class PlayerUI extends PureControllerView {
  render() {
    const playPauseText = this.props.paused ? 'Play' : 'Pause';

    const currentSongInfo = this.props.currentSong === null ? (
      <div className="inside">
      </div>
    ) : (
      <div className="inside">
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
      </div>
    );

    const songInfoClass = classNames({
      'no-info': this.props.currentSong === null,
      'song-info': true
    });

    const playerClass = classNames({
      player: true,
      paused: this.props.paused
    });

    const volumeLow = 0.4;
    const volumeHigh = 0.9;

    return (
      <div id="player" className={playerClass}>
        <section className="controls noselect">
          <button className="ctrl ctrl-previous" ref="ctrlPrevious"
            onClick={this._ctrlPrevious.bind(this)}>Previous</button>
          <button className="ctrl ctrl-playpause" ref="ctrlPlayPause"
            onClick={this._ctrlPlayPause.bind(this)}>{playPauseText}</button>
          <button className="ctrl ctrl-next" ref="ctrlNext"
            onClick={this._ctrlNext.bind(this)}>Next</button>
          <div className="controls-volume">
            <div className="ctrl-volume">
              <CustomSlider dispatcher={this.props.dispatcher}
                name="volume"
                min={0} max={1} value={this.props.volume}
                clicked={this.props.volumeSliderClicked}
                changedAction={audioVolumeChange}
                clickedAction={volumeClicked}
                eventHandlers={this.props.eventHandlers}
                colors={volumeControlColors}
              />
              <div className={classNames({
                'volume-indicator': true,
                mute: !this.props.volume,
                low: this.props.volume < volumeLow && this.props.volume > 0,
                med: this.props.volume < volumeHigh && this.props.volume >= volumeLow,
                high: this.props.volume >= volumeHigh
              })}/>
            </div>
          </div>
        </section>
        <section className={songInfoClass}>
          {currentSongInfo}
        </section>
      </div>
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
    this.dispatchAction(ctrlSeek(ev.target.value));
  }
}

PlayerUI.propTypes = {
  paused: PropTypes.bool,
  volumeSliderClicked: PropTypes.number,
  currentTime: PropTypes.number,
  volume: PropTypes.number,
  eventHandlers: PropTypes.instanceOf(List),
  currentSong: PropTypes.instanceOf(Map),
  dispatcher: PropTypes.instanceOf(Dispatcher)
};

