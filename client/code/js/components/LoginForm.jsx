// displays a login form

import { } from 'immutable';
import React, { PropTypes } from 'react';
import Cookies from 'js-cookie';

import PureControllerView from './PureControllerView';

import {
  attemptLogin,
  setPersistentToken
} from '../actions/LoginActions';

export default class LoginForm extends PureControllerView {
  componentWillMount() {
    // persistent login
    const tokenCookie = Cookies.get('token');
    if (!!tokenCookie) {
      this.dispatchAction(setPersistentToken(tokenCookie));
    }
  }

  render() {
    let statusMessage;
    let statusType;
    let renderForm = true;

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
    case 3.1:
      statusMessage = 'Authenticating using stored session...';
      statusType = 'loading-fromstored';
      renderForm = false;
      break;
    case 4:
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

    return this.props.status ? (
      <section id="loginArea">
        {statusBlock}
        {form}
      </section>
    ) : false;
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
