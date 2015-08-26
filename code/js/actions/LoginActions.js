import buildMessage from '../MessageBuilder';

export const attemptLogin = details => buildMessage('AUTH_LOGIN_ATTEMPTED', details);
export const logout = () => buildMessage('AUTH_LOGOUT_REQUESTED');
export const setPersistentToken = token => buildMessage('AUTH_TOKEN_SET', token);
export const authGotResponse = response => buildMessage('AUTH_LOGIN_GOT_RESPONSE', response);
