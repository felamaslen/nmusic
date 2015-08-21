/**
 * browser which lists artists
 */

import React, { PropTypes } from 'react';
import { List } from 'immutable';

import PureControllerView from './PureControllerView';

import {
  loadListArtists,
  selectArtist,
} from '../actions/BrowserActions';

export default class BrowserArtists extends PureControllerView {
  componentWillMount() {
    this.dispatchAction(loadListArtists());
    this.dispatchAction(selectArtist(List.of(-1)));
  }

  render() {
    const numArtists = this.props.list.size;

    const _list = this.props.list.unshift(
      !numArtists ? 'No Artists' : 'All (' + numArtists.toString() + ' Artist' + (
        numArtists === 1 ? '' : 's'
      ) + ')'
    );

    const artistList = _list.map((artist, index) => {
      const liClass = this.props.selected.indexOf(index - 1) > -1
        ? 'selected' : '';

      return (
        <li onClick={this._handleClick.bind(this, index)}
          key={index} className={liClass}>{artist}</li>
      );
    });

    const className = 'browser artists-browser';

    return (
      <div className={className}>
        <ul>
          {artistList}
        </ul>
      </div>
    );
  }

  _handleClick(index) {
    this.dispatchAction(selectArtist(List.of(index - 1)));
  }
}

BrowserArtists.propTypes = {
  loaded: PropTypes.bool,
  selected: PropTypes.instanceOf(List),
  list: PropTypes.instanceOf(List)
};

