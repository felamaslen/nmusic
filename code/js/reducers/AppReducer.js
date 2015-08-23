import { } from 'immutable';

export const hideSpinner = reduction =>
  reduction.setIn(['appState', 'loadedOnLastRender'], true);

export const storeEventHandler = (reduction, handler) =>
  reduction.setIn(['appState', 'eventHandlers', handler.name], handler.func);
