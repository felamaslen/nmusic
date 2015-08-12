import buildMessage from '../MessageBuilder';
import {
  WS_GET_WINES
} from '../constants/Actions';

export const getTopWines = response => buildMessage(WS_GET_WINES, response);
