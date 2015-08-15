import { } from 'immutable';

import {
  APP_HIDE_SPINNER,
} from '../constants/Actions';

import buildReducer from './BuildReducer';

// This is the place where all magic belongs
export default buildReducer({
  [APP_HIDE_SPINNER]: reduction => {
    return reduction
      .setIn(['appState', 'loadedOnLastRender'], true);
  },
});
