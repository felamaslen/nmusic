/**
 * config parameters for the client
 */

/* You can modify these settings */
// all times are measured in seconds
export const PREVIOUS_SONG_DELAY = 2.5;
export const TIME_DISPLAY_NOTIFICATIONS = 5;

export const REMEMBERME_DAYS = 30;
export const SETTINGS_EXPIRY_DAYS = 30;

export const BROWSER_MIN_HEIGHT = 40;

// keyboard shorcuts
export const KEYBOARD_SHORTCUTS = {
  ctrlNext: [
    { key: 'right', modifiers: { ctrl: true } },
    { key: 'b' }
  ],
  ctrlPrevious: [
    { key: 'left', modifiers: { ctrl: true } },
    { key: 'z' }
  ],
  ctrlPlayPause: [
    { key: 'space' },
    { key: 'c' }
  ]
};
/* Don't modify anything beyond here */

export const COL_MIN = 60;
export const COL_MAX = 320;

// API urls
const API = '/api';

export const NAVIGATION_WARNING_MESSAGE = 'This action will stop the music.';

export const AUTH_AUTHENTICATE = '/authenticate';
export const AUTH_TEST = API + '/authtest';
export const API_LIST_ARTISTS = API + '/list/artists';
export const API_LIST_SONGS_FROM_BROWSER = API + '/list/songs/';
export const STREAM_URL = API + '/play/';

export const DOCUMENT_TITLE = 'nMusic\u2122';

export const AUTH_STATUS_LOGGED_IN = 0;
export const AUTH_STATUS_BAD_LOGIN = 1;
export const AUTH_STATUS_WAITING = 2;
export const AUTH_STATUS_LOADING = 3;
export const AUTH_STATUS_LOADING_FROM_COOKIE = 4;
export const AUTH_STATUS_SERVER_ERROR = 5;
