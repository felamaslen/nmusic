import buildMessage from '../MessageBuilder';

export const selectSong = evt => buildMessage('LIST_SONG_SELECTED', evt);
