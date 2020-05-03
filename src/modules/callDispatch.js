const callDispatch = (dispatch, action) => {
  Promise.resolve().then(() => {
    dispatch(action);
  });
};

export default callDispatch;
