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
        <div className="spinner">
          <div className="bar bar1"/>
          <div className="bar bar2"/>
          <div className="bar bar3"/>
          <div className="bar bar4"/>
          <div className="bar bar5"/>
          <div className="bar bar6"/>
          <div className="bar bar7"/>
          <div className="bar bar8"/>
          <div className="bar bar9"/>
          <div className="bar bar10"/>
          <div className="bar bar11"/>
          <div className="bar bar12"/>
        </div>
      </div>
    );
  }

  _hideSpinner() {
    // sets loadedOnLastRender to true
    this.dispatchAction(hideSpinner());
  }
}

LoadingSpinner.propTypes = {
  loaded: PropTypes.bool,
  loadedOnLastRender: PropTypes.bool
};

