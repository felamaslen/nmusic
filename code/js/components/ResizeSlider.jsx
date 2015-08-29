// Provides a slider component for e.g. setting the volume

import { } from 'immutable';
import React from 'react';

import {
  storeEventHandler,
  customSliderClicked,
} from '../actions/AppActions';

import PureControllerView from './PureControllerView';

import {
  getOffset,
  sliderMouseDown,
  sliderOnShouldComponentUpdate,
  sliderProps
} from '../common';

export default class ResizeSlider extends PureControllerView {
  componentWillMount() {
    this.dispatchNext(storeEventHandler({
      name: 'ResizeSliderMouseup_' + this.props.name,
      func: this._mouseup.bind(this)
    }));

    this.dispatchNext(storeEventHandler({
      name: 'ResizeSliderMousemove_' + this.props.name,
      func: this._mousemove.bind(this)
    }));
  }

  componentDidMount() {
    this.refs.slider.getDOMNode().addEventListener(
      'mousedown', sliderMouseDown.bind(this, 'slider')
    );
  }

  shouldComponentUpdate(nextProps) {
    return sliderOnShouldComponentUpdate.bind(this, nextProps)();
  }

  render() {
    return (
      <div
        ref="slider"
        className="resize-slider"
        id={`resize-slider-${this.props.name}`}
      />
    );
  }

  _sliderMeasure() {
    const slider = this.refs.slider.getDOMNode();

    // work out the offset of the control element
    const bounds = getOffset(slider);

    return this.props.vertical
      ? { offset: bounds.top, dim: bounds.height }
      : { offset: bounds.left, dim: bounds.width };
  }

  _mousemove(ev) {
    ev.stopPropagation();
    const sliderMeasure = this._sliderMeasure();

    const mouseDelta = this.props.vertical
      ? ev.clientY - this.props.clicked - sliderMeasure.offset
      : ev.clientX - this.props.clicked - slideMeasure.offset;

    const newValue = Math.min(this.props.max, Math.max(
      this.props.min, this.props.value + mouseDelta
    ));

    this.dispatchAction(this.props.changedAction(newValue));
  }

  _mouseup() {
    this.dispatchAction(customSliderClicked({
      name: this.props.name,
      clickPosition: -1
    }));
  }
}

ResizeSlider.propTypes = sliderProps;

ResizeSlider.defaultProps = {
  drag: true
};
