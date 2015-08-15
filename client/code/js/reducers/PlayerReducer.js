import { fromJS } from 'immutable';

import {
  PLAYER_TRACK_ADDED,
  PLAYER_PAUSE_TOGGLED,
  PLAYER_CTRL_PREVIOUS_CLICKED,
  PLAYER_CTRL_NEXT_CLICKED,
  PLAYER_POSITION_SEEKED,
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
      .setIn(['appState', 'player', 'currentTrack'], fromJS(track));
  },

  [PLAYER_PAUSE_TOGGLED]: (reduction, paused) => {
    return reduction
      .setIn(['appState', 'player', 'paused'], paused);
  },

  [PLAYER_CTRL_PREVIOUS_CLICKED]: reduction => {
    console.debug('PLAYER_CTRL_PREVIOUS_CLICKED');
    return reduction;
  },

  [PLAYER_CTRL_NEXT_CLICKED]: reduction => {
    console.debug('PLAYER_CTRL_NEXT_CLICKED');
    return reduction;
  },

  [PLAYER_POSITION_SEEKED]: (reduction, position) => {
    console.debug('PLAYER_POSITION_SEEKED', position);
    return reduction;
  },

});
