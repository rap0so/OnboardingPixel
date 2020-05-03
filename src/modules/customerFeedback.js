import { apiMethods } from '../api';

const VOTE_CUSTOMER_FEEDBACK = (payload, dispatch, state) =>
  apiMethods.customerFeedback(
    payload,
    state.user && state.user.alias,
    state.customerFeedback &&
      state.customerFeedback.flow &&
      state.customerFeedback.flow.id
  );

export default { VOTE_CUSTOMER_FEEDBACK };
