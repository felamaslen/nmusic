// builds the UI for playing music

import { secondsToTime } from '../common';

import { List, Map } from 'immutable';
import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Dispatcher } from 'flux';

import UserMenu from './UserMenu';

import PureControllerView from './PureControllerView';

import {
  customSliderClicked
} from '../actions/AppActions';
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
    volume * Math.sin(3 * volume),
    0.4
  );

export default class PlayerUI extends PureControllerView {
  render() {
    const playPauseText = this.props.paused ? 'Play' : 'Pause';

    const seekbarColors = () => List.of(0, 0, 0, 0);

    const currentSongInfo = this.props.currentSong ? (
      <div>
        <span className="info-title">{this.props.currentSong.get('title')}</span>
        <span className="info-artist">{this.props.currentSong.get('artist')}</span>
        <div className="seekbar">
          <div className="current-time">{secondsToTime(this.props.currentTime)}</div>
          <CustomSlider dispatcher={this.props.dispatcher}
            vertical={false}
            name="seekbar"
            min={0} max={this.props.currentSong.get('time')}
            value={this.props.currentTime}
            clicked={this.props.seekbarClicked}
            clickedAction={customSliderClicked}
            changedAction={ctrlSeek}
            eventHandlers={this.props.seekbarEvents}
            colors={seekbarColors}
            drag={false}
          />
          <div className="total-time">{secondsToTime(this.props.currentSong.get('time'))}</div>
        </div>
      </div>
    ) : false;

    const songInfoClass = classNames({
      'no-info': this.props.currentSong === null,
      'song-info': true
    });

    const appIcon = this.props.currentSong ? false : (
      <div className="app-icon-outer">
        <i className="app-icon"/>
      </div>
    );

    const playerClass = classNames({
      player: true,
      paused: this.props.paused,
      playing: !this.props.paused
    });

    const volumeLow = 0.3;
    const volumeHigh = 0.6;

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
                vertical={false}
                name="volume"
                min={0} max={1} value={this.props.volume}
                clicked={this.props.volumeClicked}
                clickedAction={customSliderClicked}
                changedAction={audioVolumeChange}
                eventHandlers={this.props.volumeControlEvents}
                colors={volumeControlColors}
              />
              <div className={classNames({
                'volume-indicator': true,
                mute: !this.props.volume,
                low: this.props.volume < volumeLow && this.props.volume > 0,
                med: this.props.volume < volumeHigh && this.props.volume >= volumeLow,
                high: this.props.volume >= volumeHigh
              })}>
                <a/>
              </div>
            </div>
          </div>
        </section>
        <section className={songInfoClass}>
          <div className="songinfo-inside">
            <div className="glow"></div>
            <UserMenu dispatcher={this.props.dispatcher}
              active={this.props.userMenuActive}
              events={this.props.userMenuEvents}
            />
            {currentSongInfo}
            {appIcon}
          </div>
        </section>
      </div>
    );
  }

  _ctrlPrevious() {
    this.dispatchAction(ctrlPrevious());
  }
  _ctrlNext() {
    this.dispatchAction(ctrlNext(true));
  }
  _ctrlPlayPause() {
    this.dispatchAction(togglePause(!this.props.paused));
  }
}

PlayerUI.propTypes = {
  paused: PropTypes.bool,
  userMenuActive: PropTypes.bool,
  volumeClicked: PropTypes.number,
  seekbarClicked: PropTypes.number,
  currentTime: PropTypes.number,
  volume: PropTypes.number,
  seekbarEvents: PropTypes.instanceOf(List),
  volumeControlEvents: PropTypes.instanceOf(List),
  userMenuEvents: PropTypes.instanceOf(List),
  currentSong: PropTypes.instanceOf(Map),
  dispatcher: PropTypes.instanceOf(Dispatcher)
};

