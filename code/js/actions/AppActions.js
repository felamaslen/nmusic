import buildMessage from '../MessageBuilder';

export const hideSpinner = () => buildMessage('APP_SPINNER_HIDDEN');

export const storeEventHandler = handler => buildMessage('APP_EVENT_HANDLER_STORED', handler);

export const customSliderClicked = data => buildMessage('APP_SLIDER_CLICKED', data);

export const userMenuToggle = status => buildMessage('APP_MENU_TOGGLED', status);

export const canNotify = () => buildMessage('APP_NOTIFICATIONS_ALLOWED');

