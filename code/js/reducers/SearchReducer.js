import { fromJS, List } from 'immutable';

import buildMessage from '../MessageBuilder';

import {
  SEARCH_SUGGESTIONS_API_CALL
} from '../constants/effects';

export const searchQueryReceived = (reduction, searchTerm) => {
  return reduction
    .set(
      'effects',
      reduction.get('effects').push(buildMessage(SEARCH_SUGGESTIONS_API_CALL, {
        searchTerm: searchTerm,
        token: reduction.getIn(['appState', 'auth', 'token'])
      }))
    )
    .setIn(['appState', 'search', 'loading'], true)
  ;
};

export const searchSuggestionsReceived = (reduction, response) => {
  const noResults = response === false;

  const error = !noResults && (!response || response.status !== 200);

  let newReduction = reduction;

  if (!error) {
    newReduction = newReduction
      .setIn(
        ['appState', 'search', 'results', 'artists'],
        noResults ? List.of() : fromJS(response.data.artists)
      )
      .setIn(
        ['appState', 'search', 'results', 'albums'],
        noResults ? List.of() : fromJS(response.data.albums)
      )
      .setIn(
        ['appState', 'search', 'results', 'songs'],
        noResults ? List.of() : fromJS(response.data.songs)
      )
    ;
  }

  return newReduction
    .setIn(['appState', 'search', 'loading'], false)
  ;
};
