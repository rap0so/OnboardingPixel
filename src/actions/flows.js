import { Flow, customEvent, callDispatch, logger } from '../modules';
import { localStorage } from '../api';
import { formatAssistant } from '../io/adapters';

const containFeedbackHistory = (user, flow, field, value) => {
  let found = false;
  for (let i = 0; i < user.history.length; i += 1) {
    if (user.history[i]._id === flow && user.history[i][field] === value) {
      found = true;
      break;
    }
  }

  return found;
};

export default (state, action, dispatch) => {
  const user =
    (state && state.user) ||
    (localStorage.user.has('data') && localStorage.user.get('data'));

  if (action.type === 'GET_FLOWS' || action.type === 'GET_FLOW') {
    if (state && state.isPreviewMode) return { ...state };
    const options = (action.payload && action.payload.options) || {};
    return {
      ...state,
      isLoading: Flow[action.type](state, dispatch, { options }) || true
    };
  }

  if (
    action.type === 'GET_FLOW_ID' ||
    action.type === 'GET_FLOW_TITLE' ||
    action.type === 'GET_FLOW_JSON'
  ) {
    let options;

    if (action.type === 'GET_FLOW_ID')
      options = { master: { ...action.payload } };
    if (action.type === 'GET_FLOW_TITLE')
      options = { title: { ...action.payload } };
    if (action.type === 'GET_FLOW_JSON')
      options = { JSON: { ...action.payload } };

    return {
      ...state,
      isLoading: Flow[action.type](state, dispatch, options) || true
    };
  }

  if (action.type === 'RECEIVE_FLOW') {
    let newState = {
      ...state
    };

    const result = Flow[action.type](action) || {};
    const { flow, assistant } = result;
    const currentStep =
      (localStorage.conpass.has('flow') &&
        localStorage.conpass.get('flow') &&
        localStorage.conpass.get('flow').currentStep) ||
      1;

    if (result && result.isPreviewMode) {
      newState = { ...newState, isPreviewMode: true };
    }

    const extra = action.extra || action.payload.extra;

    if (flow && extra && extra.activity && extra.activity.type) {
      Promise.resolve(extra).then(response => {
        const activityAction = {
          reducer: 'activity',
          type: 'POST_ACTIVITY',
          payload: {
            status:
              (response && response.activity && response.activity.type) ||
              'startFlowById',
            type: 'flow'
          }
        };

        dispatch(activityAction);
      });
    }

    if (flow) {
      customEvent('onstartflow', {
        id: flow.id,
        title: flow.title,
        steps: flow.steps && flow.steps.length
      });

      if (user && flow.activeCrossDomain) {
        user.currentStep = currentStep;
        user.currentFlow = flow.shortid;

        const updateUser = {
          reducer: 'user',
          type: 'CREATE_OR_UPDATE_USER',
          payload: user
        };

        callDispatch(dispatch, updateUser);
      }
    }

    if ((flow || assistant) && !newState.eventHasPageFlow) {
      newState.eventHasPageFlow = true;
      customEvent('haspageflow');
    }

    return {
      ...newState,
      flow,
      assistant,
      currentStep,
      isLoading: false
    };
  }

  if (action.type === 'RECEIVE_LIST_FLOWS') {
    return {
      ...state,
      flow: state.flow,
      isLoading: false,
      assistant: undefined,
      eventHasPageFlow: false,
      listFlows: Flow[action.type](action, dispatch, state)
    };
  }

  if (action.type === 'LOAD_STEP') {
    const flowData =
      (localStorage.conpass.has('flow') && localStorage.conpass.get('flow')) ||
      {};
    flowData.currentStep = action.payload.order;
    localStorage.conpass.set('flow', flowData);

    const step =
      state &&
      state.flow &&
      state.flow.steps &&
      state.flow.steps[flowData.currentStep - 1];

    if (!step) {
      logger.log(`Passo ${flowData.currentStep} não encontrado.`);
      logger.log(`Finalizando o fluxo automaticamente.`);
      const closeFlow = {
        reducer: 'flow',
        type: 'CLEAR_FLOW',
        payload: {}
      };

      const canceledStep = {
        reducer: 'activity',
        type: 'POST_ACTIVITY',
        payload: {
          status: 'canceled',
          type: 'step'
        }
      };

      const canceledFlow = {
        reducer: 'activity',
        type: 'POST_ACTIVITY',
        payload: {
          status: 'canceled',
          type: 'flow'
        }
      };
      callDispatch(dispatch, canceledStep);
      callDispatch(dispatch, canceledFlow);
      callDispatch(dispatch, closeFlow);

      return state;
    }

    if (user && state.flow.activeCrossDomain) {
      user.currentStep = action.payload.order;
      user.currentFlow = state.flow.shortid;

      const updateUser = {
        reducer: 'user',
        type: 'CREATE_OR_UPDATE_USER',
        payload: user
      };

      callDispatch(dispatch, updateUser);
    }

    return {
      ...state,
      currentStep: action.payload.order,
      loadStepType: action.payload.type || state.loadStepType || 'next'
    };
  }

  if (
    (user || (state && state.isPreviewMode)) &&
    action.type === 'CLEAR_FLOW'
  ) {
    let newState = { ...state };
    localStorage.conpass.remove('flow');

    if (user.currentStep && user.currentFlow) {
      user.currentStep = null;
      user.currentFlow = null;

      const updateUser = {
        reducer: 'user',
        type: 'CREATE_OR_UPDATE_USER',
        payload: user
      };

      callDispatch(dispatch, updateUser);
    }

    customEvent('onfinishflow');

    const assistant =
      (!newState.isPreviewMode && state.flow && formatAssistant(state.flow)) ||
      (!newState.isPreviewMode &&
        state.assistant &&
        state.assistant.flow &&
        formatAssistant(state.assistant.flow));

    if (newState.isPreviewMode) delete newState.isPreviewMode;

    newState = {
      ...newState,
      user,
      assistant,
      currentStep: 1,
      flow: undefined
    };

    if (
      state.flow &&
      !state.isPreviewMode &&
      state.flow.customerFeedback &&
      state.flow.customerFeedback.active &&
      !containFeedbackHistory(
        state.user,
        state.flow._id,
        'customerFeedback',
        true
      )
    ) {
      callDispatch(dispatch, {
        reducer: 'customerFeedback',
        type: 'SHOW_CUSTOMER_FEEDBACK',
        payload: {
          title:
            (state.flow.customerFeedback &&
              state.flow.customerFeedback.title) ||
            'O que você achou desse fluxo?',
          flow: {
            id: state.flow._id,
            theme: state.flow.theme
          },
          alias: state.user.alias
        }
      });
    }

    return newState;
  }

  if (action.type === 'FORCE_CLEAR_FLOW') {
    let newState = { ...state };
    localStorage.conpass.remove('flow');

    const assistant =
      (!newState.isPreviewMode && state.flow && formatAssistant(state.flow)) ||
      (!newState.isPreviewMode &&
        state.assistant &&
        state.assistant.flow &&
        formatAssistant(state.assistant.flow));

    if (newState.isPreviewMode) delete newState.isPreviewMode;

    newState = {
      ...newState,
      user,
      assistant,
      currentStep: 1,
      flow: undefined
    };

    return newState;
  }

  return state;
};
