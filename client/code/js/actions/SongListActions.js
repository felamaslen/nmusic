import buildMessage from '../MessageBuilder';
import { LIST_SONG_SELECTED } from '../constants/Actions';

export const selectSong = evt => buildMessage(LIST_SONG_SELECTED, evt);
