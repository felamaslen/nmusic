// displays a login form

import { } from 'immutable';
import React, { PropTypes } from 'react';
import Cookies from 'js-cookie';

import {
  AUTH_STATUS_LOGGED_IN,
  AUTH_STATUS_BAD_LOGIN,
  AUTH_STATUS_WAITING,
  AUTH_STATUS_LOADING,
  AUTH_STATUS_LOADING_FROM_COOKIE,
  AUTH_STATUS_SERVER_ERROR
} from '../config';

import PureControllerView from './PureControllerView';

import {
  attemptLogin,
  setPersistentToken
} from '../actions/LoginActions';

export default class LoginForm extends PureControllerView {
  componentWillMount() {
    // persistent login
    this.dispatchNext(setPersistentToken(Cookies.get('token')));
  }

  render() {
    let statusMessage;
    let statusType;
    let renderForm = true;

    switch (this.props.status) {
    case AUTH_STATUS_LOGGED_IN:
      statusMessage = 'Logged in!';
      statusType = 'success';
      break;
    case AUTH_STATUS_BAD_LOGIN:
      statusMessage = 'Bad info!';
      statusType = 'error';
      break;
    case AUTH_STATUS_WAITING:
      statusMessage = 'Please log in';
      statusType = 'input';
      break;
    case AUTH_STATUS_LOADING:
      statusMessage = 'Loading...';
      statusType = 'loading';
      break;
    case AUTH_STATUS_LOADING_FROM_COOKIE:
      statusMessage = 'Authenticating using stored session...';
      statusType = 'loading-fromstored';
      renderForm = false;
      break;
    case AUTH_STATUS_SERVER_ERROR:
    default:
      statusMessage = 'Unknown error';
      statusType = 'error';
    }

    const statusBlock = (
      <span className={statusType}>{statusMessage}</span>
    );

    const form = renderForm ? (
      <form onSubmit={this._attemptLogin.bind(this)}>
        <input className="input-username" ref="username" placeholder="Username"/>
        <input className="input-password" ref="password" placeholder="Password" type="password"/>
        <input className="button-login" type="submit" value="Login"/>
        <input className="rememberme" ref="rememberme" type="checkbox"/>Remember me
      </form>
    ) : false;

    return this.props.status === AUTH_STATUS_LOGGED_IN ? false : (
      <section id="loginArea">
        {statusBlock}
        {form}
      </section>
    );
  }

  _attemptLogin(ev) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dispatchAction(attemptLogin({
      username: this.refs.username.getDOMNode().value,
      password: this.refs.password.getDOMNode().value,
      rememberme: this.refs.rememberme.getDOMNode().checked
    }));
  }
}

LoginForm.propTypes = {
  status: PropTypes.number
};
