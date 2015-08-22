// displays a login form

import { } from 'immutable';
import React, { PropTypes } from 'react';

import PureControllerView from './PureControllerView';

import {
  attemptLogin
} from '../actions/LoginActions';

export default class LoginForm extends PureControllerView {
  render() {
    let statusMessage;
    let statusType;

    switch (this.props.status) {
    case 0:
      statusMessage = 'Logged in!';
      statusType = 'success';
      break;
    case 1:
      statusMessage = 'Bad info!';
      statusType = 'error';
      break;
    case 2:
      statusMessage = 'Please log in';
      statusType = 'input';
      break;
    case 3:
      statusMessage = 'Loading...';
      statusType = 'loading';
      break;
    case 4:
    default:
      statusMessage = 'Unknown error';
      statusType = 'error';
    }

    const statusBlock = (
      <span className={statusType}>{statusMessage}</span>
    );

    return this.props.status ? (
      <section id="loginArea">
        {statusBlock}
        <input className="input-username" ref="username" placeholder="Username"/>
        <input className="input-password" ref="password" placeholder="Password" type="password"/>
        <button className="button-login" onClick={this._attemptLogin.bind(this)}>
          Login
        </button>
      </section>
    ) : false;
  }

  _attemptLogin() {
    this.dispatchAction(attemptLogin({
      username: this.refs.username.getDOMNode().value,
      password: this.refs.password.getDOMNode().value
    }));
  }
}

LoginForm.propTypes = {
  status: PropTypes.number
};
