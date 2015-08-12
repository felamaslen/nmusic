import React, { PropTypes } from 'react';

import PureControllerView from './PureControllerView';

import { hideSpinner } from '../actions/AppActions';

export default class LoadingSpinner extends PureControllerView {
  render() {
    const spinnerStyle = {};

    if (this.props.loaded) {
      if (!this.props.loadedOnLastRender) {
        spinnerStyle.opacity = 0;

        this._hideSpinner();
      }
    }

    return this.props.loadedOnLastRender ? false : (
      <div id="spinnerBG" style={spinnerStyle}>
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  _hideSpinner() {
    window.setTimeout(() => {
      this.dispatchAction(hideSpinner());
    }, 250);
  }
}

LoadingSpinner.propTypes = {
  loaded: PropTypes.bool,
  loadedOnLastRender: PropTypes.bool,
};

