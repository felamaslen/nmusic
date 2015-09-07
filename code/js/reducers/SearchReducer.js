import { fromJS, List } from 'immutable';

import {
  SEARCH_LIST_CATEGORY_ARTIST,
  SEARCH_LIST_CATEGORY_ALBUM,
  SEARCH_LIST_CATEGORY_SONG
} from '../config';

import buildMessage from '../MessageBuilder';

import {
  SEARCH_SUGGESTIONS_API_CALL,
  SEARCH_SELECT_ARTIST,
  SEARCH_SELECT_ALBUM,
  SEARCH_SELECT_SONG
} from '../constants/effects';

export const searchValueSet = (reduction, value) => {
  return reduction.setIn(['appState', 'search', 'searchValue'], value);
};

export const searchQueryReceived = reduction => {
  const searchValue = reduction.getIn(['appState', 'search', 'searchValue']);

  if (!searchValue.length) {
    // user cleared the search box before debounce timer ended
    return reduction
      .setIn(['appState', 'search', 'results'], List.of())
    ;
  }

  const cachedResult = reduction.getIn(['appState', 'search', 'resultsCache', searchValue]);

  if (!!cachedResult) {
    return reduction
      .setIn(['appState', 'search', 'loading'], false)
      .setIn(['appState', 'search', 'hoverIndex'], List.of(-1, null))
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
    const _response = noResults ? { data: { artists: [], albums: [], songs: [] } } : response;

    const newResults = fromJS([
      _response.data.artists,
      _response.data.albums,
      _response.data.songs
    ]);

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
    .setIn(['appState', 'search', 'hoverIndex'], List.of(-1, null))
    .setIn(['appState', 'search', 'loading'], false)
  ;
};

export const searchResultSelected = (reduction, indexes) => {
  const list = reduction.getIn(['appState', 'search', 'results', indexes[0]]);
  const item = list.get(indexes[1]);

  let newEffect;
  switch (indexes[0]) {
  case SEARCH_LIST_CATEGORY_ARTIST:
    newEffect = buildMessage(SEARCH_SELECT_ARTIST, item);
    break;
  case SEARCH_LIST_CATEGORY_ALBUM:
    newEffect = buildMessage(SEARCH_SELECT_ALBUM, item.first());
    break;
  case SEARCH_LIST_CATEGORY_SONG:
  default:
    newEffect = buildMessage(SEARCH_SELECT_SONG, item.first());
    break;
  }

  return reduction.set('effects', reduction.get('effects').push(newEffect));
};

export const searchItemHovered = (reduction, indexes) => {
  return reduction.setIn(['appState', 'search', 'hoverIndex'], fromJS(indexes));
};
