import {
  AUTH_TEST,
  AUTH_AUTHENTICATE,

  API_SEARCH_SUGGESTIONS,
  API_LIST_ARTISTS,
  API_LIST_SONGS_FROM_BROWSER
} from '../config';

import { Map as map } from 'immutable';
import axios from 'axios';

import {
  AUTHTEST_API_CALL,
  AUTHENTICATE_API_CALL,
  SEARCH_SUGGESTIONS_API_CALL,
  BROWSER_ARTISTS_API_CALL,
  LIST_BROWSER_API_CALL,
  SETTINGS_UPDATE_TRIGGERED
} from '../constants/effects';

import { setSettings } from '../actions/AppActions';
import { searchSuggestionsReceived } from '../actions/SearchActions';
import { authGotResponse } from '../actions/LoginActions';
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
  [SEARCH_SUGGESTIONS_API_CALL]: (query, dispatcher) => {
    axios.get(API_SEARCH_SUGGESTIONS + encodeURIComponent(query.searchValue), {
      headers: { 'x-access-token': query.token }
    }).then(
      response => dispatcher.dispatch(searchSuggestionsReceived(response)),
      () => dispatcher.dispatch(searchSuggestionsReceived(null))
    );
  },

  [AUTHTEST_API_CALL]: (token, dispatcher) => {
    axios.get(AUTH_TEST, {
      headers: { 'x-access-token': token }
    }).then(
      response => dispatcher.dispatch(authGotResponse({
        response: response,
        fromPersistentLogin: true,
        token: token
      }))
    ).catch(
      error => console.error('Error getting auth test information', error)
    );
  },

  [AUTHENTICATE_API_CALL]: (details, dispatcher) => {
    axios.post(AUTH_AUTHENTICATE, {
      username: details.username,
      password: details.password
    }, {
      headers: {
        Accept: 'application/json'
      }
    }).then(
      response => dispatcher.dispatch(authGotResponse({
        response: response,
        fromPersistentLogin: false,
        rememberme: details.rememberme
      }))
    ).catch(
      error => console.error('Error getting auth information', error)
    );
  },

  [BROWSER_ARTISTS_API_CALL]: (token, dispatcher) => {
    axios.get(API_LIST_ARTISTS, {
      headers: { 'x-access-token': token }
    }).then(
      response => dispatcher.dispatch(gotListArtists(response))
    ).catch(
      () => dispatcher.dispatch(gotListArtists(null))
    );
  },

  [LIST_BROWSER_API_CALL]: (query, dispatcher) => {
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
    );

    axios.get(API_LIST_SONGS_FROM_BROWSER + queryString, {
      params: { artistChanged: !!query.artistChanged ? 'true' : 'false' },
      headers: { 'x-access-token': query.token }
    }).then(
      response => dispatcher.dispatch(insertBrowserResults(response))
    ).catch(
      () => dispatcher.dispatch(insertBrowserResults(null))
    );
  },

  [SETTINGS_UPDATE_TRIGGERED]: (_, dispatcher) => {
    window.setTimeout(() => {
      dispatcher.dispatch(setSettings());
    }, 0);
  }
});
