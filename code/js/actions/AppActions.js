import buildMessage from '../MessageBuilder';

import {
  APP_SPINNER_HIDDEN,
  APP_EVENT_HANDLER_STORED,
  APP_SLIDER_CLICKED,
  APP_MENU_TOGGLED,
  APP_NOTIFICATIONS_ALLOWED
} from '../constants/actions';

export const hideSpinner = () => buildMessage(APP_SPINNER_HIDDEN);

export const storeEventHandler = handler => buildMessage(APP_EVENT_HANDLER_STORED, handler);

export const customSliderClicked = data => buildMessage(APP_SLIDER_CLICKED, data);

export const userMenuToggle = status => buildMessage(APP_MENU_TOGGLED, status);

export const canNotify = () => buildMessage(APP_NOTIFICATIONS_ALLOWED);

