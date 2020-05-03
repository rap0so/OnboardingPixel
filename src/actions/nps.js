import { Nps, logger, callDispatch } from '../modules';

export default (state, action, dispatch) => {
  let newState = {
    ...state
  };

  if (action.type === 'GET_LIST_NPS') {
    logger.log('Procurando por lista de pesquisas (NPS)');

    newState = {
      ...newState,
      listNps: null,
      isLoadingListNps: Nps[action.type](dispatch) || true
    };
  }

  if (action.type === 'RECEIVE_LIST_NPS') {
    if (action.payload && action.payload.success && action.payload.data) {
      logger.log(
        'Lista de pesquisas (NPS) encontrada com sucesso.',
        `(${action.payload.data.length} pesquisas)`
      );

      if (action.payload.data.length) {
        newState = {
          ...newState,
          isLoadingListNps: false,
          listNps: Nps[action.type](action, dispatch)
        };

        callDispatch(dispatch, {
          reducer: 'nps',
          type: 'GET_NPS',
          payload: {
            listNps: newState.listNps
          }
        });
      }
    }
  }

  if (action.type === 'GET_NPS') {
    newState = {
      ...newState,
      nps: null,
      isLoadingNps: Nps[action.type](action, dispatch) || true
    };
  }

  if (action.type === 'RECEIVE_NPS') {
    if (action.payload) {
      newState = {
        ...newState,
        isLoadingNps: false,
        nps: Nps[action.type](action, dispatch)
      };
    }
  }

  if (action.type === 'CLOSE_NPS') {
    newState = {
      ...newState,
      isLoadingNps: false,
      nps: null
    };

    if (action.payload === 'finish') logger.log('Pesquisa finalizada.');

    delete newState.voteId;
  }

  if (
    action.type === 'VOTE_NPS' ||
    action.type === 'NO_VOTE_NPS' ||
    action.type === 'COMMENT_VOTE_NPS'
  ) {
    Nps[action.type](action, dispatch, state);
  }

  if (action.type === 'RECEIVE_VOTE_NPS') {
    logger.log('Atualizando dados da pesquisa (NPS)');

    newState = {
      ...newState,
      voteId: Nps[action.type](action, dispatch, state)
    };
  }

  return newState;
};
