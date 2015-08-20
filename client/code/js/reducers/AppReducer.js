import { } from 'immutable';

export const hideSpinner = reduction => {
  return reduction
    .setIn(['appState', 'loadedOnLastRender'], true);
};
