/**
 * dispays list of songs (e.g. from search results)
 */

import {
  itemInRanges,
  trackFormat
} from '../common';

import React, { PropTypes } from 'react';
import { List } from 'immutable';
import classNames from 'classnames';

import { selectSong } from '../actions/SongListActions';
import { playListItem } from '../actions/PlayerActions';

import PureControllerView from './PureControllerView';

export default class SongList extends PureControllerView {
  render() {
    const songList = this.props.list.map((song, index) => {
      const liClass = classNames({
        selected: itemInRanges(this.props.selected, index) > -1,
        playing: song.get('id') === this.props.currentSongId
      });

      return (
        <li key={index} className={liClass}
          onMouseDown={this._selectSong.bind(this, index)}
          onDoubleClick={this._playListItem.bind(this, index)}
        >
          <song-track>{trackFormat(song.get('track'))}</song-track>
          <song-title>{song.get('title')}</song-title>
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
      <section id="section-songlist">
        <header style={headerStyle}>
          <song-track>#</song-track>
          <song-title>Title</song-title>
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
  selected: PropTypes.instanceOf(List),
  list: PropTypes.instanceOf(List)
};

