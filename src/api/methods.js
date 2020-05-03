import { Api, localStorage } from './index';
import { callDispatch, Segmentation, logger } from '../modules';
import activity from './activity/activity';

const getTimeStringCache = () => {
  const date = new Date();

  const addedZero = value => String(value).padStart(2, '0');
  const getMinutes = () => `${addedZero(date.getMinutes())}`[0];

  return (
    date.getFullYear() +
    addedZero(date.getMonth() + 1) +
    addedZero(date.getDate()) +
    addedZero(date.getHours()) +
    getMinutes()
  );
};

const getFlows = (param, action, dispatch) => {
  const publicToken =
    (localStorage.conpass.has('publicToken') &&
      localStorage.conpass.get('publicToken')) ||
    window.cppt;

  const url = publicToken
    ? `flows/master/cache/${publicToken}/${getTimeStringCache()}`
    : 'flows/master';

  const apiAction = {
    ...action
  };

  if (param.options) {
    apiAction.extra = {
      ...param.options
    };
  }

  return Api.get(url, apiAction, dispatch);
};

const getFlowUrl = (listFlows, action, dispatch, options) => {
  const user = localStorage.user.has('data') && localStorage.user.get('data');
  const newAction = {
    ...action
  };

  const url = window.location.href.replace(/^http(s?):\/\//, '');
  const flowsByUrl = Segmentation.validateUrl(listFlows, url);
  const flow =
    (flowsByUrl &&
      flowsByUrl.length &&
      Segmentation.validate(flowsByUrl, user)) ||
    null;

  newAction.payload = {
    data: flow
  };

  if (options) {
    newAction.payload = {
      ...newAction.payload,
      ...(options && options.options)
    };
  }

  return callDispatch(dispatch, newAction);
};

const getFlowId = (listFlows, action, dispatch, options) => {
  const user = localStorage.user.has('data') && localStorage.user.get('data');
  const newAction = {
    ...action
  };

  const flow = Segmentation.validate(listFlows, user, 'id', options.flowId);

  newAction.payload = {
    data: flow
  };

  if (options) {
    newAction.payload = {
      ...newAction.payload,
      ...(options && options.options)
    };
  }

  return callDispatch(dispatch, newAction);
};

const getFlowTitle = (listFlows, action, dispatch, options) => {
  const user = localStorage.user.has('data') && localStorage.user.get('data');
  const newAction = {
    ...action
  };

  const flow = Segmentation.validate(
    listFlows,
    user,
    'shortid',
    options.shortId,
    'title'
  );

  newAction.payload = {
    data: flow
  };

  if (options) {
    newAction.payload = {
      ...newAction.payload,
      ...(options && options.options)
    };
  }

  return callDispatch(dispatch, newAction);
};

const getFlowJson = (payload, action, dispatch) => {
  const jsonAction = {
    ...action,
    payload
  };

  return callDispatch(dispatch, jsonAction);
};

const createOrUpdateUser = (user, action, dispatch) => {
  if (user._id) {
    return Api.put('users/', action, dispatch, user);
  }

  return Api.post('users/', action, dispatch, user);
};

const deleteUser = (user, action, dispatch) => {
  if (user._id) {
    return Api.delete(`users/${user._id}`, action, dispatch);
  }

  return Api.post('users/', action, dispatch, user);
};

const identifyUser = (user, action, dispatch) => {
  const url =
    (user.isAnonymous && `users/alias/${user.alias}`) ||
    `users/email/${user.email}`;

  return Api.get(url, action, dispatch);
};

const customerFeedback = (vote, user, flow) => {
  if (user) {
    const body = {
      result: vote,
      alias: user,
      flow
    };

    return Api.post('customer_feedback/', undefined, undefined, body);
  }

  return null;
};

const getListNps = (action, dispatch) => Api.get('survey', action, dispatch);

const voteNps = (result, surveyId, user, action, dispatch) => {
  if (user) {
    const body = {
      result,
      surveyId,
      alias: user.alias
    };

    if (user.name) body.name = user.name;
    if (user.email) body.email = user.email;
    if (user.custom_fields) body.custom_fields = user.custom_fields;

    return Api.post('survey/result', action, dispatch, body);
  }

  return null;
};

const commentVoteNps = (commentary, resultId, user) => {
  if (user) {
    const body = {
      commentary
    };

    return Api.put(`survey/result/${resultId}`, undefined, undefined, body);
  }

  return null;
};

const sendDataRdStation = (token, email, identify) => {
  if (token && email && identify) {
    const body = {
      token_rdstation: token,
      email,
      identificador: identify
    };

    return Api.rdStation.post(
      'https://www.rdstation.com.br/api/1.2/conversions',
      body,
      response => {
        if (response.status === 200)
          logger.log('Dados enviados com sucesso. [Send data RDStation]');
        else
          logger.log('Não foi possível enviar os dados. [Send data RDStation]');
      }
    );
  }

  return null;
};

export default {
  voteNps,
  activity,
  getFlows,
  getFlowId,
  getFlowUrl,
  deleteUser,
  getListNps,
  getFlowJson,
  getFlowTitle,
  identifyUser,
  commentVoteNps,
  customerFeedback,
  sendDataRdStation,
  createOrUpdateUser
};
