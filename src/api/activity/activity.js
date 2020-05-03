import Api from '../api';

const postActivity = (body, action, dispatch) => {
  const url = `activities/`;
  const newBody = {
    ...body,
    date: new Date().toISOString(),
    url: window.location.href
  };
  return Api.analytics.post(url, newBody, action, dispatch);
};

export default { postActivity };
