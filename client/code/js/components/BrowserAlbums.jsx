/**
 * browser which lists albums
 */

import React, { PropTypes } from 'react';
import { List } from 'immutable';

import PureControllerView from './PureControllerView';

import { loadListAlbums } from '../actions/BrowserActions';

export default class BrowserAlbums extends PureControllerView {
  componentWillMount() {
    if (!this.props.loaded) {
      this.dispatchAction(loadListAlbums(this.props.selectedArtist));
    }
  }

  render() {
    const numAlbums = this.props.list.size;

    const _list = this.props.list.unshift(
      !numAlbums ? 'No Albums' : 'All (' + numAlbums.toString() + ' Album' + (
        numAlbums === 1 ? '' : 's'
      ) + ')'
    );

    const albumList = _list.map((album, index) => {
      const liClass = this.props.selected === index - 1 ? 'selected' : '';

      return (
        <li key={index} className={liClass}>{album}</li>
      );
    });

    const className = 'browser albums-browser';

    return (
      <div className={className}>
        <ul>
          {albumList}
        </ul>
      </div>
    );
  }
}

BrowserAlbums.propTypes = {
  loaded: PropTypes.bool,
  selected: PropTypes.number,
  selectedArtist: PropTypes.number,
  list: PropTypes.instanceOf(List),
};

