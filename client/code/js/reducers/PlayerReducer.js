import { } from 'immutable';

import {
  PLAYER_TRACK_ADDED,
  PLAYER_PAUSE_TOGGLED,
} from '../constants/Actions';

import buildReducer from './BuildReducer';

export default buildReducer({
  [PLAYER_TRACK_ADDED]: (reduction, track) => {
    return reduction
      .setIn(
        ['appState', 'player', 'trackHistory'],
        reduction.getIn(['appState', 'player', 'trackHistory'])
          .push(track)
      )
      .setIn(['appState', 'player', 'currentTrack'], track);
  },

  [PLAYER_PAUSE_TOGGLED]: (reduction, paused) => {
    return reduction
      .setIn(['appState', 'player', 'paused'], paused);
  },

});
