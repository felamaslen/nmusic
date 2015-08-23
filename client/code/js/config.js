/**
 * config parameters
 */

/* You can modify these settings */
export const PREVIOUS_SONG_DELAY = 2.5;
export const NAVIGATION_WARNING_MESSAGE = 'This action will stop the music.';

export const REMEMBERME_DAYS = 30;

/* Don't modify anything beyond here */
const REQ = 'http://localhost:3005';
const API = REQ + '/api';

export const AUTH_AUTHENTICATE = REQ + '/authenticate';
export const AUTH_TEST = API + '/authtest';
export const API_LIST_ARTISTS = API + '/list/artists';
export const API_LIST_SONGS_FROM_BROWSER = API + '/list/songs/';
export const STREAM_URL = API + '/play/';

export const COOKIE_SECRET = 'I like turtles';

