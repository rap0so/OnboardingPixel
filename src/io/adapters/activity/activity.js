import { apiMethods } from '../../../api';

const ResponseData = payload => payload;

const RequestData = (payload, dispatch) => {
  const action = {
    reducer: 'activity',
    type: 'POST_ACTIVITY_SUCCESS'
  };
  return apiMethods.activity.postActivity(payload, action, dispatch);
};

export default { RequestData, ResponseData };
