/**
 * browser which lists artists
 */

import React, { PropTypes } from 'react';
import { List } from 'immutable';

import PureControllerView from './PureControllerView';

import { loadListArtists } from '../actions/BrowserActions';

export default class BrowserArtists extends PureControllerView {
  render() {
    if (!this.props.loaded) {
      this._load();
    }

    const numArtists = this.props.list.size;

    const _list = this.props.list.unshift(
      !numArtists ? 'No Artists' : 'All (' + numArtists.toString() + ' Artist' + (
        numArtists === 1 ? '' : 's'
      ) + ')'
    );

    const categoryList = _list.map((artist, index) => {
      const liClass = this.props.selected === index - 1 ? 'selected' : '';

      return (
        <li key={index} className={liClass}>{artist}</li>
      );
    });

    const className = 'browser artists-browser';

    return (
      <div className={className}>
        <ul>
          {categoryList}
        </ul>
      </div>
    );
  }

  _load() {
    window.setTimeout(() => {
      this.dispatchAction(loadListArtists());
    }, 0);
  }
}

BrowserArtists.propTypes = {
  loaded: PropTypes.bool,
  selected: PropTypes.number,
  list: PropTypes.instanceOf(List),
};

