import buildMessage from '../MessageBuilder';
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

// this fetches the artists from the server
export const loadListArtists = () => buildMessage(BROWSER_ARTISTS_REQUESTED, {});

// this happens when the artists have been fetched from the server
export const gotListArtists = list => buildMessage(BROWSER_ARTISTS_FETCHED, list);

// this fetches the artists from the server
export const loadListAlbums = artistIndex => buildMessage(BROWSER_ALBUMS_REQUESTED, artistIndex);

// this happens when the artists have been fetched from the server
export const gotListAlbums = list => buildMessage(BROWSER_ALBUMS_FETCHED, list);

// handles selection of artists / albums
export const selectArtist = index => buildMessage(BROWSER_ARTIST_SELECTED, index);
export const selectAlbum = index => buildMessage(BROWSER_ALBUM_SELECTED, index);

// executed after the API request for artist/album selection
export const insertArtistResults = response => buildMessage(LIST_ARTIST_SELECTED, response);
export const insertAlbumResults = response => buildMessage(LIST_ALBUM_SELECTED, response);
