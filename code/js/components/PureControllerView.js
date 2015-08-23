import React from 'react';
import shallowEqual from 'react-pure-render/shallowEqual';

export default class PureControllerView extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    return !shallowEqual(this.props, nextProps) ||
           !shallowEqual(this.state, nextState);
  }

  dispatchAction(action) {
    this.props.dispatcher.dispatch(action);
  }

  dispatchNext(action) {
    window.setTimeout(() => this.props.dispatcher.dispatch(action), 0);
  }

}
