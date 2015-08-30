// Provides a slider component for e.g. setting the volume

import { } from 'immutable';
import React from 'react';

import {
  storeEventHandler,
  sliderClicked,
  setSettings
} from '../actions/AppActions';

import PureControllerView from './PureControllerView';

import {
  getOffset,
  sliderMouseDown,
  sliderOnShouldComponentUpdate,
  sliderProps
} from '../common';

export default class CustomSlider extends PureControllerView {
  componentWillMount() {
    if (this.props.drag) {
      this.dispatchNext(storeEventHandler({
        name: 'CustomSliderMouseup_' + this.props.name,
        func: this._mouseup.bind(this)
      }));

      this.dispatchNext(storeEventHandler({
        name: 'CustomSliderMousemove_' + this.props.name,
        func: this._mousemove.bind(this)
      }));
    }
  }

  componentDidMount() {
    // click the button to grab it and start moving it
    this.refs.btn.getDOMNode().addEventListener(
      'mousedown', sliderMouseDown.bind(this, 'btn')
    );

    const sliderMeasure = this._sliderMeasure();

    // click the slider to skip to a value
    this.refs.slider.getDOMNode().addEventListener('mousedown', ev => {
      const position = ev.clientX - sliderMeasure.left;

      const newValue = Math.min(
        this.props.max, Math.max(
          this.props.min,
          this.props.min + (this.props.max - this.props.min) * position / sliderMeasure.width
        )
      );

      this.dispatchAction(this.props.changedAction(newValue));
      this.dispatchAction(setSettings());
    });
  }

  shouldComponentUpdate(nextProps) {
    return sliderOnShouldComponentUpdate.bind(this, nextProps)();
  }

  render() {
    // we set the styles here because CSS doesn't seem to
    // support using data attributes in the declaration :'(
    const sliderWidth = 100 * this.props.value / (this.props.max - this.props.min);

    const sliderStyle = {
      width: `${sliderWidth}%`
    };

    if (!!this.props.colors) {
      const backgroundColor = this.props.colors(this.props.value).map(
        (color, index) => index < 3 ? Math.round(255 * color) : color
      ).reduce((r, s) => `${r},${s}`);

      sliderStyle.backgroundColor = `rgba(${backgroundColor})`;
    }

    return (
      <div ref="slider" className="slider">
        <div className="inside" style={sliderStyle}>
          <div ref="btn" className="slider-ctrl"></div>
        </div>
      </div>
    );
  }

  _sliderMeasure() {
    const slider = this.refs.slider.getDOMNode();

    // work out the offset of the control element
    const bounds = getOffset(slider);

    return { left: bounds.left, width: bounds.width };
  }

  _mousemove(ev) {
    const sliderMeasure = this._sliderMeasure();
    const position = ev.clientX - sliderMeasure.left - this.props.clicked + 8;

    const newValue = Math.min(this.props.max, Math.max(
      this.props.min, position / sliderMeasure.width)
    );

    this.dispatchAction(this.props.changedAction(newValue));
  }

  _mouseup() {
    this.dispatchAction(sliderClicked({
      name: this.props.name,
      clickPosition: -1
    }));
  }
}

CustomSlider.propTypes = sliderProps;

CustomSlider.defaultProps = {
  drag: true,
  colors: null
};

