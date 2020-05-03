import moment from 'moment';
import { callDispatch, Segmentation } from './index';
import { apiMethods, localStorage } from '../api';
import logger from './logger';

const addDays = (timestamp, days) => {
  const date = moment(timestamp);
  date.add(parseFloat(days), 'days');
  return new Date(date.valueOf());
};

const containNpsHistory = (user, surveyId, noVote = false) => {
  if (!user || !surveyId) return false;

  const found = [];
  const npsHistory = user.history.filter(
    item => item.isNps && ((!noVote && item.rate > 0) || item.rate >= -1)
  );

  const npsHistoryLength = npsHistory.length;
  for (let i = 0; i < npsHistoryLength; i += 1) {
    if (npsHistory[i]._id === surveyId) found.push(npsHistory[i]);
  }

  return found;
};

const GET_LIST_NPS = dispatch => {
  const action = {
    reducer: 'nps',
    type: 'RECEIVE_LIST_NPS'
  };

  if (dispatch) return apiMethods.getListNps(action, dispatch);

  return null;
};

const GET_NPS = (action, dispatch) => {
  const user = localStorage.user.has('data') && localStorage.user.get('data');
  const listNps = action && action.payload && action.payload.listNps;
  const url = window.location.href.replace(/^http(s?):\/\//, '');
  let nps = {};

  if (listNps) {
    const resultListNps = Segmentation.validateUrl(listNps, url, true);

    nps =
      (resultListNps &&
        resultListNps.length &&
        Segmentation.validate(resultListNps, user, null, null, null, true)) ||
      null;

    callDispatch(dispatch, {
      reducer: 'nps',
      type: 'RECEIVE_NPS',
      payload: nps
    });
  }

  return null;
};

const RECEIVE_NPS = action => {
  const user = localStorage.user.has('data') && localStorage.user.get('data');
  const nps =
    (action && action.payload && action.payload.length && action.payload[0]) ||
    (action && action.payload);
  const { _id } = nps;
  let hasHistory = containNpsHistory(user, _id, true);
  const date = new Date().getTime();

  if (hasHistory && hasHistory.length) {
    hasHistory = hasHistory.sort((a, b) => b.viewDate - a.viewDate);

    const rate = {
      '-1': '1',
      '0': '0',
      '1': '30',
      '2': '90',
      '3': '180',
      '4': '365'
    };

    if (parseFloat(hasHistory[0].rate) === 0) {
      logger.warn(
        'A pesquisa já foi vista pelo usuário e a mesma não se repete.'
      );
      return null;
    }

    const historyDate = addDays(
      hasHistory[0].viewDate,
      parseFloat(hasHistory[0].rate) < 30
        ? rate[hasHistory[0].rate]
        : hasHistory[0].rate
    );

    if (historyDate.getTime() >= date) {
      logger.warn(
        `A pesquisa já foi vista pelo usuário. Frequência de ${
          parseFloat(hasHistory[0].rate) < 30
            ? rate[hasHistory[0].rate]
            : hasHistory[0].rate
        } ${parseFloat(hasHistory[0].rate) > 1 ? 'dias' : 'dia'}.`
      );
      return null;
    }

    logger.log(`Mostrando a pesquisa (NPS) "${nps.title}"`);
    return nps;
  }

  logger.log(`Mostrando a pesquisa (NPS) "${nps.title}"`);
  return nps;
};

const RECEIVE_LIST_NPS = action =>
  (action && action.payload && action.payload.data) || [];

const RECEIVE_VOTE_NPS = (action, dispatch, state) => {
  const user = localStorage.user.has('data') && localStorage.user.get('data');
  const { nps } = state;
  const { frequency } = nps;
  let historyRate = 0;
  const alternateFrequency = frequency.includes(',');

  let hasHistory = containNpsHistory(user, nps._id);

  if (hasHistory && hasHistory.length) {
    hasHistory = hasHistory.sort((a, b) => b.viewDate - a.viewDate);

    historyRate = parseFloat(hasHistory[0].rate) < 30 ? hasHistory[0].rate : 0;
  }

  user.history.push({
    rate: alternateFrequency
      ? (historyRate && (historyRate + 1 > 4 ? 1 : historyRate + 1)) || 1
      : nps.frequency,
    isNps: true,
    _id: nps._id,
    title: nps.title,
    viewDate: new Date().getTime()
  });

  localStorage.user.set('data', user);
  callDispatch(dispatch, {
    reducer: 'user',
    type: 'CREATE_OR_UPDATE_USER',
    payload: user
  });

  return (
    action && action.payload && action.payload.data && action.payload.data._id
  );
};

const VOTE_NPS = (action, dispatch) => {
  const user = localStorage.user.has('data') && localStorage.user.get('data');

  if (action && action.payload && user) {
    const receiveVoteAction = {
      reducer: 'nps',
      type: 'RECEIVE_VOTE_NPS'
    };

    return apiMethods.voteNps(
      action.payload.result,
      action.payload.surveyId,
      user,
      receiveVoteAction,
      dispatch
    );
  }

  return null;
};

const NO_VOTE_NPS = (action, dispatch, state) => {
  const user = localStorage.user.has('data') && localStorage.user.get('data');
  const { nps } = state;

  user.history.push({
    rate: -1,
    isNps: true,
    _id: nps._id,
    title: nps.title,
    viewDate: new Date().getTime()
  });

  localStorage.user.set('data', user);
  callDispatch(dispatch, {
    reducer: 'user',
    type: 'CREATE_OR_UPDATE_USER',
    payload: user
  });

  if (action && action.payload && user) {
    callDispatch(dispatch, {
      reducer: 'nps',
      type: 'CLOSE_NPS'
    });

    return apiMethods.voteNps(-1, nps._id, user);
  }

  return null;
};

const COMMENT_VOTE_NPS = action => {
  const user = localStorage.user.has('data') && localStorage.user.get('data');

  if (action && action.payload && user) {
    return apiMethods.commentVoteNps(
      action.payload.commentary,
      action.payload.resultId,
      user
    );
  }

  return null;
};

export default {
  GET_NPS,
  VOTE_NPS,
  RECEIVE_NPS,
  NO_VOTE_NPS,
  GET_LIST_NPS,
  RECEIVE_LIST_NPS,
  COMMENT_VOTE_NPS,
  RECEIVE_VOTE_NPS
};
