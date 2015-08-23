import buildMessage from '../MessageBuilder';

export const audioCanPlay = status => buildMessage('AUDIO_STREAM_CANPLAY', status);
export const audioLoadStart = () => buildMessage('AUDIO_STREAM_BEGAN', {});
export const audioDurationChange = time => buildMessage('AUDIO_DURATION_SET', time);
export const audioError = () => buildMessage('AUDIO_ERROR_OCCURRED', {});
export const audioProgress = buffered => buildMessage('AUDIO_STREAM_PROGRESSED', buffered);
export const audioTimeUpdate = position => buildMessage('AUDIO_TIME_UPDATED', position);
export const audioVolumeChange = volume => buildMessage('AUDIO_VOLUME_SET', volume);
