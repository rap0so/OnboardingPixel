import { Activity } from '../io/adapters';

const RECEIVE_ACTIVITY = payload => Activity.ResponseData(payload);

const POST_ACTIVITY = (payload, dispatch) =>
  Activity.RequestData(payload, dispatch);

export default { RECEIVE_ACTIVITY, POST_ACTIVITY };
