import {
  LIST_BROWSER_API_CALL,
  BROWSER_ARTISTS_API_CALL
} from '../constants/effects';

import {
  decompressSongs,
  getRangesAfterClick,
  itemInRanges,
  createRanges,
  _sortSongList
} from '../common';

import { List, fromJS } from 'immutable';

import buildMessage from '../MessageBuilder';

export const browserResized = (reduction, options) => {
  return reduction
    .setIn(['appState', 'browser', 'height'], options.dim)
  ;
};

export const loadListArtists = reduction => {
  return reduction
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(
        BROWSER_ARTISTS_API_CALL,
        reduction.getIn(['appState', 'auth', 'token'])
      ))
    );
};

export const gotListArtists = (reduction, response) => {
  const error = !response || typeof response.data !== 'object';

  return reduction
    .setIn(['appState', 'loaded', 'browserArtists'], true)
    .setIn(['appState', 'browser', 'listArtists'], error ? List.of() : fromJS(response.data));
};

export const selectArtist = (reduction, evt) => {
  const oldSelectedArtists = reduction.getIn(['appState', 'browser', 'selectedArtists']);

  let effects = reduction.get('effects');

  let newRanges;
  let newSelectedAlbums;

  const selectionChanged = !evt.ctrl || !evt.shift
    || itemInRanges(oldSelectedArtists, evt.index) === -1;

  if (selectionChanged) {
    let artists;
    if (evt.index < 0) {
      artists = List.of();
      newRanges = List.of(List.of(-1, -1));
    } else {
      newRanges = getRangesAfterClick(
        reduction.getIn(['appState', 'browser', 'selectedArtists']),
        evt.shift,
        evt.ctrl,
        reduction.getIn(['appState', 'browser', 'artistClickedLast']),
        evt.index
      ).filter(range => range.first() > -1);

      artists = reduction.getIn(['appState', 'browser', 'listArtists']).filter(
        (artist, index) => itemInRanges(newRanges, index) > -1
      );
    }

    effects = effects.push(buildMessage(
      LIST_BROWSER_API_CALL,
      {
        token: reduction.getIn(['appState', 'auth', 'token']),
        artists: artists.map(encodeURIComponent).join(','),
        artistChanged: 'true'
      })
    );

    newSelectedAlbums = List.of(List.of(-1, -1));
  } else {
    newRanges = oldSelectedArtists;

    newSelectedAlbums = reduction.getIn(['appState', 'browser', 'selectedAlbums']);
  }

  return reduction
    .setIn(['appState', 'browser', 'artistClickedLast'], evt.index)
    .setIn(['appState', 'browser', 'selectedArtists'], newRanges)
    .setIn(['appState', 'browser', 'selectedAlbums'], newSelectedAlbums)
    .set('effects', effects)
  ;
};

export const selectAlbum = (reduction, evt) => {
  const oldSelectedAlbums = reduction.getIn(['appState', 'browser', 'selectedAlbums']);

  let effects = reduction.get('effects');

  let newRanges;

  const selectionChanged = !evt.ctrl || !evt.shift
    || itemInRanges(oldSelectedAlbums, evt.index) === -1;

  if (selectionChanged) {
    newRanges = evt.index < 0
    ? List.of(List.of(-1, -1))
    : getRangesAfterClick(
        reduction.getIn(['appState', 'browser', 'selectedAlbums']),
        evt.shift,
        evt.ctrl,
        reduction.getIn(['appState', 'browser', 'albumClickedLast']),
        evt.index
      ).filter(range => range.first() > -1);

    const listAlbums = reduction.getIn(['appState', 'browser', 'listAlbums']);
    const albums = listAlbums.filter((album, index) =>
      itemInRanges(newRanges, index) > -1
    );

    const selectedArtists = reduction.getIn(['appState', 'browser', 'selectedArtists']);

    const currentArtists = itemInRanges(selectedArtists, -1) > -1
      ? List.of()
      : reduction.getIn(
        ['appState', 'browser', 'listArtists']
      ).filter((album, index) => itemInRanges(selectedArtists, index) > -1);

    effects = effects.push(buildMessage(
      'LIST_BROWSER_API_CALL',
      {
        token: reduction.getIn(['appState', 'auth', 'token']),
        artists: currentArtists.map(encodeURIComponent).join(','),
        albums: albums.map(encodeURIComponent).join(',')
      })
    );
  } else {
    newRanges = oldSelectedAlbums;
  }

  return reduction
    .setIn(['appState', 'browser', 'albumClickedLast'], evt.index)
    .setIn(['appState', 'browser', 'selectedAlbums'], newRanges)
    .set('effects', effects)
  ;
};

export const insertBrowserResults = (reduction, response) => {
  const error = !response || typeof response.data !== 'object';

  const songs = error
  ? List.of()
  : _sortSongList(fromJS(typeof response.data.songs === 'object'
    ? response.data.songs.map(decompressSongs)
    : response.data.map(decompressSongs)
  ), reduction.getIn(['appState', 'songList', 'orderBy']));

  const albums = error || !response.data.albums
    ? reduction.getIn(['appState', 'browser', 'listAlbums'])
    : fromJS(response.data.albums);

  const selectedAlbums = error || typeof response.data.selectedAlbums === 'undefined'
    ? reduction.getIn(['appState', 'browser', 'selectedAlbums'])
    : createRanges(fromJS(response.data.selectedAlbums));

  return reduction
    .setIn(['appState', 'loaded', 'songList'], true)
    .setIn(['appState', 'songList', 'list'], songs)
    .setIn(['appState', 'songList', 'selectedSongs'], List.of())
    .setIn(['appState', 'songList', 'clickedLast'], null)
    .setIn(['appState', 'browser', 'selectedAlbums'], selectedAlbums)
    .setIn(['appState', 'browser', 'listAlbums'], albums)
  ;
};
