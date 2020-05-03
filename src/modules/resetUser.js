import { logger } from './index';

const resetUser = {
  user: null,
  dispatch: null,
  setUser(user) {
    this.user = user;
  },
  setDispatch(dispatch) {
    this.dispatch = dispatch;
  },
  reset() {
    if (!this.user) return;
    if (!this.dispatch) {
      logger.warn('Aplicação não foi iniciada.');
      return;
    }
    this.user.history = [];
    this.dispatch({
      reducer: 'flow',
      type: 'CLEAR_FLOW'
    });
    this.dispatch({
      reducer: 'user',
      type: 'DELETE_USER',
      payload: this.user
    });
    logger.log('Removido informações do usuário no servidor.');
  }
};

export default resetUser;
