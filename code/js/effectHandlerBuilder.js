import { Map as map } from 'immutable';

export default handlers => {
  return (dispatcher, effect) => {
    map(handlers)
      .filter((handler, effectType) => effectType === effect.type)
      .forEach(handler => handler(effect.payload, dispatcher));
  };
};

