import { } from 'immutable';

import {
  PLAYER_TRACK_ADDED,
  PLAYER_PAUSE_TOGGLED,
} from '../constants/Actions';

import buildReducer from './BuildReducer';

export default buildReducer({
  [PLAYER_TRACK_ADDED]: (reduction, trackId) => {
    console.debug('PLAYER_TRACK_ADDED', trackId);
    return reduction
      .setIn(
        ['appState', 'player', 'trackHistory'],
        reduction.getIn(['appState', 'player', 'trackHistory'])
          .push(trackId)
      )
      .setIn(['appState', 'player', 'playingId'], trackId);
  },

  [PLAYER_PAUSE_TOGGLED]: (reduction, paused) => {
    return reduction
      .setIn(['appState', 'player', 'paused'], paused);
  },

});
