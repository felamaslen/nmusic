import { Map as map, fromJS } from 'immutable';

import {
  APP_HIDE_SPINNER,
  BROWSER_FETCH_ARTISTS,
  BROWSER_GOT_ARTISTS,
} from '../constants/Actions';

import {
  BROWSER_ARTISTS_API_CALL,
} from '../constants/Effects';

import buildMessage from '../MessageBuilder';

const buildReducer = handlers => {
  return (reduction, action) => {
    return map(handlers)
      .filter((handler, actionType) => actionType === action.type)
      .reduce((partialReduction, handler) => handler(partialReduction, action.payload), reduction);
  };
};

// This is the place where all magic belongs
export default buildReducer({
  [APP_HIDE_SPINNER]: reduction => {
    return reduction
      .setIn(['appState', 'loadedOnLastRender'], true);
  },

  [BROWSER_FETCH_ARTISTS]: reduction => {
    return reduction
      .set('effects', reduction
        .get('effects')
        .push(buildMessage(BROWSER_ARTISTS_API_CALL, {}))
      );
  },

  [BROWSER_GOT_ARTISTS]: (reduction, artists) => {
    return reduction
      .setIn(['appState', 'loaded', 'browserArtists'], true)
      .setIn(['appState', 'browser', 'listArtists'], fromJS(artists));
  },

});
