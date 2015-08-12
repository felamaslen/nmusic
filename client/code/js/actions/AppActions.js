import buildMessage from '../MessageBuilder';
import { APP_HIDE_SPINNER } from '../constants/Actions';

export const hideSpinner = () => {
  return buildMessage(APP_HIDE_SPINNER, {});
};
