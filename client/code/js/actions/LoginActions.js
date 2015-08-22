import buildMessage from '../MessageBuilder';

export const attemptLogin = details => buildMessage('AUTH_LOGIN_ATTEMPTED', details);
export const authGotResponse = response => buildMessage('AUTH_LOGIN_GOT_RESPONSE', response);
