import buildMessage from '../MessageBuilder';
import {
  BROWSER_FETCH_ARTISTS,
  BROWSER_GOT_ARTISTS,
} from '../constants/Actions';

export const loadListArtists = () => {
  // this fetches the artists from the server
  return buildMessage(BROWSER_FETCH_ARTISTS, {});
};

export const gotListArtists = (list) => {
  // this happens when the artists have been fetched from the server
  return buildMessage(BROWSER_GOT_ARTISTS, list);
};
