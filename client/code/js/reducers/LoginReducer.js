import { } from 'immutable';

import buildMessage from '../MessageBuilder';

export const attemptLogin = (reduction, details) => {
  return reduction
    .setIn(['appState', 'auth', 'status'], 3)
    .set('effects', reduction.get('effects').push(
      buildMessage('AUTHENTICATE_API_CALL', details)
    ))
  ;
};

export const authGotResponse = (reduction, response) => {
  const serverError = !response || response.status !== 200 || !response.data;

  let token = '';

  let newStatus;
  if (serverError) {
    newStatus = 4;
  } else if (!response.data.success) {
    newStatus = 1;
  } else {
    newStatus = 0;

    token = response.data.token;
  }

  return reduction
    .setIn(['appState', 'auth', 'status'], newStatus)
    .setIn(['appState', 'auth', 'token'], token)
  ;
};
