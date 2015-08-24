import { } from 'immutable';

export const hideSpinner = reduction =>
  reduction.setIn(['appState', 'loadedOnLastRender'], true);

export const storeEventHandler = (reduction, handler) =>
  reduction.setIn(['appState', 'eventHandlers', handler.name], handler.func);

export const customSliderClicked = (reduction, data) =>
  reduction.setIn(['appState', 'customSlider', data.name + 'Clicked'], data.clickPosition);

export const canNotify = reduction =>
  reduction.setIn(['appState', 'canNotify'], true);
