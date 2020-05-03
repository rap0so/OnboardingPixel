import { startFlow } from '../index';

const observerOptions = {
  childList: true,
  subtree: true
};

const observerCallback = callback => {
  let { actual, old } = window.Conpass.url;

  old = actual;
  actual = window.location.href;

  window.Conpass.url = {
    old,
    actual
  };

  if (actual !== old) {
    startFlow.startFlowAuto();
    callback();
  }
};

const createObserver = (element, callback) => {
  const observer = new MutationObserver(() => observerCallback(callback));
  observer.observe(element, observerOptions);
};

export default createObserver;
