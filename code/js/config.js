/**
 * config parameters for the client
 */

/* You can modify these settings */
// all times are measured in seconds
export const PREVIOUS_SONG_DELAY = 2.5;
export const TIME_DISPLAY_NOTIFICATIONS = 5;

export const REMEMBERME_DAYS = 30;
/* Don't modify anything beyond here */

// API urls
const API = '/api';

export const NAVIGATION_WARNING_MESSAGE = 'This action will stop the music.';

export const AUTH_AUTHENTICATE = '/authenticate';
export const AUTH_TEST = API + '/authtest';
export const API_LIST_ARTISTS = API + '/list/artists';
export const API_LIST_SONGS_FROM_BROWSER = API + '/list/songs/';
export const STREAM_URL = API + '/play/';

export const DOCUMENT_TITLE = 'nMusic\u2122';
