import buildMessage from '../MessageBuilder';

import {
  LIST_SONG_SELECTED,
  LIST_COL_RESIZED
} from '../constants/actions';

export const selectSong = evt => buildMessage(LIST_SONG_SELECTED, evt);
export const columnResized = options => buildMessage(LIST_COL_RESIZED, options);
