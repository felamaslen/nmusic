import { } from 'immutable';
import Cookie from 'js-cookie';

import { REMEMBERME_DAYS } from '../config';

import buildMessage from '../MessageBuilder';

export const attemptLogin = (reduction, details) => {
  return reduction
    .setIn(['appState', 'auth', 'status'], 3)
    .set('effects', reduction.get('effects').push(
      buildMessage('AUTHENTICATE_API_CALL', details)
    ))
  ;
};

export const setPersistentToken = (reduction, token) => {
  return reduction
    .setIn(['appState', 'auth', 'status'], 3.1)
    .setIn(['appState', 'auth', 'token'], token)
    .set('effects', reduction.get('effects').push(
      buildMessage('AUTHTEST_API_CALL', token)
    ))
  ;
};

export const authGotResponse = (reduction, obj) => {
  const serverError = !obj.response || obj.response.status !== 200 || !obj.response.data;

  let token = '';

  let newStatus = 2;

  if (serverError) {
    newStatus = 4;
  } else if (!obj.response.data.success) {
    newStatus = obj.fromPersistentLogin ? 2 : 1;
  } else {
    newStatus = 0;

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

  return reduction
    .setIn(['appState', 'auth', 'status'], newStatus)
    .setIn(['appState', 'auth', 'token'], token)
  ;
};
