// Provides a slider component for e.g. setting the volume

import { List } from 'immutable';
import React, { PropTypes } from 'react';

import {
  storeEventHandler,
  customSliderClicked
} from '../actions/AppActions';

import PureControllerView from './PureControllerView';

const getOffset = element => element.getBoundingClientRect();

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
    this.refs.btn.getDOMNode().addEventListener('mousedown', ev => {
      ev.stopPropagation();
      if (this.props.drag) {
        const offset = getOffset(this.refs.btn.getDOMNode()).left;

        this.dispatchAction(customSliderClicked({
          name: this.props.name,
          clickPosition: ev.clientX - offset
        }));
      }
    });

    const sliderMeasure = this._sliderMeasure();

    this.refs.slider.getDOMNode().addEventListener('mousedown', ev => {
      const position = ev.clientX - sliderMeasure.left;

      const newValue = Math.min(
        this.props.max, Math.max(
          this.props.min,
          this.props.min + (this.props.max - this.props.min) * position / sliderMeasure.width
        )
      );
   
      this.dispatchAction(this.props.changedAction(newValue));
    });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.clicked > -1 && this.props.clicked < 0) {
      window.addEventListener('mouseup', this.props.eventHandlers.get(0), false);
      window.addEventListener('mousemove', this.props.eventHandlers.get(1), false);
    } else if (nextProps.clicked < 0 && this.props.clicked > -1) {
      window.removeEventListener('mouseup', this.props.eventHandlers.get(0), false);
      window.removeEventListener('mousemove', this.props.eventHandlers.get(1), false);
    }

    return true;
  }

  render() {
    // we set the styles here because CSS doesn't seem to
    // support using data attributes in the declaration :'(
    const sliderStyle = {
      width:
        (
          100 * this.props.value / (this.props.max - this.props.min)
        ) + '%',

      backgroundColor:
        'rgba(' + this.props.colors(this.props.value)
        .map(color => Math.round(255 * color))
        .reduce((r, s) => r + ',' + s) + ',0.4)'
    };

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
    this.dispatchAction(customSliderClicked({
      name: this.props.name,
      clickPosition: -1
    }));
  }
}

CustomSlider.propTypes = {
  drag: PropTypes.bool,
  clicked: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number,
  name: PropTypes.string,
  colors: PropTypes.func,
  changedAction: PropTypes.func,
  clickedAction: PropTypes.func,
  eventHandlers: PropTypes.instanceOf(List)
};

CustomSlider.defaultProps = {
  drag: true
};

