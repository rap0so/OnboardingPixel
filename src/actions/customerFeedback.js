import { customerFeedback, logger } from '../modules';
import { localStorage } from '../api';

const setFeedbackHistory = (user, flow) => {
  const newUser = user;

  for (let i = 0; i < newUser.history.length; i += 1) {
    if (newUser.history[i]._id === flow) {
      newUser.history[i].customerFeedback = true;
      break;
    }
  }

  return newUser;
};

export default (state, action, dispatch) => {
  let newState = {
    ...state
  };

  if (action.type === 'SHOW_CUSTOMER_FEEDBACK') {
    logger.log('Aberto opção para feedback do usuário.');

    newState = {
      ...newState,
      user: setFeedbackHistory(state.user, action.payload.flow.id),
      customerFeedback: newState && !newState.deletedUser && action.payload
    };

    const historyAction = {
      reducer: 'user',
      type: 'CREATE_OR_UPDATE_USER'
    };

    localStorage.user.set('data', newState.user);
    Promise.resolve().then(() => {
      dispatch(historyAction);
    });
  }

  if (action.type === 'VOTE_CUSTOMER_FEEDBACK') {
    logger.log('Usuário votou:', (action.payload && 'Like') || 'Dislike');

    newState = {
      ...newState,
      isLoadingFeedback: customerFeedback[action.type](
        action.payload,
        dispatch,
        state
      )
    };
  }

  if (action.type === 'CLOSE_CUSTOMER_FEEDBACK') {
    newState = {
      ...newState,
      customerFeedback: undefined,
      isLoadingFeedback: false
    };
  }

  return newState;
};
