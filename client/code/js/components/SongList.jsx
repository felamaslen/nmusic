/**
 * dispays list of songs (e.g. from search results)
 */

import { itemInRanges } from '../common';

import React, { PropTypes } from 'react';
import { List } from 'immutable';
import classNames from 'classnames';

import { selectSong } from '../actions/SongListActions';
import { addToQueue } from '../actions/PlayerActions';

import PureControllerView from './PureControllerView';

export default class SongList extends PureControllerView {
  render() {
    const songList = this.props.list.map((song, index) => {
      const liClass = classNames({
        selected: itemInRanges(this.props.selected, index) > -1,
        playing: song.get('id') === this.props.currentId
      });

      return (
        <li key={index} className={liClass}
          onMouseDown={this._selectSong.bind(this, index)}
          onDoubleClick={this._addAndPlay.bind(this, index)}
        >
          <song-track>{song.get('track')}</song-track>
          <song-title>{song.get('title')}</song-title>
          <song-time>{song.get('time')}</song-time>
          <song-artist>{song.get('artist')}</song-artist>
          <song-album>{song.get('album')}</song-album>
          <song-year>{song.get('year')}</song-year>
          <song-genre>{song.get('genre')}</song-genre>
        </li>
      );
    });

    const songListClass = 'songlist ' + (this.props.loaded ? 'loaded' : 'loading');

    return (
      <section id="section-songlist">
        <header>
          <song-track>#</song-track>
          <song-title>Title</song-title>
          <song-time>Time</song-time>
          <song-artist>Artist</song-artist>
          <song-album>Album</song-album>
          <song-year>Year</song-year>
          <song-genre>Genre</song-genre>
        </header>
        <ul className={songListClass}>
          {songList}
        </ul>
      </section>
    );
  }

  _addAndPlay(index) {
    this.dispatchAction(addToQueue({
      songs: List.of(this.props.list.get(index)),
      playAfter: true
    }));
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
  currentId: PropTypes.number,
  selected: PropTypes.instanceOf(List),
  list: PropTypes.instanceOf(List)
};

