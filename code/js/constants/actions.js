// Authentication actions
export const AUTH_TOKEN_SET = 'AUTH_TOKEN_SET';
export const AUTH_LOGIN_ATTEMPTED = 'AUTH_LOGIN_ATTEMPTED';
export const AUTH_LOGOUT_REQUESTED = 'AUTH_LOGOUT_REQUESTED';
export const AUTH_LOGIN_GOT_RESPONSE = 'AUTH_LOGIN_GOT_RESPONSE';

// App actions
export const APP_SPINNER_HIDDEN = 'APP_SPINNER_HIDDEN';
export const APP_EVENT_HANDLER_STORED = 'APP_EVENT_HANDLER_STORED';
export const APP_SLIDER_CLICKED = 'APP_SLIDER_CLICKED';
export const APP_MENU_TOGGLED = 'APP_MENU_TOGGLED';
export const APP_NOTIFICATIONS_ALLOWED = 'APP_NOTIFICATIONS_ALLOWED';
export const APP_SETTINGS_APPLIED = 'APP_SETTINGS_APPLIED';
export const APP_SETTINGS_REQUESTED = 'APP_SETTINGS_REQUESTED';
export const APP_EVENT_RESIZED = 'APP_EVENT_RESIZED';

// Audio actions
export const AUDIO_STREAM_CANPLAY = 'AUDIO_STREAM_CANPLAY';
export const AUDIO_STREAM_BEGAN = 'AUDIO_STREAM_BEGAN';
export const AUDIO_DURATION_SET = 'AUDIO_DURATION_SET';
export const AUDIO_ERROR_OCCURRED = 'AUDIO_ERROR_OCCURRED';
export const AUDIO_STREAM_PROGRESSED = 'AUDIO_STREAM_PROGRESSED';
export const AUDIO_TIME_UPDATED = 'AUDIO_TIME_UPDATED';
export const AUDIO_VOLUME_SET = 'AUDIO_VOLUME_SET';

// Browser actions
export const BROWSER_ARTISTS_REQUESTED = 'BROWSER_ARTISTS_REQUESTED';
export const BROWSER_ARTISTS_FETCHED = 'BROWSER_ARTISTS_FETCHED';
export const BROWSER_ARTIST_SELECTED = 'BROWSER_ARTIST_SELECTED';
export const BROWSER_ALBUM_SELECTED = 'BROWSER_ALBUM_SELECTED';

// Player actions
export const PLAYER_SONGS_ADDED = 'PLAYER_SONGS_ADDED';
export const PLAYER_QUEUEITEM_PLAYED = 'PLAYER_QUEUEITEM_PLAYED';
export const PLAYER_SONG_PLAYED = 'PLAYER_SONG_PLAYED';
export const PLAYER_PAUSE_TOGGLED = 'PLAYER_PAUSE_TOGGLED';
export const PLAYER_POSITION_SEEKED = 'PLAYER_POSITION_SEEKED';
export const PLAYER_CTRL_PREVIOUS_CLICKED = 'PLAYER_CTRL_PREVIOUS_CLICKED';
export const PLAYER_CTRL_NEXT_CLICKED = 'PLAYER_CTRL_NEXT_CLICKED';

// SongList actions
export const LIST_REQUESTED_FROM_BROWSER = 'LIST_REQUESTED_FROM_BROWSER';
export const LIST_SONG_SELECTED = 'LIST_SONG_SELECTED';
export const LIST_COL_RESIZED = 'LIST_COL_RESIZED';
export const LIST_SORTED = 'LIST_SORTED';
