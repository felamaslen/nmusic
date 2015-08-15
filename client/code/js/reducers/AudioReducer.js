import { } from 'immutable';

import {
  // audio events
  AUDIO_STREAM_CANPLAY, // canplay
  AUDIO_STREAM_BEGAN,   // loadstart
  AUDIO_DURATION_SET,   // durationchange
  AUDIO_ERROR_OCCURRED, // error
  AUDIO_STREAM_PROGRESSED, // progress
  AUDIO_TIME_UPDATED,   // timeupdate
  AUDIO_VOLUME_SET,     // volumechange
} from '../constants/Actions';

import buildReducer from './BuildReducer';

export default buildReducer({
  [AUDIO_STREAM_CANPLAY]: (reduction, status) => {
    // console.debug('AUDIO_STREAM_CANPLAY', status);
    return reduction
    ;
  },

  [AUDIO_STREAM_BEGAN]: reduction => {
    // console.debug('AUDIO_STREAM_BEGAN');
    return reduction
    ;
  },

  [AUDIO_DURATION_SET]: (reduction, time) => {
    // console.debug('AUDIO_DURATION_SET', time);
    return reduction
    ;
  },

  [AUDIO_ERROR_OCCURRED]: reduction => {
    // console.error('An error occurred! Fuuuuuu');
    return reduction
    ;
  },

  [AUDIO_STREAM_PROGRESSED]: (reduction, buffered) => {
    // console.debug('AUDIO_STREAM_PROGRESSED', buffered);
    return reduction
    ;
  },

  [AUDIO_TIME_UPDATED]: (reduction, position) => {
    // console.debug('AUDIO_TIME_UPDATED', position);
    return reduction
    ;
  },

  [AUDIO_VOLUME_SET]: (reduction, volume) => {
    return reduction
      .setIn(['appState', 'player', 'volume'], parseFloat(volume, 10))
    ;
  },

});
