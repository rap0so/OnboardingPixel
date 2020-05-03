import { User, logger, callDispatch } from '../modules';

export default (state, action, dispatch) => {
  let newState = {
    ...state
  };

  if (
    action.type === 'CREATE_OR_UPDATE_USER' ||
    action.type === 'IDENTIFY_USER' ||
    action.type === 'DELETE_USER'
  ) {
    if (newState.isPreviewMode) return newState;
    if (action.type === 'DELETE_USER')
      newState = { ...state, deletedUser: true };

    newState = {
      ...newState,
      isLoadingUser: User[action.type](action.payload, dispatch) || true
    };
  }

  if (action.type === 'RECEIVE_USER') {
    const user = User[action.type](action);

    if (
      user &&
      state &&
      !state.flow &&
      (!state.listFlows ||
        (state.listFlows && (!state.listFlows.length || state.deletedUser))) &&
      !state.customerFeedback
    ) {
      newState.deletedUser = false;

      if (window.cpdata && window.cpdata.isNps) {
        callDispatch(dispatch, {
          reducer: 'nps',
          type: 'GET_LIST_NPS'
        });
      }

      callDispatch(dispatch, {
        reducer: 'flow',
        type: 'GET_FLOWS',
        payload: {
          options: {
            autoStart: true
          }
        }
      });
    }

    if (state.isLoadingUser && !state.user && user) {
      logger.log('Usuário identificado com sucesso.', `(${user.alias})`);
      logger.space();
    } else if (state.isLoadingUser && !state.user && !user) {
      logger.log('Usuário não foi identificado.');
    }

    if (user) window.Conpass.user = user;

    newState = {
      ...state,
      deletedUser: false,
      isLoadingUser: false,
      user
    };
  }

  return newState;
};
