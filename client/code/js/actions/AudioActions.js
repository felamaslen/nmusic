import buildMessage from '../MessageBuilder';
import {
  AUDIO_STREAM_CANPLAY, // canplay
  AUDIO_STREAM_BEGAN,   // loadstart
  AUDIO_DURATION_SET,   // durationchange
  AUDIO_ERROR_OCCURRED, // error
  AUDIO_STREAM_PROGRESSED, // progress
  AUDIO_TIME_UPDATED,   // timeupdate
  AUDIO_VOLUME_SET,     // volumechange
} from '../constants/Actions';

export const canplay = status => buildMessage(AUDIO_STREAM_CANPLAY, status);
export const loadstart = () => buildMessage(AUDIO_STREAM_BEGAN, {});
export const durationchange = time => buildMessage(AUDIO_DURATION_SET, time);
export const error = () => buildMessage(AUDIO_ERROR_OCCURRED, {});
export const progress = buffered => buildMessage(AUDIO_STREAM_PROGRESSED, buffered);
export const timeupdate = position => buildMessage(AUDIO_TIME_UPDATED, position);
export const volumechange = volume => buildMessage(AUDIO_VOLUME_SET, volume);
