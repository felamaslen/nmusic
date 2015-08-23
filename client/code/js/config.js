/**
 * config parameters
 */

/* You can modify these settings */
export const PREVIOUS_SONG_DELAY = 2.5;
export const NAVIGATION_WARNING_MESSAGE = 'This action will stop the music.';

/* Don't modify anything beyond here */
const REQ = 'http://localhost:3005';
const API = REQ + '/api';

export const AUTH_AUTHENTICATE = REQ + '/authenticate';
export const API_LIST_ARTISTS = API + '/list/artists';
export const API_LIST_SONGS_FROM_BROWSER = API + '/list/songs/';
export const STREAM_URL = API + '/play/';
