/**
 * browser which lists albums
 */

import { itemInRanges } from '../common';

import React, { PropTypes } from 'react';
import { List } from 'immutable';
import classNames from 'classnames';

import PureControllerView from './PureControllerView';

import {
  selectAlbum,
} from '../actions/BrowserActions';

export default class BrowserAlbums extends PureControllerView {
  render() {
    const numAlbums = this.props.list.size;

    const _list = this.props.list.unshift(
      !numAlbums ? 'No Albums' : 'All (' + numAlbums.toString() + ' Album' + (
        numAlbums === 1 ? '' : 's'
      ) + ')'
    );

    const albumList = _list.map((album, index) => {
      const liClass = classNames({
        selected: itemInRanges(this.props.selected, index - 1) > -1
      });

      return (
        <li onMouseDown={this._selectAlbum.bind(this, index)}
          key={index} className={liClass}>{album}</li>
      );
    });

    const className = classNames({
      browser: true,
      'albums-browser': true,
      noselect: true
    });

    return (
      <div className={className}>
        <ul>
          {albumList}
        </ul>
      </div>
    );
  }

  _selectAlbum(index, ev) {
    this.dispatchAction(selectAlbum({
      ctrl: ev.ctrlKey,
      shift: ev.shiftKey,
      index: index - 1
    }));
  }
}

BrowserAlbums.propTypes = {
  loaded: PropTypes.bool,
  selected: PropTypes.instanceOf(List),
  selectedArtists: PropTypes.instanceOf(List),
  list: PropTypes.instanceOf(List)
};

