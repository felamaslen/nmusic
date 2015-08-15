import { fromJS } from 'immutable';

import {
  BROWSER_FETCH_ARTISTS,
  BROWSER_GOT_ARTISTS,

  BROWSER_FETCH_ALBUMS,
  BROWSER_GOT_ALBUMS,
} from '../constants/Actions';

import {
  BROWSER_ARTISTS_API_CALL,
  BROWSER_ALBUMS_API_CALL,
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

  [BROWSER_FETCH_ALBUMS]: (reduction, artistIndex) => {
    const artist = artistIndex < 0 ? ''
      : reduction.getIn(['appState', 'browser', 'listArtists']).get(artistIndex);

    return reduction
      .set('effects', reduction
        .get('effects')
        .push(buildMessage(BROWSER_ALBUMS_API_CALL, artist))
      );
  },

  [BROWSER_GOT_ALBUMS]: (reduction, albums) => {
    return reduction
      .setIn(['appState', 'loaded', 'browserAlbums'], true)
      .setIn(['appState', 'browser', 'listAlbums'], fromJS(albums));
  },

});

