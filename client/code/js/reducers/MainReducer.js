import { Map as map } from 'immutable';

import {
  APP_HIDE_SPINNER,
} from '../constants/Actions';

const buildReducer = handlers => {
  return (reduction, action) => {
    return map(handlers)
      .filter((handler, actionType) => actionType === action.type)
      .reduce((partialReduction, handler) => handler(partialReduction, action.payload), reduction);
  };
};

// This is the place where all magic belongs
export default buildReducer({
  [APP_HIDE_SPINNER]: reduction => {
    return reduction
      .setIn(['appState', 'loadedOnLastRender'], true);
  },
});
