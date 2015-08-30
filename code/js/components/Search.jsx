import { } from 'immutable';
import React, { PropTypes } from 'react';

import PureControllerView from './PureControllerView';

export default class Search extends PureControllerView {
  render() {
    return (
      <section id="searchOuter">
        <div className="search-input-outer">
          <input ref="search" className="search-input" placeholder="Search"/>
          <i className="search-icon"/>
        </div>
      </section>
    );
  }
}

Search.propTypes = {
  searchTerm: PropTypes.string
};
