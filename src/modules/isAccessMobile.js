import { localStorage } from '../api';
import { logger } from './index';

function isAccessMobile() {
  const publicToken =
    (localStorage.conpass.has('publicToken') &&
      localStorage.conpass.get('publicToken')) ||
    window.cppt;

  const userAgent = navigator.userAgent.toLowerCase();
  const exception = ['KOddJshzRcmg', '2vr8vj7wXWjU'];

  if (
    !exception.includes(publicToken) &&
    userAgent.search(
      /(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i
    ) !== -1
  ) {
    logger.warn('Does not work on mobile browsers. :(');
    return true;
  }
  return false;
}

export default isAccessMobile;
