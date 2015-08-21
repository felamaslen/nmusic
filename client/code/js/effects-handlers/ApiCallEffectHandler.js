import {
  API_LIST_ARTISTS,
  API_LIST_ALBUMS,

  API_LIST_SONGS_FROM_BROWSER
} from '../config';

import { Map as map } from 'immutable';
import request from 'superagent-bluebird-promise';
import querystring from 'querystring';

import {
  gotListArtists,
  gotListAlbums,

  insertBrowserResults
} from '../actions/BrowserActions';

const buildEffectHandler = handlers => {
  return (dispatcher, effect) => {
    map(handlers) // just wrap it in immutable map, we would like to use the fance methods like the filter
      .filter((handler, effectType) => effectType === effect.type)
      .forEach(handler => handler(effect.payload, dispatcher));
  };
};

export default buildEffectHandler({
  BROWSER_ARTISTS_API_CALL: (_, dispatcher) => {
    request.get(API_LIST_ARTISTS)
      .then(response => dispatcher.dispatch(gotListArtists(response)))
      .catch(() => dispatcher.dispatch(gotListArtists(null)));
  },

  BROWSER_ALBUMS_API_CALL: (query, dispatcher) => {
    request.get(API_LIST_ALBUMS + querystring.stringify(query))
      .then(response => dispatcher.dispatch(gotListAlbums(response)))
      .catch(() => dispatcher.dispatch(gotListAlbums(null)));
  },

  LIST_BROWSER_API_CALL: (query, dispatcher) => {
    request.get(API_LIST_SONGS_FROM_BROWSER + querystring.stringify(query))
      .then(
        response => dispatcher.dispatch(insertBrowserResults(response)),
        () => dispatcher.dispatch(insertBrowserResults(null))
      );
  }
});
