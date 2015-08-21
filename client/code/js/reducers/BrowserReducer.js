import { decompressSongs } from '../common';

import { List, fromJS } from 'immutable';

import buildMessage from '../MessageBuilder';

export const loadListArtists = reduction => {
  return reduction
    .set('effects', reduction
      .get('effects')
      .push(buildMessage('BROWSER_ARTISTS_API_CALL', {}))
    );
};

export const gotListArtists = (reduction, response) => {
  const error = typeof response.body !== 'object';

  return reduction
    .setIn(['appState', 'loaded', 'browserArtists'], true)
    .setIn(['appState', 'browser', 'listArtists'], error ? List.of() : fromJS(response.body));
};

export const loadListAlbums = (reduction, artistIndex) => {
  const artist = artistIndex < 0 ? ''
    : reduction.getIn(['appState', 'browser', 'listArtists']).get(artistIndex);

  return reduction
    .set('effects', reduction
      .get('effects')
      .push(buildMessage('BROWSER_ALBUMS_API_CALL', { artist: artist }))
    );
};

export const gotListAlbums = (reduction, response) => {
  const error = typeof response.body !== 'object';

  return reduction
    .setIn(['appState', 'loaded', 'browserAlbums'], true)
    .setIn(['appState', 'browser', 'listAlbums'], error ? List.of() : fromJS(response.body));
};

export const selectArtist = (reduction, index) => {
  const artist = index < 0
    ? '' : reduction.getIn(['appState', 'browser', 'listArtists']).get(index);

  return reduction
    .setIn(['appState', 'browser', 'selectedArtist'], index)
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(
        'LIST_BROWSER_API_CALL',
        { artist: artist }
      ))
    )
  ;
};

export const selectAlbum = (reduction, index) => {
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
        'LIST_BROWSER_API_CALL',
        {
          artist: artist,
          album: album
        }
      ))
    )
  ;
};

export const insertBrowserResults = (reduction, response) => {
  const error = typeof response.body !== 'object';

  const songs = error
  ? List.of()
  : fromJS(typeof response.body.songs === 'object'
    ? response.body.songs.map(decompressSongs)
    : response.body.map(decompressSongs)
  );

  const albums = error || !response.body.albums
    ? reduction.getIn(['appState', 'browser', 'listAlbums'])
    : fromJS(response.body.albums);

  const selectedAlbum = error || typeof response.body.selectedAlbum === 'undefined'
    ? reduction.getIn(['appState', 'browser', 'selectedAlbum'])
    : response.body.selectedAlbum;

  return reduction
    .setIn(['appState', 'loaded', 'firstList'], true)
    .setIn(['appState', 'songList', 'list'], songs)
    .setIn(['appState', 'songList', 'selectedSongs'], List.of())
    .setIn(['appState', 'songList', 'clickedLast'], null)
    .setIn(['appState', 'browser', 'selectedAlbum'], selectedAlbum)
    .setIn(['appState', 'browser', 'listAlbums'], albums)
  ;
};
