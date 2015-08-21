import buildMessage from '../MessageBuilder';

// this fetches the artists from the server
export const loadListArtists = () => buildMessage('BROWSER_ARTISTS_REQUESTED', {});

// this happens when the artists have been fetched from the server
export const gotListArtists = list => buildMessage('BROWSER_ARTISTS_FETCHED', list);

// this fetches the artists from the server
export const loadListAlbums = artistIndex => buildMessage('BROWSER_ALBUMS_REQUESTED', artistIndex);

// this happens when the artists have been fetched from the server
export const gotListAlbums = list => buildMessage('BROWSER_ALBUMS_FETCHED', list);

// handles selection of artists / albums
export const selectArtist = index => buildMessage('BROWSER_ARTIST_SELECTED', index);
export const selectAlbum = index => buildMessage('BROWSER_ALBUM_SELECTED', index);

// executed after the API request for artist/album selection
export const insertBrowserResults = response => buildMessage('LIST_REQUESTED_FROM_BROWSER', response);
