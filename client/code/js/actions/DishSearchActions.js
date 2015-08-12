import buildMessage from '../MessageBuilder';
import {
  DS_FETCHED,
  DS_SEARCH,
  DS_CLICK,
  DS_REMOVE
} from '../constants/Actions';

export const dishesDBFetched = response => buildMessage(DS_FETCHED, response);
export const handleDishSearch = searchTerm => buildMessage(DS_SEARCH, searchTerm);
export const handleDishClick = dish => buildMessage(DS_CLICK, dish);
export const removeDishSelection = index => buildMessage(DS_REMOVE, index);
