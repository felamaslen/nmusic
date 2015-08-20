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

export const gotListArtists = (reduction, artists) => {
  return reduction
    .setIn(['appState', 'loaded', 'browserArtists'], true)
    .setIn(['appState', 'browser', 'listArtists'], fromJS(artists));
};

export const loadListAlbums = (reduction, artistIndex) => {
  const artist = artistIndex < 0 ? ''
    : reduction.getIn(['appState', 'browser', 'listArtists']).get(artistIndex);

  return reduction
    .set('effects', reduction
      .get('effects')
      .push(buildMessage('BROWSER_ALBUMS_API_CALL', artist))
    );
};

export const gotListAlbums = (reduction, albums) => {
  return reduction
    .setIn(['appState', 'loaded', 'browserAlbums'], true)
    .setIn(['appState', 'browser', 'listAlbums'], fromJS(albums));
};

export const selectArtist = (reduction, index) => {
  const artist = index < 0
    ? '' : reduction.getIn(['appState', 'browser', 'listArtists']).get(index);

  return reduction
    .setIn(['appState', 'browser', 'selectedArtist'], index)
    .set('effects', reduction
      .get('effects')
      .push(buildMessage(
        'LIST_ARTIST_API_CALL',
        artist
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
        'LIST_ALBUM_API_CALL',
        { artist: artist, album: album }
      ))
    )
  ;
};

export const insertArtistResults = (reduction, res) => {
  const _songs = res.songs.map(decompressSongs);

  return reduction
    .setIn(['appState', 'songList', 'list'], fromJS(_songs))
    .setIn(['appState', 'songList', 'selectedSongs'], List.of())
    .setIn(['appState', 'songList', 'clickedLast'], null)
    .setIn(['appState', 'browser', 'selectedAlbum'], -1)
    .setIn(['appState', 'browser', 'listAlbums'], fromJS(res.albums))
  ;
};

export const insertAlbumResults = (reduction, res) => {
  const _songs = typeof res.songs === 'object'
    ? res.songs.map(decompressSongs) : res.map(decompressSongs);

  return reduction
    .setIn(['appState', 'songList', 'selectedSongs'], List.of())
    .setIn(['appState', 'songList', 'clickedLast'], null)
    .setIn(['appState', 'songList', 'list'], fromJS(_songs))
  ;
};
