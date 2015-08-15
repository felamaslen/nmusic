import { decompressSongs } from '../common';

import { fromJS } from 'immutable';

import {
  BROWSER_ARTISTS_REQUESTED,
  BROWSER_ARTISTS_FETCHED,

  BROWSER_ALBUMS_REQUESTED,
  BROWSER_ALBUMS_FETCHED,

  BROWSER_ARTIST_SELECTED,
  BROWSER_ALBUM_SELECTED,

  LIST_ARTIST_SELECTED,
  LIST_ALBUM_SELECTED,
} from '../constants/Actions';

import {
  BROWSER_ARTISTS_API_CALL,
  BROWSER_ALBUMS_API_CALL,

  LIST_ARTIST_API_CALL,
  LIST_ALBUM_API_CALL,
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

  [BROWSER_ARTIST_SELECTED]: (reduction, index) => {
    const artist = index < 0
      ? '' : reduction.getIn(['appState', 'browser', 'listArtists']).get(index);

    return reduction
      .setIn(['appState', 'browser', 'selectedArtist'], index)
      .set('effects', reduction
        .get('effects')
        .push(buildMessage(
          LIST_ARTIST_API_CALL,
          artist
        ))
      )
    ;
  },

  [BROWSER_ALBUM_SELECTED]: (reduction, index) => {
    const artistIndex = reduction.getIn(['appState', 'browser', 'selectedArtist']);

    const artist = artistIndex < 0
      ? '' : reduction.getIn(['appState', 'browser', 'listArtists']).get(artistIndex);

    const album = index < 0
      ? '' : reduction.getIn(['appState', 'browser', 'listAlbums']).get(index);

    return reduction
      .setIn(['appState', 'browser', 'selectedAlbum'], index)
      .set('effects', reduction
        .get('effects')
        .push(buildMessage(
          LIST_ALBUM_API_CALL,
          { artist: artist, album: album }
        ))
      )
    ;
  },

  [LIST_ARTIST_SELECTED]: (reduction, res) => {
    const _songs = res.songs.map(decompressSongs);

    return reduction
      .setIn(['appState', 'songList', 'list'], fromJS(_songs))
      .setIn(['appState', 'browser', 'selectedAlbum'], -1)
      .setIn(['appState', 'browser', 'listAlbums'], fromJS(res.albums))
    ;
  },

  [LIST_ALBUM_SELECTED]: (reduction, res) => {
    const _songs = typeof res.songs === 'object'
      ? res.songs.map(decompressSongs) : res.map(decompressSongs);

    return reduction
      .setIn(['appState', 'songList', 'list'], fromJS(_songs))
    ;
  },
});

