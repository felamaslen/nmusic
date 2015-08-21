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
  const error = !response || typeof response.body !== 'object';

  return reduction
    .setIn(['appState', 'loaded', 'browserArtists'], true)
    .setIn(['appState', 'browser', 'listArtists'], error ? List.of() : fromJS(response.body));
};

export const selectArtist = (reduction, indexes) => {
  const artists = indexes.indexOf(-1) > -1
    ? List.of() : reduction.getIn(['appState', 'browser', 'listArtists']).filter(
      (artist, index) => indexes.indexOf(index) > -1
    );

  const oldSelectedArtists = reduction.getIn(['appState', 'browser', 'selectedArtists']);

  const selectionChanged = !reduction.getIn(['appState', 'loaded', 'songList']) ||
    indexes.some(index => oldSelectedArtists.indexOf(index) < 0) ||
    oldSelectedArtists.some(index => indexes.indexOf(index) < 0);

  const selectedAlbums = reduction.getIn(['appState', 'browser', 'selectedAlbums']);
  const currentAlbums = selectionChanged
    ? reduction.getIn(
        ['appState', 'browser', 'listAlbums']
      ).filter((album, index) => selectedAlbums.indexOf(index) > -1)
    : null;

  const effects = selectionChanged
    ? reduction.get('effects').push(buildMessage(
      'LIST_BROWSER_API_CALL',
      {
        artist: artists.join(','),
        album: currentAlbums.join(','),
        artistChanged: 'true'
      }))
    : reduction.get('effects');

  return reduction
    .setIn(['appState', 'browser', 'selectedArtists'], indexes)
    .set('effects', effects)
  ;
};

export const selectAlbum = (reduction, indexes) => {
  const artistIndexes = reduction.getIn(['appState', 'browser', 'selectedArtists']);

  const artists = artistIndexes.indexOf(-1) > -1
    ? List.of() : reduction.getIn(['appState', 'browser', 'listArtists']).filter(
      (artist, index) => artistIndexes.indexOf(index) > -1
    );

  const albums = indexes.indexOf(-1) > -1
    ? List.of() : reduction.getIn(['appState', 'browser', 'listAlbums']).filter(
      (album, index) => indexes.indexOf(index) > -1
    );

  return reduction
    .setIn(['appState', 'browser', 'selectedAlbums'], indexes)
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(
        'LIST_BROWSER_API_CALL',
        {
          artist: artists.join(','),
          album: albums.join(',')
        }
      ))
    )
  ;
};

export const insertBrowserResults = (reduction, response) => {
  const error = !response || typeof response.body !== 'object';

  const songs = error
  ? List.of()
  : fromJS(typeof response.body.songs === 'object'
    ? response.body.songs.map(decompressSongs)
    : response.body.map(decompressSongs)
  );

  const albums = error || !response.body.albums
    ? reduction.getIn(['appState', 'browser', 'listAlbums'])
    : fromJS(response.body.albums);

  const selectedAlbums = error || typeof response.body.selectedAlbums === 'undefined'
    ? reduction.getIn(['appState', 'browser', 'selectedAlbums'])
    : fromJS(response.body.selectedAlbums);

  return reduction
    .setIn(['appState', 'loaded', 'songList'], true)
    .setIn(['appState', 'songList', 'list'], songs)
    .setIn(['appState', 'songList', 'selectedSongs'], List.of())
    .setIn(['appState', 'songList', 'clickedLast'], null)
    .setIn(['appState', 'browser', 'selectedAlbums'], selectedAlbums)
    .setIn(['appState', 'browser', 'listAlbums'], albums)
  ;
};
