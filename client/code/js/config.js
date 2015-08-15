/**
 * config parameters
 */

const API = 'http://localhost:3005';

export const API_LIST_ARTISTS = API + '/list/artists';
export const API_LIST_ALBUMS = API + '/list/albums';

export const API_LIST_ARTIST = API + '/list/songs?browser=true&artist=';
export const API_LIST_ALBUM = API + '/list/songs?browser=true&album=';

export const STREAM_URL = API + '/play?id=';
