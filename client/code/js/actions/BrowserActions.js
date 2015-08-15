import buildMessage from '../MessageBuilder';
import {
  BROWSER_ARTISTS_REQUESTED,
  BROWSER_ARTISTS_FETCHED,

  BROWSER_ALBUMS_REQUESTED,
  BROWSER_ALBUMS_FETCHED,
} from '../constants/Actions';

// this fetches the artists from the server
export const loadListArtists = () => buildMessage(BROWSER_ARTISTS_REQUESTED, {});

// this happens when the artists have been fetched from the server
export const gotListArtists = list => buildMessage(BROWSER_ARTISTS_FETCHED, list);

// this fetches the artists from the server
export const loadListAlbums = artistIndex => buildMessage(BROWSER_ALBUMS_REQUESTED, artistIndex);

// this happens when the artists have been fetched from the server
export const gotListAlbums = list => buildMessage(BROWSER_ALBUMS_FETCHED, list);
