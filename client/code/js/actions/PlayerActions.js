import buildMessage from '../MessageBuilder';
import {
  PLAYER_TRACK_ADDED,
  PLAYER_PAUSE_TOGGLED,
} from '../constants/Actions';

export const addTrack = track => buildMessage(PLAYER_TRACK_ADDED, track);
export const togglePause = paused => buildMessage(PLAYER_PAUSE_TOGGLED, paused);
