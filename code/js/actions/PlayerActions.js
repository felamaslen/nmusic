import buildMessage from '../MessageBuilder';

import {
  PLAYER_SONGS_ADDED,
  PLAYER_QUEUEITEM_PLAYED,
  PLAYER_SONG_PLAYED,
  PLAYER_PAUSE_TOGGLED,
  PLAYER_CTRL_PREVIOUS_CLICKED,
  PLAYER_CTRL_NEXT_CLICKED,
  PLAYER_POSITION_SEEKED
} from '../constants/actions';

export const addToQueue = options => buildMessage(PLAYER_SONGS_ADDED, options);
export const playQueueItem = queueId => buildMessage(PLAYER_QUEUEITEM_PLAYED, queueId);
export const playListItem = song => buildMessage(PLAYER_SONG_PLAYED, song);
export const togglePause = paused => buildMessage(PLAYER_PAUSE_TOGGLED, paused);

export const ctrlPrevious = () => buildMessage(PLAYER_CTRL_PREVIOUS_CLICKED);
export const ctrlNext = manual => buildMessage(PLAYER_CTRL_NEXT_CLICKED, manual);
export const ctrlSeek = position => buildMessage(PLAYER_POSITION_SEEKED, position);
