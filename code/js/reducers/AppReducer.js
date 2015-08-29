import { Map as map } from 'immutable';
import Cookies from 'js-cookie';

import buildMessage from '../MessageBuilder';

import {
  SETTINGS_EXPIRY_DAYS
} from '../config';

import {
  SETTINGS_UPDATE_TRIGGERED
} from '../constants/effects';

export const hideSpinner = reduction =>
  reduction.setIn(['appState', 'loadedOnLastRender'], true);

export const storeEventHandler = (reduction, handler) =>
  reduction.setIn(['appState', 'eventHandlers', handler.name], handler.func);

export const customSliderClicked = (reduction, data) => {
  let effects = reduction.get('effects');

  if (data.clickPosition < 0) {
    effects = effects.push(buildMessage(SETTINGS_UPDATE_TRIGGERED));
  }

  return reduction
    .setIn(['appState', 'customSlider', data.name + 'Clicked'], data.clickPosition)
    .set('effects', effects);
};

export const userMenuToggle = (reduction, status) =>
  reduction.setIn(['appState', 'userMenuActive'], status);

export const canNotify = reduction =>
  reduction.setIn(['appState', 'canNotify'], true);

export const setSettings = reduction => {
  // implement settings cookie here
  const settings = JSON.stringify({
    volume: Math.round(reduction.getIn(['appState', 'player', 'volume']) * 1000) / 1000
  });

  Cookies.set('settings', settings, { expires: SETTINGS_EXPIRY_DAYS });

  return reduction;
};

export const getSettings = reduction => {
  const cookie = Cookies.get('settings');

  const settings = cookie ? JSON.parse(cookie) : map();

  const volumeOld = reduction.getIn(['appState', 'player', 'volume']);
  const volumeNew = Math.max(0, Math.min(1, parseFloat(settings.volume, 10)));

  return reduction
    .setIn(['appState', 'loaded', 'settingsCookie'], true)
    .setIn(['appState', 'player', 'volume'], isNaN(volumeNew) ? volumeOld : volumeNew)
  ;
};
