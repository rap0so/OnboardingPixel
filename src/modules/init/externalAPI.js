import {
  logger,
  resetUser,
  startFlow as startFlowPixel,
  uninstall as uninstallPixel
} from '../index';
import { localStorage } from '../../api';
import { version } from '../../../package.json';

const externalAPI = callback => {
  const init = user => {
    window.conpassMeta = { ...user, method: 'manual' };
    startFlowPixel.init(window.conpassMeta);
  };

  const startFlow = (shortId, options) => {
    startFlowPixel.startFlow(shortId, options);
  };

  const startFlowById = (flowId, options) => {
    startFlowPixel.startFlowById(flowId, options);
  };

  const url = {
    actual: window.location.href,
    old: window.location.href
  };

  const debug = () => {
    logger.debug.setDebug();
  };

  const reset = () => {
    const user = localStorage.user.has('data') && localStorage.user.get('data');
    if (user) {
      resetUser.setUser(user);
      resetUser.reset();
    } else {
      logger.log('Não foi possível obter informações do usuário.');
    }
  };

  const setupForExtension = (token, flow, options) => {
    startFlowPixel.startFlowByJson(token, flow, options, callback);
  };

  const routeChange = () => {
    logger.log('Comando "routeChange" invocado pelo cliente.');
  };

  const uninstall = () => {
    uninstallPixel.uninstall();
    logger.log('Removido fluxo do modo visualização.');
  };

  const unistall = () => {
    uninstall();
  };

  const resetPreviewMode = () => {};

  const pixelVersion = `v${version}`;

  return {
    url,
    init,
    reset,
    debug,
    unistall,
    uninstall,
    startFlow,
    routeChange,
    startFlowById,
    resetPreviewMode,
    setupForExtension,
    version: pixelVersion
  };
};

export default externalAPI;
