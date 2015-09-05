import buildMessage from '../MessageBuilder';

import {
  SEARCH_VALUE_SET,
  SEARCH_QUERY_RECEIVED,
  SEARCH_SUGGESTIONS_RECEIVED
} from '../constants/actions';

export const searchSetValue = value => buildMessage(SEARCH_VALUE_SET, value);

export const searchQueryReceived = () => buildMessage(SEARCH_QUERY_RECEIVED);

export const searchSuggestionsReceived = response => buildMessage(SEARCH_SUGGESTIONS_RECEIVED, response);
