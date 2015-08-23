import {
  AUTH_AUTHENTICATE,

  API_LIST_ARTISTS,
  API_LIST_SONGS_FROM_BROWSER
} from '../config';

import { Map as map } from 'immutable';
import axios from 'axios';
import querystring from 'querystring';

import {
  authGotResponse
} from '../actions/LoginActions';

import {
  gotListArtists,
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
  AUTHENTICATE_API_CALL: (details, dispatcher) => {
    axios.post(AUTH_AUTHENTICATE, {
      username: details.username,
      password: details.password
    }, {
      headers: {
        Accept: 'application/json'
      }
    }).then(
      response => dispatcher.dispatch(authGotResponse(response))
    ).catch(
      error => console.error('Error getting auth information', error)
    );
  },

  BROWSER_ARTISTS_API_CALL: (token, dispatcher) => {
    axios.get(API_LIST_ARTISTS + '?token=' + token).then(
      response => dispatcher.dispatch(gotListArtists(response))
    ).catch(
      () => dispatcher.dispatch(gotListArtists(null))
    );
  },

  LIST_BROWSER_API_CALL: (query, dispatcher) => {
    const params = [];
    if (!!query.artists) {
      params.push('artists');
      params.push(query.artists);
    } else {
      params.push('albums');
    }

    if (!!query.albums) {
      params.push(query.albums);
    }

    const queryString = encodeURI(params.map(item => encodeURIComponent(item))
      .reduce((r, s) => r + '/' + s)
    ) + '?' + querystring.stringify({
      artistChanged: !!query.artistChanged ? 'true' : 'false',
      token: query.token
    });

    axios.get(API_LIST_SONGS_FROM_BROWSER + queryString)
    .then(
      response => dispatcher.dispatch(insertBrowserResults(response))
    ).catch(
      () => dispatcher.dispatch(insertBrowserResults(null))
    );
  }
});
