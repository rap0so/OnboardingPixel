import { Flow } from '../io/adapters';
import { logger, callDispatch } from './index';
import { apiMethods, localStorage } from '../api';

const RECEIVE_FLOW = action =>
  Flow.ResponseData({ ...action.payload, ...action.extra });

const GET_FLOW = (state, dispatch, options) => {
  if ((!state || !state.listFlows) && !options.JSON) {
    logger.log('Nenhum fluxo foi encontrado.');
    return null;
  }

  const action = {
    reducer: 'flow',
    type: 'RECEIVE_FLOW',
    extra: {
      dispatch,
      ...(options && options.options),
      ...(options &&
        options.title &&
        options.title.options &&
        options.title.options.extra),
      ...(options && options.master && options.master.options)
    }
  };

  if (options.master && options.master.flowId) {
    logger.log(
      'Procurando fluxo por identificador.',
      `(${options.master.flowId})`
    );
    return apiMethods.getFlowId(state.listFlows, action, dispatch, {
      ...options.master
    });
  }

  if (options.title && options.title.shortId) {
    logger.log(
      'Procurando fluxo por título/hash.',
      `(${options.title.shortId})`
    );
    return apiMethods.getFlowTitle(state.listFlows, action, dispatch, {
      ...options.title
    });
  }

  if (options.JSON && options.JSON.flow) {
    logger.log('Procurando fluxo por JSON/Extensão.');
    return apiMethods.getFlowJson(options.JSON, action, dispatch, {
      ...options.JSON
    });
  }

  return apiMethods.getFlowUrl(state.listFlows, action, dispatch, options);
};

const GET_FLOW_ID = (state, dispatch, options) =>
  GET_FLOW(state, dispatch, options);

const GET_FLOW_TITLE = (state, dispatch, options) =>
  GET_FLOW(state, dispatch, options);

const GET_FLOW_JSON = (state, dispatch, options) =>
  GET_FLOW(state, dispatch, options);

const GET_FLOWS = (state, dispatch, options) => {
  const action = {
    reducer: 'flow',
    type: 'RECEIVE_LIST_FLOWS',
    extra: {
      dispatch
    }
  };

  logger.log('Procurando por lista de fluxos.');

  if (state && state.listFlows && state.listFlows.length) {
    action.payload = {
      data: state.listFlows
    };
    action.extra = {
      autoStart: true
    };

    return callDispatch(dispatch, action);
  }

  return Flow.RequestListFlows(action, dispatch, options);
};

const RECEIVE_LIST_FLOWS = (action, dispatch) => {
  const { payload } = action;
  let newPayload;

  if (payload && payload.data && payload.data.length) {
    newPayload = payload.data;
    logger.log(
      `Lista de fluxos encontrada com sucesso. (${newPayload.length} fluxos)`
    );
    logger.space();
  } else {
    logger.log(`Lista de fluxos não encontrada.`);
  }

  if (newPayload && action.extra && action.extra.autoStart) {
    const flowData =
      (localStorage.conpass.has('flow') && localStorage.conpass.get('flow')) ||
      {};
    const allowedFlowDataType =
      flowData.type === 'auto' || flowData.type === 'shortid';
    if (flowData.hashFlow && allowedFlowDataType) {
      callDispatch(dispatch, {
        reducer: 'flow',
        type: 'GET_FLOW_TITLE',
        payload: {
          shortId: flowData.hashFlow,
          options: {
            alwaysShow: true
          }
        }
      });
    } else {
      callDispatch(dispatch, {
        reducer: 'flow',
        type: 'GET_FLOW',
        payload: {
          options: {
            activity: { type: 'startFlowByUrl' }
          }
        }
      });
    }
  }

  return newPayload;
};

export default {
  GET_FLOW,
  GET_FLOWS,
  GET_FLOW_ID,
  RECEIVE_FLOW,
  GET_FLOW_JSON,
  GET_FLOW_TITLE,
  RECEIVE_LIST_FLOWS
};
