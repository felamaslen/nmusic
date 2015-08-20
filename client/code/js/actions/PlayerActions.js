import buildMessage from '../MessageBuilder';

export const addToQueue = options => buildMessage('PLAYER_TRACKS_ADDED', options);
export const playQueueItem = queueId => buildMessage('PLAYER_TRACK_PLAYED', queueId);
export const togglePause = paused => buildMessage('PLAYER_PAUSE_TOGGLED', paused);

export const ctrlPrevious = () => buildMessage('PLAYER_CTRL_PREVIOUS_CLICKED', {});
export const ctrlNext = () => buildMessage('PLAYER_CTRL_NEXT_CLICKED', {});
export const ctrlSeek = position => buildMessage('PLAYER_POSITION_SEEKED', position);
