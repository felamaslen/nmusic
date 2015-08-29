import buildMessage from '../MessageBuilder';

import {
  AUDIO_STREAM_CANPLAY,
  AUDIO_STREAM_BEGAN,
  AUDIO_DURATION_SET,
  AUDIO_ERROR_OCCURRED,
  AUDIO_STREAM_PROGRESSED,
  AUDIO_TIME_UPDATED,
  AUDIO_VOLUME_SET
} from '../constants/actions';

export const audioCanPlay = status => buildMessage(AUDIO_STREAM_CANPLAY, status);
export const audioLoadStart = () => buildMessage(AUDIO_STREAM_BEGAN, {});
export const audioDurationChange = time => buildMessage(AUDIO_DURATION_SET, time);
export const audioError = () => buildMessage(AUDIO_ERROR_OCCURRED, {});
export const audioProgress = buffered => buildMessage(AUDIO_STREAM_PROGRESSED, buffered);
export const audioTimeUpdate = position => buildMessage(AUDIO_TIME_UPDATED, position);
export const audioVolumeChange = volume => buildMessage(AUDIO_VOLUME_SET, volume);
