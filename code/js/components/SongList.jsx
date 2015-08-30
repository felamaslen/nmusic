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

      const artistStyle = {
        width: this.props.artistWidthActual
      };

      const albumStyle = {
        width: this.props.albumWidthActual
      };

      const genreStyle = {
        width: this.props.genreWidthActual
      };

      return (
        <li key={index} className={liClass}
          onMouseDown={this._selectSong.bind(this, index)}
          onDoubleClick={this._playListItem.bind(this, index)}
        >
          <song-track>{trackFormat(song.get('track'))}</song-track>
          <song-title style={titleStyle}>{song.get('title')}</song-title>
          <song-artist style={artistStyle}>{song.get('artist')}</song-artist>
          <song-album style={albumStyle}>{song.get('album')}</song-album>
          <song-year>{song.get('year')}</song-year>
          <song-genre style={genreStyle}>{song.get('genre')}</song-genre>
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
          <song-artist style={{width: this.props.artistWidthPreview}}>
            Artist
            <ResizeSlider dispatcher={this.props.dispatcher}
              vertical={false}
              name="artist"
              eventHandlers={this.props.resizeArtistEvents}
              min={COL_MIN} max={COL_MAX}
              value={this.props.artistWidthPreview}
              clicked={this.props.resizeArtistClicked}
              clickedAction={sliderClicked}
              changedAction={columnResized}
            />
          </song-artist>
          <song-album style={{width: this.props.albumWidthPreview}}>
            Album
            <ResizeSlider dispatcher={this.props.dispatcher}
              vertical={false}
              name="album"
              eventHandlers={this.props.resizeAlbumEvents}
              min={COL_MIN} max={COL_MAX}
              value={this.props.albumWidthPreview}
              clicked={this.props.resizeAlbumClicked}
              clickedAction={sliderClicked}
              changedAction={columnResized}
            />
          </song-album>
          <song-year>Year</song-year>
          <song-genre style={{width: this.props.genreWidthPreview}}>
            Genre
            <ResizeSlider dispatcher={this.props.dispatcher}
              vertical={false}
              name="genre"
              eventHandlers={this.props.resizeGenreEvents}
              min={COL_MIN} max={COL_MAX}
              value={this.props.genreWidthPreview}
              clicked={this.props.resizeGenreClicked}
              clickedAction={sliderClicked}
              changedAction={columnResized}
            />
          </song-genre>
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
  resizeArtistClicked: PropTypes.number,
  resizeAlbumClicked: PropTypes.number,
  resizeGenreClicked: PropTypes.number,
  titleWidthPreview: PropTypes.number,
  artistWidthPreview: PropTypes.number,
  albumWidthPreview: PropTypes.number,
  genreWidthPreview: PropTypes.number,
  titleWidthActual: PropTypes.number,
  artistWidthActual: PropTypes.number,
  albumWidthActual: PropTypes.number,
  genreWidthActual: PropTypes.number,
  selected: PropTypes.instanceOf(List),
  list: PropTypes.instanceOf(List),
  resizeTitleEvents: PropTypes.instanceOf(List),
  resizeArtistEvents: PropTypes.instanceOf(List),
  resizeAlbumEvents: PropTypes.instanceOf(List),
  resizeGenreEvents: PropTypes.instanceOf(List),
  dispatcher: PropTypes.instanceOf(Dispatcher)
};

