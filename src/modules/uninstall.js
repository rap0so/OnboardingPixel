import { logger } from './index';

const uninstall = {
  dispatch: null,
  setDispatch(dispatch) {
    this.dispatch = dispatch;
  },
  uninstall() {
    if (!this.dispatch) {
      logger.warn('Aplicação não foi iniciada.');
      return;
    }
    this.dispatch({
      reducer: 'flow',
      type: 'CLEAR_FLOW'
    });
  }
};

export default uninstall;
