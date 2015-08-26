import { } from 'immutable';
import Cookie from 'js-cookie';

import {
  REMEMBERME_DAYS,
  AUTH_STATUS_LOGGED_IN,
  AUTH_STATUS_BAD_LOGIN,
  AUTH_STATUS_LOADING,
  AUTH_STATUS_WAITING,
  AUTH_STATUS_LOADING_FROM_COOKIE,
  AUTH_STATUS_SERVER_ERROR
} from '../config';

import buildMessage from '../MessageBuilder';

export const attemptLogin = (reduction, details) => {
  return reduction
    .setIn(['appState', 'auth', 'status'], AUTH_STATUS_LOADING)
    .set('effects', reduction.get('effects').push(
      buildMessage('AUTHENTICATE_API_CALL', details)
    ))
  ;
};

const afterCheckAuth = (reduction, displayAuth) => {
  const newLoaded = reduction.getIn(['appState', 'loaded']).map(() => !!displayAuth)
    .set('authStatus', true);

  return reduction.setIn(['appState', 'loaded'], newLoaded);
};

export const setPersistentToken = (reduction, token) => {
  return !!token
    ? reduction
      .setIn(['appState', 'auth', 'status'], AUTH_STATUS_LOADING_FROM_COOKIE)
      .setIn(['appState', 'auth', 'token'], token)
      .set('effects', reduction.get('effects').push(
        buildMessage('AUTHTEST_API_CALL', token)
      ))
    : afterCheckAuth(reduction, true);
};

export const authGotResponse = (reduction, obj) => {
  const serverError = !obj.response || obj.response.status !== 200 || !obj.response.data;

  let token = '';

  let newStatus = AUTH_STATUS_WAITING;

  if (serverError) {
    newStatus = AUTH_STATUS_SERVER_ERROR;
  } else if (!obj.response.data.success) {
    newStatus = obj.fromPersistentLogin ? AUTH_STATUS_LOADING : AUTH_STATUS_BAD_LOGIN;
  } else {
    newStatus = AUTH_STATUS_LOGGED_IN;

    if (!obj.fromPersistentLogin) {
      // Set cookie for persistent login
      // If the "rememberme" option was not set, then make the persistence
      // expire after the current session
      const options = {};
      if (obj.rememberme) {
        options.expires = REMEMBERME_DAYS;
      }

      Cookie.set('token', obj.response.data.token, options);
    }

    token = obj.fromPersistentLogin
      ? obj.token
      : obj.response.data.token;
  }

  return afterCheckAuth(reduction, newStatus)
    .setIn(['appState', 'auth', 'status'], newStatus)
    .setIn(['appState', 'auth', 'token'], token)
  ;
};
