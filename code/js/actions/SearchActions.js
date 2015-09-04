import buildMessage from '../MessageBuilder';

import {
  SEARCH_QUERY_RECEIVED,
  SEARCH_SUGGESTIONS_RECEIVED
} from '../constants/actions';

export const searchQueryReceived = searchTerm => buildMessage(SEARCH_QUERY_RECEIVED, searchTerm);

export const searchSuggestionsReceived = response => buildMessage(SEARCH_SUGGESTIONS_RECEIVED, response);
