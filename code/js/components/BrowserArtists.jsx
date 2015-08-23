/**
 * browser which lists artists
 */

import { itemInRanges } from '../common';

import React, { PropTypes } from 'react';
import { List } from 'immutable';
import classNames from 'classnames';

import PureControllerView from './PureControllerView';

import {
  loadListArtists,
  selectArtist,
} from '../actions/BrowserActions';

export default class BrowserArtists extends PureControllerView {
  componentWillMount() {
    this.dispatchNext(loadListArtists());
    this.dispatchNext(selectArtist({ index: -1 }));
  }

  render() {
    const numArtists = this.props.list.size;

    const _list = this.props.list.unshift(
      !numArtists ? 'No Artists' : 'All (' + numArtists.toString() + ' Artist' + (
        numArtists === 1 ? '' : 's'
      ) + ')'
    );

    const artistList = _list.map((artist, index) => {
      const liClass = itemInRanges(this.props.selected, index - 1) > -1
        ? 'selected' : '';

      return (
        <li onMouseDown={this._selectArtist.bind(this, index)}
          key={index} className={liClass}>{artist}</li>
      );
    });

    const className = classNames({
      browser: true,
      'artists-browser': true,
      noselect: true
    });

    return (
      <div className={className}>
        <ul>
          {artistList}
        </ul>
      </div>
    );
  }

  _selectArtist(index, ev) {
    this.dispatchAction(selectArtist({
      ctrl: ev.ctrlKey,
      shift: ev.shiftKey,
      index: index - 1
    }));
  }
}

BrowserArtists.propTypes = {
  loaded: PropTypes.bool,
  selected: PropTypes.instanceOf(List),
  list: PropTypes.instanceOf(List)
};

