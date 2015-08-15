import {
  API_LIST_ARTISTS,
  API_LIST_ALBUMS,
} from '../config';

import { Map as map } from 'immutable';
import request from 'superagent-bluebird-promise';

import {
  gotListArtists,
  gotListAlbums,
} from '../actions/BrowserActions';

import {
  BROWSER_ARTISTS_API_CALL,
  BROWSER_ALBUMS_API_CALL,
} from '../constants/Effects';

const buildEffectHandler = handlers => {
  return (dispatcher, effect) => {
    map(handlers) // just wrap it in immutable map, we would like to use the fance methods like the filter
      .filter((handler, effectType) => effectType === effect.type)
      .forEach(handler => handler(effect.payload, dispatcher));
  };
};

export default buildEffectHandler({
  [BROWSER_ARTISTS_API_CALL]: (_, dispatcher) => {
    request.get(API_LIST_ARTISTS).then(response => {
      dispatcher.dispatch(gotListArtists(response.body));
    });
  },

  [BROWSER_ALBUMS_API_CALL]: (artist, dispatcher) => {
    request.get(API_LIST_ALBUMS + '?artist=' + artist).then(response => {
      dispatcher.dispatch(gotListAlbums(response.body));
    });
  },

});
