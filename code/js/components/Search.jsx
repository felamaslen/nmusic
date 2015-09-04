import { List } from 'immutable';
import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { debounce } from '../common';

import {
  searchQueryReceived
} from '../actions/SearchActions';

import PureControllerView from './PureControllerView';

const renderArtistAlbum = (item, index) => (
  <li key={index}>
    <a>{item}</a>
  </li>
);

const renderSongs = (song, index) => (
  <li data-id={song.first()} key={index}>
    <a>
      <span className="song-title">{song.get(1)}</span>
      <span className="song-artist">{song.get(2)}</span>
    </a>
  </li>
);

export default class Search extends PureControllerView {
  componentWillMount() {
    this._getSuggestions = debounce(searchTerm => {
      this.dispatchAction(searchQueryReceived(searchTerm));
    }, 100);
  }

  render() {
    const searchResultsClass = classNames({
      'search-results-outer': true,
      'context-menu': true,
      active: this.props.artists.size + this.props.albums.size + this.props.songs.size > 0
    });

    const resultsArtists = this.props.artists.size ? (
      <ul className="artists">{this.props.artists.map(renderArtistAlbum)}</ul>
    ) : false;

    const resultsAlbums = this.props.albums.size ? (
      <ul className="albums">{this.props.albums.map(renderArtistAlbum)}</ul>
    ) : false;

    const resultsSongs = this.props.songs.size ? (
      <ul className="songs">{this.props.songs.map(renderSongs)}</ul>
    ) : false;

    const classes = classNames({
      loading: this.props.loading
    });

    return (
      <section id="searchOuter" className={classes}>
        <div className="search-input-outer">
          <input onChange={this._handleInput.bind(this)}
            ref="search" className="search-input" placeholder="Search"/>
          <i className="search-icon"/>
        </div>
        <div className={searchResultsClass}>
          {resultsArtists}
          {resultsAlbums}
          {resultsSongs}
        </div>
      </section>
    );
  }

  _handleInput(ev) {
    const value = ev.target && ev.target.value ? ev.target.value : '';

    return this._getSuggestions(value);
  }
}

Search.propTypes = {
  loading: PropTypes.bool,
  searchTerm: PropTypes.string,
  artists: PropTypes.instanceOf(List),
  albums: PropTypes.instanceOf(List),
  songs: PropTypes.instanceOf(List)
};
