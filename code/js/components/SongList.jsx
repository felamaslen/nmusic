/**
 * dispays list of songs (e.g. from search results)
 */

import {
  COL_MIN, COL_MAX
} from '../config';

import {
  itemInRanges,
  trackFormat
} from '../common';

import React, { PropTypes } from 'react';
import { Dispatcher } from 'flux';
import { List } from 'immutable';
import classNames from 'classnames';

import {
  sliderClicked
} from '../actions/AppActions';
import {
  selectSong,
  columnResized
} from '../actions/SongListActions';
import { playListItem } from '../actions/PlayerActions';

import ResizeSlider from './ResizeSlider';

import PureControllerView from './PureControllerView';

export default class SongList extends PureControllerView {
  render() {
    const songList = this.props.list.map((song, index) => {
      const liClass = classNames({
        selected: itemInRanges(this.props.selected, index) > -1,
        playing: song.get('id') === this.props.currentSongId
      });

      const titleStyle = {
        width: this.props.titleWidthActual
      };

      return (
        <li key={index} className={liClass}
          onMouseDown={this._selectSong.bind(this, index)}
          onDoubleClick={this._playListItem.bind(this, index)}
        >
          <song-track>{trackFormat(song.get('track'))}</song-track>
          <song-title style={titleStyle}>{song.get('title')}</song-title>
          <song-artist>{song.get('artist')}</song-artist>
          <song-album>{song.get('album')}</song-album>
          <song-year>{song.get('year')}</song-year>
          <song-genre>{song.get('genre')}</song-genre>
        </li>
      );
    });

    const songListClass = classNames({
      songlist: true,
      loaded: this.props.loaded,
      loading: !this.props.loaded,
      noselect: true
    });

    const songListStyle = {
      top: this.props.browserHeight + 89
    };

    const headerStyle = {
      top: this.props.browserHeight + 65
    };

    return (
      <section id="section-songlist" className="noselect">
        <header style={headerStyle}>
          <song-track>
            #
          </song-track>
          <song-title style={{width: this.props.titleWidthPreview}}>
            Title
            <ResizeSlider dispatcher={this.props.dispatcher}
              vertical={false}
              name="title"
              eventHandlers={this.props.resizeTitleEvents}
              min={COL_MIN} max={COL_MAX}
              value={this.props.titleWidthPreview}
              clicked={this.props.resizeTitleClicked}
              clickedAction={sliderClicked}
              changedAction={columnResized}
            />
          </song-title>
          <song-artist>Artist</song-artist>
          <song-album>Album</song-album>
          <song-year>Year</song-year>
          <song-genre>Genre</song-genre>
        </header>
        <ul className={songListClass} style={songListStyle}>
          {songList}
        </ul>
      </section>
    );
  }

  _playListItem(index) {
    this.dispatchAction(playListItem(this.props.list.get(index)));
  }

  _selectSong(index, ev) {
    this.dispatchAction(selectSong({
      ctrl: ev.ctrlKey,
      shift: ev.shiftKey,
      index: index
    }));
  }
}

SongList.propTypes = {
  loaded: PropTypes.bool,
  currentSongId: PropTypes.number,
  browserHeight: PropTypes.number,
  resizeTitleClicked: PropTypes.number,
  titleWidthPreview: PropTypes.number,
  titleWidthActual: PropTypes.number,
  selected: PropTypes.instanceOf(List),
  list: PropTypes.instanceOf(List),
  resizeTitleEvents: PropTypes.instanceOf(List),
  dispatcher: PropTypes.instanceOf(Dispatcher)
};

