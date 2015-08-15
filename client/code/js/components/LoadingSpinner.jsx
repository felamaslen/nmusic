import React, { PropTypes } from 'react';

import PureControllerView from './PureControllerView';

import { hideSpinner } from '../actions/AppActions';

export default class LoadingSpinner extends PureControllerView {
  componentDidUpdate() {
    if (this.props.loaded && !this.props.loadedOnLastRender) {
      window.setTimeout(() => {
        this._hideSpinner();
      }, 550);
    }
  }

  render() {
    const spinnerClass = this.props.loaded ? 'loaded' : 'not-loaded';

    return this.props.loadedOnLastRender ? false : (
      <div id="spinnerBG" className={spinnerClass}>
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  _hideSpinner() {
    this.dispatchAction(hideSpinner());
  }
}

LoadingSpinner.propTypes = {
  loaded: PropTypes.bool,
  loadedOnLastRender: PropTypes.bool,
};

