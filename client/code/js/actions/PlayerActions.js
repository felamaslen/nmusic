import buildMessage from '../MessageBuilder';
import {
  PLAYER_TRACK_ADDED,
  PLAYER_PAUSE_TOGGLED,
  PLAYER_CTRL_PREVIOUS_CLICKED,
  PLAYER_CTRL_NEXT_CLICKED,
  PLAYER_POSITION_SEEKED,
} from '../constants/Actions';

export const addTrack = track => buildMessage(PLAYER_TRACK_ADDED, track);
export const togglePause = paused => buildMessage(PLAYER_PAUSE_TOGGLED, paused);

export const ctrlPrevious = () => buildMessage(PLAYER_CTRL_PREVIOUS_CLICKED, {});
export const ctrlNext = () => buildMessage(PLAYER_CTRL_NEXT_CLICKED, {});
export const ctrlSeek = position => buildMessage(PLAYER_POSITION_SEEKED, position);
