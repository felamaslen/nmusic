import buildMessage from '../MessageBuilder';

export const hideSpinner = () => buildMessage('APP_SPINNER_HIDDEN');

export const storeEventHandler = handler => buildMessage('APP_EVENT_HANDLER_STORED', handler);
