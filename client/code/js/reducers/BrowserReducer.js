import { fromJS } from 'immutable';

import {
  BROWSER_ARTISTS_REQUESTED,
  BROWSER_ARTISTS_FETCHED,

  BROWSER_ALBUMS_REQUESTED,
  BROWSER_ALBUMS_FETCHED,
} from '../constants/Actions';

import {
  BROWSER_ARTISTS_API_CALL,
  BROWSER_ALBUMS_API_CALL,
} from '../constants/Effects';

import buildMessage from '../MessageBuilder';
import buildReducer from './BuildReducer';

export default buildReducer({
  [BROWSER_ARTISTS_REQUESTED]: reduction => {
    return reduction
      .set('effects', reduction
        .get('effects')
        .push(buildMessage(BROWSER_ARTISTS_API_CALL, {}))
      );
  },

  [BROWSER_ARTISTS_FETCHED]: (reduction, artists) => {
    return reduction
      .setIn(['appState', 'loaded', 'browserArtists'], true)
      .setIn(['appState', 'browser', 'listArtists'], fromJS(artists));
  },

  [BROWSER_ALBUMS_REQUESTED]: (reduction, artistIndex) => {
    const artist = artistIndex < 0 ? ''
      : reduction.getIn(['appState', 'browser', 'listArtists']).get(artistIndex);

    return reduction
      .set('effects', reduction
        .get('effects')
        .push(buildMessage(BROWSER_ALBUMS_API_CALL, artist))
      );
  },

  [BROWSER_ALBUMS_FETCHED]: (reduction, albums) => {
    return reduction
      .setIn(['appState', 'loaded', 'browserAlbums'], true)
      .setIn(['appState', 'browser', 'listAlbums'], fromJS(albums));
  },

});

