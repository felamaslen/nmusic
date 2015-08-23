import buildMessage from '../MessageBuilder';

export const addToQueue = options => buildMessage('PLAYER_SONGS_ADDED', options);
export const playQueueItem = queueId => buildMessage('PLAYER_QUEUEITEM_PLAYED', queueId);
export const playListItem = song => buildMessage('PLAYER_SONG_PLAYED', song);
export const togglePause = paused => buildMessage('PLAYER_PAUSE_TOGGLED', paused);

export const ctrlPrevious = () => buildMessage('PLAYER_CTRL_PREVIOUS_CLICKED');
export const ctrlNext = () => buildMessage('PLAYER_CTRL_NEXT_CLICKED');
export const ctrlSeek = position => buildMessage('PLAYER_POSITION_SEEKED', position);
export const volumeClicked = clickPosition => buildMessage('PLAYER_CTRL_VOLUME_CLICKED', clickPosition);
