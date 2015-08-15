import buildMessage from '../MessageBuilder';
import { APP_HIDE_SPINNER } from '../constants/Actions';

export const hideSpinner = () => buildMessage(APP_HIDE_SPINNER, {});
