import { Map as map } from 'immutable';

export default handlers => {
  return (reduction, action) => {
    return map(handlers)
      .filter((handler, actionType) => actionType === action.type)
      .reduce((partialReduction, handler) => handler(partialReduction, action.payload), reduction);
  };
};

