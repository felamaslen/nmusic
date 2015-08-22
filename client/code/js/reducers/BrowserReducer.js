import {
  decompressSongs,
  getRangesAfterClick,
  itemInRanges,
  createRanges
} from '../common';

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
      'LIST_BROWSER_API_CALL',
      {
        artist: artists.map(encodeURIComponent).join(','),
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
        artist: currentArtists.map(encodeURIComponent).join(','),
        album: albums.map(encodeURIComponent).join(',')
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
    : createRanges(fromJS(response.body.selectedAlbums));

  return reduction
    .setIn(['appState', 'loaded', 'songList'], true)
    .setIn(['appState', 'songList', 'list'], songs)
    .setIn(['appState', 'songList', 'selectedSongs'], List.of())
    .setIn(['appState', 'songList', 'clickedLast'], null)
    .setIn(['appState', 'browser', 'selectedAlbums'], selectedAlbums)
    .setIn(['appState', 'browser', 'listAlbums'], albums)
  ;
};
