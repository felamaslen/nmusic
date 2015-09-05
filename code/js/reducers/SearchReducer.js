import { fromJS, Map as map } from 'immutable';

import buildMessage from '../MessageBuilder';

import {
  SEARCH_SUGGESTIONS_API_CALL
} from '../constants/effects';

export const searchValueSet = (reduction, value) => {
  return reduction.setIn(['appState', 'search', 'searchValue'], value);
};

const emptySearchSuggestions = {
  data: { artists: [], albums: [], songs: [] }
};

export const searchQueryReceived = reduction => {
  const searchValue = reduction.getIn(['appState', 'search', 'searchValue']);

  if (!searchValue.length) {
    // user cleared the search box before debounce timer ended
    return reduction
      .setIn(['appState', 'search', 'results'], fromJS(emptySearchSuggestions.data))
    ;
  }

  const cachedResult = reduction.getIn(['appState', 'search', 'resultsCache', searchValue]);

  if (!!cachedResult) {
    return reduction
      .setIn(['appState', 'search', 'loading'], false)
      .setIn(['appState', 'search', 'results'], cachedResult)
    ;
  }

  return reduction
    .set(
      'effects',
      reduction.get('effects').push(buildMessage(SEARCH_SUGGESTIONS_API_CALL, {
        searchValue: searchValue,
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
    const _response = noResults ? emptySearchSuggestions : response;

    const newResults = map({
      artists: fromJS(_response.data.artists),
      albums: fromJS(_response.data.albums),
      songs: fromJS(_response.data.songs)
    });

    newReduction = newReduction.setIn(['appState', 'search', 'results'], newResults);

    // cache search result
    const searchValue = reduction.getIn(['appState', 'search', 'searchValue']);
    if (!noResults && searchValue.length) {
      newReduction = newReduction.setIn(
        ['appState', 'search', 'resultsCache', searchValue], newResults
      );
    }
  }

  return newReduction
    .setIn(['appState', 'search', 'loading'], false)
  ;
};
