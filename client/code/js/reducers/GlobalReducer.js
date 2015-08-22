import {
  hideSpinner
} from './AppReducer';

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
  ctrlSeek
} from './PlayerReducer';

import {
  selectSong
} from './SongListReducer';

export default (reduction, action) => {
  switch (action.type) {
  // App actions
  case 'APP_SPINNER_HIDDEN':
    return hideSpinner(reduction);

  // Audio actions
  case 'AUDIO_STREAM_CANPLAY':
    return audioCanPlay(reduction);
  case 'AUDIO_STREAM_BEGAN':
    return audioLoadStart(reduction);
  case 'AUDIO_DURATION_SET':
    return audioDurationChange(reduction, action.payload);
  case 'AUDIO_ERROR_OCCURRED':
    return audioError(reduction);
  case 'AUDIO_STREAM_PROGRESSED':
    return audioProgress(reduction, action.payload);
  case 'AUDIO_TIME_UPDATED':
    return audioTimeUpdate(reduction, action.payload);
  case 'AUDIO_VOLUME_SET':
    return audioVolumeChange(reduction, action.payload);

  // Browser actions
  case 'BROWSER_ARTISTS_REQUESTED':
    return loadListArtists(reduction);
  case 'BROWSER_ARTISTS_FETCHED':
    return gotListArtists(reduction, action.payload);
  case 'BROWSER_ARTIST_SELECTED':
    return selectArtist(reduction, action.payload);
  case 'BROWSER_ALBUM_SELECTED':
    return selectAlbum(reduction, action.payload);

  // Player actions
  case 'PLAYER_SONGS_ADDED':
    return addToQueue(reduction, action.payload);
  case 'PLAYER_QUEUEITEM_PLAYED':
    return playQueueItem(reduction, action.payload);
  case 'PLAYER_SONG_PLAYED':
    return playListItem(reduction, action.payload);
  case 'PLAYER_PAUSE_TOGGLED':
    return togglePause(reduction, action.payload);
  case 'PLAYER_POSITION_SEEKED':
    return ctrlSeek(reduction, action.payload);
  case 'PLAYER_CTRL_PREVIOUS_CLICKED':
    return ctrlPrevious(reduction, action.payload);
  case 'PLAYER_CTRL_NEXT_CLICKED':
    return ctrlNext(reduction, action.payload);

  // SongList actions
  case 'LIST_REQUESTED_FROM_BROWSER':
    return insertBrowserResults(reduction, action.payload);
  case 'LIST_SONG_SELECTED':
    return selectSong(reduction, action.payload);

  default:
    return reduction;
  }
};
