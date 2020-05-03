import { Activity, rdStation } from '../modules';

const bindUser = state => {
  const { user } = state;
  return {
    name: user.name,
    email: user.email,
    alias: user.alias,
    userId: user._id
  };
};

function hashGenerate() {
  let hash = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 40; i += 1) {
    hash += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return hash;
}

const view = hashGenerate();

export default (state, action, dispatch) => {
  let newState = {
    ...state
  };

  if (state && state.isPreviewMode) return newState;

  if (action.type === 'RECEIVE_ACTIVITY') {
    newState = {
      ...state,
      isLoadingActivity: Activity[action.type](action.payload) || true
    };
  }

  if (action.type === 'POST_ACTIVITY') {
    const { flow, currentStep } = state;
    const step = flow.steps[currentStep - 1];
    const object =
      action.payload.type === 'step'
        ? {
            _id: step._id,
            flow: step.flow,
            type: step.type,
            order: step.order,
            title: step.title,
            element: step.element,
            messages: step.messages,
            placement: step.placement,
            properties: step.properties
          }
        : { title: flow.title, _id: flow._id };

    const payload = {
      ...action.payload,
      user: bindUser(state),
      object,
      view
    };

    if (
      step &&
      step.properties &&
      step.properties.integrateRdStation &&
      action.payload &&
      action.payload.status === 'start' &&
      action.payload.type === 'step'
    ) {
      rdStation.sendDataRdStation(payload.user, flow, step);
    }

    newState = {
      ...state,
      isLoadingActivity: false,
      activity: Activity[action.type](payload, dispatch)
    };
  }

  return newState;
};
