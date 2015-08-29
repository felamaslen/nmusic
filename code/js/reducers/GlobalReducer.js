import {
  // Auth actions
  AUTH_TOKEN_SET,
  AUTH_LOGIN_ATTEMPTED,
  AUTH_LOGOUT_REQUESTED,
  AUTH_LOGIN_GOT_RESPONSE,

  // App actions
  APP_SPINNER_HIDDEN,
  APP_EVENT_HANDLER_STORED,
  APP_SLIDER_CLICKED,
  APP_MENU_TOGGLED,
  APP_NOTIFICATIONS_ALLOWED,
  APP_SETTINGS_APPLIED,
  APP_SETTINGS_REQUESTED,

  // Audio actions
  AUDIO_STREAM_CANPLAY,
  AUDIO_STREAM_BEGAN,
  AUDIO_DURATION_SET,
  AUDIO_ERROR_OCCURRED,
  AUDIO_STREAM_PROGRESSED,
  AUDIO_TIME_UPDATED,
  AUDIO_VOLUME_SET,

  // Browser actions
  BROWSER_RESIZED,
  BROWSER_ARTISTS_REQUESTED,
  BROWSER_ARTISTS_FETCHED,
  BROWSER_ARTIST_SELECTED,
  BROWSER_ALBUM_SELECTED,

  // Player actions
  PLAYER_SONGS_ADDED,
  PLAYER_QUEUEITEM_PLAYED,
  PLAYER_SONG_PLAYED,
  PLAYER_PAUSE_TOGGLED,
  PLAYER_POSITION_SEEKED,
  PLAYER_CTRL_PREVIOUS_CLICKED,
  PLAYER_CTRL_NEXT_CLICKED,

  // SongList actions
  LIST_REQUESTED_FROM_BROWSER,
  LIST_SONG_SELECTED
} from '../constants/actions';

import {
  hideSpinner,
  storeEventHandler,
  sliderClicked,
  userMenuToggle,
  canNotify,
  setSettings,
  getSettings
} from './AppReducer';

import {
  setPersistentToken,
  attemptLogin,
  logout,
  authGotResponse
} from './LoginReducer';

import {
  audioCanPlay,
  audioLoadStart,
  audioDurationChange,
  audioError,
  audioProgress,
  audioTimeUpdate,
  audioVolumeChange
} from './AudioReducer';

import {
  browserResized,
  loadListArtists,
  gotListArtists,
  selectArtist,
  selectAlbum,
  insertBrowserResults
} from './BrowserReducer';

import {
  addToQueue,
  playQueueItem,
  playListItem,
  togglePause,
  ctrlPrevious,
  ctrlNext,
  ctrlSeek,
} from './PlayerReducer';

import {
  selectSong
} from './SongListReducer';

export default (reduction, action) => {
  switch (action.type) {
  // Authentication actions
  case AUTH_TOKEN_SET:
    return setPersistentToken(reduction, action.payload);
  case AUTH_LOGIN_ATTEMPTED:
    return attemptLogin(reduction, action.payload);
  case AUTH_LOGOUT_REQUESTED:
    return logout(reduction);
  case AUTH_LOGIN_GOT_RESPONSE:
    return authGotResponse(reduction, action.payload);

  // App actions
  case APP_SPINNER_HIDDEN:
    return hideSpinner(reduction);
  case APP_EVENT_HANDLER_STORED:
    // store all bound events which might need to be de-bound in the appState
    return storeEventHandler(reduction, action.payload);
  case APP_SLIDER_CLICKED:
    return sliderClicked(reduction, action.payload);
  case APP_MENU_TOGGLED:
    return userMenuToggle(reduction, action.payload);
  case APP_NOTIFICATIONS_ALLOWED:
    return canNotify(reduction);
  case APP_SETTINGS_APPLIED:
    return setSettings(reduction);
  case APP_SETTINGS_REQUESTED:
    return getSettings(reduction);

  // Audio actions
  case AUDIO_STREAM_CANPLAY:
    return audioCanPlay(reduction);
  case AUDIO_STREAM_BEGAN:
    return audioLoadStart(reduction);
  case AUDIO_DURATION_SET:
    return audioDurationChange(reduction, action.payload);
  case AUDIO_ERROR_OCCURRED:
    return audioError(reduction);
  case AUDIO_STREAM_PROGRESSED:
    return audioProgress(reduction, action.payload);
  case AUDIO_TIME_UPDATED:
    return audioTimeUpdate(reduction, action.payload);
  case AUDIO_VOLUME_SET:
    return audioVolumeChange(reduction, action.payload);

  // Browser actions
  case BROWSER_RESIZED:
    return browserResized(reduction, action.payload);
  case BROWSER_ARTISTS_REQUESTED:
    return loadListArtists(reduction);
  case BROWSER_ARTISTS_FETCHED:
    return gotListArtists(reduction, action.payload);
  case BROWSER_ARTIST_SELECTED:
    return selectArtist(reduction, action.payload);
  case BROWSER_ALBUM_SELECTED:
    return selectAlbum(reduction, action.payload);

  // Player actions
  case PLAYER_SONGS_ADDED:
    return addToQueue(reduction, action.payload);
  case PLAYER_QUEUEITEM_PLAYED:
    return playQueueItem(reduction, action.payload);
  case PLAYER_SONG_PLAYED:
    return playListItem(reduction, action.payload);
  case PLAYER_PAUSE_TOGGLED:
    return togglePause(reduction, action.payload);
  case PLAYER_POSITION_SEEKED:
    return ctrlSeek(reduction, action.payload);
  case PLAYER_CTRL_PREVIOUS_CLICKED:
    return ctrlPrevious(reduction);
  case PLAYER_CTRL_NEXT_CLICKED:
    return ctrlNext(reduction, action.payload);

  // SongList actions
  case LIST_REQUESTED_FROM_BROWSER:
    return insertBrowserResults(reduction, action.payload);
  case LIST_SONG_SELECTED:
    return selectSong(reduction, action.payload);

  default:
    return reduction;
  }
};
