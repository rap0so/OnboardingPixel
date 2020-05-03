import { apiMethods, localStorage } from '../../../api';
import { logger, callDispatch } from '../../../modules';

const newAlias = () => {
  const trim = str => str.replace(/\s+/g, '');

  const dom = trim(window.location.hostname.replace(/\./g, ''));
  const d = new Date();
  return `conpassUser_${d.getMilliseconds()}${Math.round(
    100000 * Math.random()
  )}_${dom}`;
};

const validateLocalCache = defaultDate => {
  const newDate = new Date(defaultDate).getTime() + 3600000 * 12;

  return newDate < new Date().getTime();
};

const ResponseData = payload => {
  const user = payload.extra || {};

  user._id =
    (payload.payload && payload.payload.data && payload.payload.data._id) ||
    user._id;
  user.name =
    (payload.payload && payload.payload.data && payload.payload.data.name) ||
    user.name;
  user.history =
    (payload.payload && payload.payload.data && payload.payload.data.history) ||
    user.history;
  user.alias =
    (payload.payload && payload.payload.data && payload.payload.data.alias) ||
    user.alias ||
    newAlias();

  if (!user.notUpdateDate || !user.cacheDate)
    user.cacheDate = new Date().getTime();

  if (
    payload.payload &&
    payload.payload.data &&
    typeof payload.payload.data.currentFlow !== 'undefined' &&
    typeof payload.payload.data.currentStep !== 'undefined'
  ) {
    user.currentFlow = payload.payload.data.currentFlow;
    user.currentStep = payload.payload.data.currentStep;
  } else {
    delete user.currentFlow;
    delete user.currentStep;
  }

  delete user.options;
  delete user.notUpdateDate;

  if (user.currentFlow && user.currentStep) {
    localStorage.conpass.set('flow', {
      type: 'auto',
      hashFlow: user.currentFlow,
      currentStep: user.currentStep,
      urlFlow: window.location.href
    });
  }

  // if (!user._id) delete user._id;
  localStorage.user.set('data', user);

  return user;
};

const RequestData = (payload, dispatch) => {
  const user = window.conpassMeta || payload || {};
  const localUser =
    (localStorage.user.has('data') && localStorage.user.get('data')) || {};

  if (!user.email) {
    user.isAnonymous = true;
    user.alias = user.alias || (localUser && localUser.alias) || newAlias();
  }

  logger.log(
    `Identificando o usuário${(user.isAnonymous && ' anônimo') || ''}.`
  );

  const action = {
    reducer: 'user',
    type: 'RECEIVE_USER'
  };

  if (
    localUser &&
    localUser.cacheDate &&
    typeof localUser.currentFlow === 'undefined' &&
    typeof localUser.currentStep === 'undefined' &&
    !validateLocalCache(localUser.cacheDate) &&
    user.email === localUser.email
  ) {
    if (user.custom_fields && localUser.custom_fields)
      localUser.custom_fields = user.custom_fields;

    action.extra = {
      ...localUser,
      notUpdateDate: true
    };
    action.payload = localUser;
    return callDispatch(dispatch, action);
  }

  if (localUser && user.email !== localUser.email)
    localStorage.conpass.remove('flow');

  delete user._id;
  user.history = [];
  action.extra = user;

  return apiMethods.identifyUser(user, action, dispatch);
};

const CreateOrUpdateUser = (payload, dispatch) => {
  const user =
    payload || (localStorage.user.has('data') && localStorage.user.get('data'));

  const action =
    (!user.notReceive && {
      reducer: 'user',
      type: 'RECEIVE_USER',
      extra: user
    }) ||
    undefined;

  if (user.notReceive) delete user.notReceive;

  return apiMethods.createOrUpdateUser(
    user,
    action,
    (action && dispatch) || undefined
  );
};

const DeleteData = (payload, dispatch) => {
  const user =
    payload || (localStorage.user.has('data') && localStorage.user.get('data'));

  const newUser = {
    ...window.conpassMeta
  };

  const action = {
    reducer: 'user',
    type: 'IDENTIFY_USER',
    payload: newUser
  };

  localStorage.conpass.remove('user.data');
  return apiMethods.deleteUser(user, action, dispatch);
};

export default { RequestData, ResponseData, DeleteData, CreateOrUpdateUser };
