import { fromJS } from 'immutable';
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
  let newReduction = reduction;

  const cols = ['title', 'artist', 'album', 'genre'];
  const colIndex = cols.indexOf(data.name);
  const isCol = colIndex > -1;

  let effects = reduction.get('effects');

  newReduction = newReduction
    .setIn(['appState', 'slider', `${data.name}Clicked`], data.clickPosition);

  if ((
    isCol ||
    data.name === 'volume' ||
    data.name === 'resizeBrowser'
  ) && data.clickPosition < 0) {
    effects = effects.push(buildMessage(SETTINGS_UPDATE_TRIGGERED));

    if (isCol) {
      newReduction = newReduction
        .setIn(
          ['appState', 'songList', 'colWidthActual', data.name],
          reduction.getIn(['appState', 'songList', 'colWidthPreview', data.name])
        );
    }
  }

  return newReduction
    .set('effects', effects);
};

export const userMenuToggle = (reduction, status) =>
  reduction.setIn(['appState', 'userMenuActive'], status);

export const canNotify = reduction =>
  reduction.setIn(['appState', 'canNotify'], true);

export const setSettings = reduction => {
  // implement settings cookie here
  // Since cookie size is limited to 4093 bytes, use short keys
  const settings = JSON.stringify({
    v: Math.round(reduction.getIn(['appState', 'player', 'volume']) * 1000) / 1000,
    b: reduction.getIn(['appState', 'browser', 'height']),
    c: reduction.getIn(['appState', 'songList', 'colWidthActual']).toJS(),
    o: reduction.getIn(['appState', 'songList', 'orderBy']).toJS()
  });

  Cookies.set('settings', settings, { expires: SETTINGS_EXPIRY_DAYS });

  return reduction;
};

export const getSettings = reduction => {
  const _old = {
    volume: reduction.getIn(['appState', 'player', 'volume']),
    browserHeight: reduction.getIn(['appState', 'browser', 'height']),
    colWidthActual: reduction.getIn(['appState', 'songList', 'colWidthActual']),
    orderBy: reduction.getIn(['appState', 'songList', 'orderBy'])
  };

  const _new = {};

  const cookie = Cookies.get('settings');
  const settings = cookie ? JSON.parse(cookie) : {};

  if (typeof settings.v !== 'undefined') {
    _new.volume = Math.max(0, Math.min(1, parseFloat(settings.v, 10)));
  }

  if (typeof settings.b !== 'undefined') {
    _new.browserHeight = Math.max(BROWSER_MIN_HEIGHT, Math.min(
      parseInt(settings.b, 10),
      reduction.getIn(['appState', 'browser', 'maxHeight'])
    ));
  }

  if (typeof settings.c !== 'undefined') {
    _new.colWidth = fromJS(settings.c);
  }

  if (typeof settings.o !== 'undefined') {
    _new.orderBy = fromJS(settings.o);
  }

  const newVolume = typeof _new.volume !== 'undefined' && !isNaN(_new.volume)
    ? _new.volume : _old.volume;

  const newBrowserHeight = typeof _new.browserHeight !== 'undefined' && !isNaN(_new.browserHeight)
    ? _new.browserHeight : _old.browserHeight;

  const newColWidth = _new.colWidth || _old.colWidthActual;

  const newOrderBy = _new.orderBy || _old.orderBy;

  return reduction
    .setIn(['appState', 'loaded', 'settingsCookie'], true)
    .setIn(['appState', 'player', 'volume'], newVolume)
    .setIn(['appState', 'browser', 'height'], newBrowserHeight)
    .setIn(['appState', 'songList', 'colWidthPreview'], newColWidth)
    .setIn(['appState', 'songList', 'colWidthActual'], newColWidth)
    .setIn(['appState', 'songList', 'orderBy'], newOrderBy)
  ;
};

export const resizeGlobal = reduction => {
  const newBrowserMaxHeight = Math.max(60, window.innerHeight - 160);
  const newBrowserHeight = Math.min(newBrowserMaxHeight, reduction.getIn(['appState', 'browser', 'height']));

  return reduction
    .setIn(['appState', 'browser', 'maxHeight'], newBrowserMaxHeight)
    .setIn(['appState', 'browser', 'height'], newBrowserHeight)
  ;
};
