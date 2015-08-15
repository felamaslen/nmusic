import buildMessage from '../MessageBuilder';
import {
  BROWSER_FETCH_ARTISTS,
  BROWSER_GOT_ARTISTS,

  BROWSER_FETCH_ALBUMS,
  BROWSER_GOT_ALBUMS,
} from '../constants/Actions';

// this fetches the artists from the server
export const loadListArtists = () => buildMessage(BROWSER_FETCH_ARTISTS, {});

// this happens when the artists have been fetched from the server
export const gotListArtists = list => buildMessage(BROWSER_GOT_ARTISTS, list);

// this fetches the artists from the server
export const loadListAlbums = artistIndex => buildMessage(BROWSER_FETCH_ALBUMS, artistIndex);

// this happens when the artists have been fetched from the server
export const gotListAlbums = list => buildMessage(BROWSER_GOT_ALBUMS, list);
