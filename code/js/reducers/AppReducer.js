import { } from 'immutable';
import Cookies from 'js-cookie';

import buildMessage from '../MessageBuilder';

import {
  SETTINGS_EXPIRY_DAYS,
  BROWSER_MIN_HEIGHT
} from '../config';

import {
  SETTINGS_UPDATE_TRIGGERED
} from '../constants/effects';

export const hideSpinner = reduction =>
  reduction.setIn(['appState', 'loadedOnLastRender'], true);

export const storeEventHandler = (reduction, handler) =>
  reduction.setIn(['appState', 'eventHandlers', handler.name], handler.func);

export const sliderClicked = (reduction, data) => {
  let effects = reduction.get('effects');

  if ((
    data.name === 'volume' ||
    data.name === 'resizeBrowser'
  ) && data.clickPosition < 0) {
    effects = effects.push(buildMessage(SETTINGS_UPDATE_TRIGGERED));
  }

  return reduction
    .setIn(['appState', 'slider', `${data.name}Clicked`], data.clickPosition)
    .set('effects', effects);
};

export const userMenuToggle = (reduction, status) =>
  reduction.setIn(['appState', 'userMenuActive'], status);

export const canNotify = reduction =>
  reduction.setIn(['appState', 'canNotify'], true);

export const setSettings = reduction => {
  // implement settings cookie here
  const settings = JSON.stringify({
    volume: Math.round(reduction.getIn(['appState', 'player', 'volume']) * 1000) / 1000,
    browserHeight: reduction.getIn(['appState', 'browser', 'height'])
  });

  Cookies.set('settings', settings, { expires: SETTINGS_EXPIRY_DAYS });

  return reduction;
};

export const getSettings = reduction => {
  const _old = {
    volume: reduction.getIn(['appState', 'player', 'volume']),
    browserHeight: reduction.getIn(['appState', 'browser', 'height'])
  };

  const _new = {};

  const cookie = Cookies.get('settings');
  const settings = cookie ? JSON.parse(cookie) : {};

  if (typeof settings.volume !== 'undefined') {
    _new.volume = Math.max(0, Math.min(1, parseFloat(settings.volume, 10)));
  }

  if (typeof settings.browserHeight !== 'undefined') {
    _new.browserHeight = Math.max(BROWSER_MIN_HEIGHT, Math.min(
      parseInt(settings.browserHeight, 10),
      reduction.getIn(['appState', 'browser', 'maxHeight'])
    ));
  }

  const newVolume = typeof _new.volume !== 'undefined' && !isNaN(_new.volume)
    ? _new.volume : _old.volume;

  const newBrowserHeight = typeof _new.browserHeight !== 'undefined' && !isNaN(_new.browserHeight)
    ? _new.browserHeight : _old.browserHeight;

  return reduction
    .setIn(['appState', 'loaded', 'settingsCookie'], true)
    .setIn(['appState', 'player', 'volume'], newVolume)
    .setIn(['appState', 'browser', 'height'], newBrowserHeight)
  ;
};
