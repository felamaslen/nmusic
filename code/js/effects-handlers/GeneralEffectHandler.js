import {
  SETTINGS_UPDATE_TRIGGERED,
  SEARCH_SELECT_ARTIST,
  SEARCH_SELECT_ALBUM,
  SEARCH_SELECT_SONG
} from '../constants/effects';

import { setSettings } from '../actions/AppActions';

import buildEffectHandler from '../effectHandlerBuilder';

export default buildEffectHandler({
  [SETTINGS_UPDATE_TRIGGERED]: (_, dispatcher) => {
    window.setTimeout(() => {
      dispatcher.dispatch(setSettings());
    }, 0);
  },

  [SEARCH_SELECT_ALBUM]: (album, dispatcher) => {
    console.debug('selecting album', album);
  },

  [SEARCH_SELECT_SONG]: (songId, dispatcher) => {
    console.debug('selecting song id', songId);
  }
});
