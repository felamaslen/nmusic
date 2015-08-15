import { fromJS } from 'immutable';

import {
  BROWSER_FETCH_ARTISTS,
  BROWSER_GOT_ARTISTS,
} from '../constants/Actions';

import {
  BROWSER_ARTISTS_API_CALL,
} from '../constants/Effects';

import buildMessage from '../MessageBuilder';
import buildReducer from './BuildReducer';

// This is the place where all magic belongs
export default buildReducer({
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

