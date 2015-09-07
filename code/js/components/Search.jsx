import { List } from 'immutable';
import React, { PropTypes } from 'react';
import classNames from 'classnames';

import { keys, debounce } from '../common';

import {
  searchSetValue,
  searchQueryReceived,
  searchSuggestionsReceived,
  searchHoverItem
} from '../actions/SearchActions';

import PureControllerView from './PureControllerView';

const findIndex = _node => {
  let index = 0;
  let node = _node;

  while (node.previousSibling) {
    if (node.nodeType === 1) {
      ++index;
    }
    node = node.previousSibling;
  }
  return index;
};

export default class Search extends PureControllerView {
  componentWillMount() {
    this._getSuggestions = debounce(() => {
      this.dispatchAction(searchQueryReceived());
    }, 200);

    document.body.addEventListener('keydown', this._searchNavigate.bind(this));
  }

  shouldComponentUpdate(nextProps) {
    const newUl = nextProps.results.first();
    const oldUl = this.props.results.first();

    if (newUl < 0 && oldUl > -1) {
      this.refs.search.getDOMNode().focus();
    } else if (newUl > -1 && oldUl < 0) {
      this.refs.search.getDOMNode().blur();
    }

    return true;
  }

  render() {
    const searchResultsKeys = ['artists', 'albums', 'songs'];

    const resultItem = (ul, index, element) => (
      <li onMouseOver={this._hoverItem.bind(this)} key={index} className={classNames({
        active: this.props.hoverIndex.first() === ul && this.props.hoverIndex.last() === index
      })}>{element}</li>
    );

    const resultList = [
      list => list.map((artist, index) => resultItem(0, index, (
        <a>{artist}</a>
      ))),
      list => list.map((album, index) => resultItem(1, index, (
        <a>
          <span className="song-title">{album.first()}</span>
          <span className="song-artist">{album.last()}</span>
        </a>
      ))),
      list => list.map((song, index) => resultItem(2, index, (
        <a>
          <span className="song-title">{song.get(1)}</span>
          <span className="song-artist">{song.get(2)}</span>
        </a>
      )))
    ];

    const results = this.props.results.map((list, listIndex) => {
      const key = searchResultsKeys[listIndex];

      return list.size ? (
        <ul className={key} key={key}>{resultList[listIndex](list)}</ul>
      ) : false;
    });

    const searchResultsClass = classNames({
      'search-results-outer': true,
      'context-menu': true,
      active: this._menuActive()
    });

    const outerClasses = classNames({
      loading: this.props.loading
    });

    return (
      <section id="searchOuter" className={outerClasses}>
        <div className="search-input-outer">
          <input onChange={this._handleInput.bind(this)}
            ref="search" className="search-input" placeholder="Search"/>
          <i className="search-icon"/>
        </div>
        <div ref="searchResults" className={searchResultsClass}>
          {results}
        </div>
      </section>
    );
  }

  _menuActive() {
    return this.props.results.reduce((size, list) => size + list.size, 0) > 0;
  }

  _nextSearchItem() {
    const curUl = this.props.hoverIndex.first();
    const curLi = this.props.hoverIndex.last();

    if (curUl < 0) {
      // search box -> first item in first list
      return List.of(this.props.results.findIndex(list => list.size > 0), 0);
    }

    const newLi = (curLi + 1) % this.props.results.get(curUl).size;
    let newUl = curUl;

    if (!newLi) {
      // last item in list -> first item in next list
      newUl = curUl + 1;

      if (newUl === this.props.results.size) {
        // last item in last list -> search box
        return List.of(-1, null);
      }
    }

    return List.of(newUl, newLi);
  }

  _previousSearchItem() {
    const curUl = this.props.hoverIndex.first();
    const curLi = this.props.hoverIndex.last();

    if (curUl < 0) {
      // search box -> last item in last list
      const listIndex = this.props.results.findLastIndex(list => list.size > 0);
      const listLast = this.props.results.get(listIndex).size - 1;

      return List.of(listIndex, listLast);
    }

    let newLi = curLi - 1;
    let newUl = curUl;

    if (newLi < 0) {
      // first item in list -> last item in previous list
      newUl = curUl - 1;

      if (newUl < 0) {
        // first item in first list -> search box
        return List.of(-1, null);
      }

      newLi = this.props.results.get(newUl).size - 1;
    }

    return List.of(newUl, newLi);
  }

  _searchNavigate(ev) {
    if (this._menuActive()) {
      let newHoverIndex;

      switch (ev.keyCode) {
      case keys.down:
        newHoverIndex = this._nextSearchItem();
        break;
      case keys.up:
        newHoverIndex = this._previousSearchItem();
        break;
      default:
      }

      if (!!newHoverIndex) {
        this.dispatchAction(searchHoverItem(newHoverIndex));
      }
    }
  }

  _hoverItem(ev) {
    ev.stopPropagation();

    const target = ev.target;
    let li;
    switch (target.tagName.toLowerCase()) {
    case 'span':
      li = target.parentNode.parentNode;
      break;
    case 'a':
      li = target.parentNode;
      break;
    case 'li':
    default:
      li = target;
    }

    const ul = li.parentNode;

    const liIndex = findIndex(li);
    const ulIndex = findIndex(ul);

    this.dispatchAction(searchHoverItem([ulIndex, liIndex]));
  }

  _handleInput(ev) {
    const value = ev.target && ev.target.value ? ev.target.value : '';

    this.dispatchAction(searchSetValue(value));

    this._getSuggestions();

    if (!value.length) {
      this.dispatchNext(searchSuggestionsReceived(false));
    }
  }
}

Search.propTypes = {
  loading: PropTypes.bool,
  results: PropTypes.instanceOf(List),
  hoverIndex: PropTypes.instanceOf(List)
};
