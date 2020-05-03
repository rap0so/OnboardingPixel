import logger from '../../../modules/logger';

export default (element, eventName, eventOptions, forceClick) => {
  const eventMatchers = {
    HTMLEvents: /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
    MouseEvents: /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
  };
  const defaultOptions = {
    pointerX: 0,
    pointerY: 0,
    button: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
    bubbles: true,
    cancelable: true
  };
  const extend = (destination, source) => {
    const newDestination = destination;
    // eslint-disable-next-line
    for (const property in source) newDestination[property] = source[property];
    return newDestination;
  };
  const options = extend(defaultOptions, eventOptions || {});
  let oEvent = null;
  let eventType = null;

  // eslint-disable-next-line
  for (const name in eventMatchers) {
    if (eventMatchers[name].test(eventName)) {
      eventType = name;
      break;
    }
  }

  if (!eventType)
    throw new SyntaxError(
      'Only HTMLEvents and MouseEvents interfaces are supported'
    );

  if (document.createEvent) {
    oEvent = document.createEvent(eventType);
    if (eventType === 'HTMLEvents') {
      oEvent.initEvent(eventName, options.bubbles, options.cancelable);
    } else {
      oEvent.initMouseEvent(
        eventName,
        options.bubbles,
        options.cancelable,
        document.defaultView,
        options.button,
        options.pointerX,
        options.pointerY,
        options.pointerX,
        options.pointerY,
        options.ctrlKey,
        options.altKey,
        options.shiftKey,
        options.metaKey,
        options.button,
        null
      );
    }
    element.dispatchEvent(oEvent);
  } else {
    options.clientX = options.pointerX;
    options.clientY = options.pointerY;
    const evt = document.createEventObject();
    oEvent = extend(evt, options);
    element.fireEvent(`on${eventName}`, oEvent);
  }

  window.setTimeout(() => {
    const opt = {
      bubbles: true,
      cancelable: true,
      view: window
    };
    const el = document.elementFromPoint(options.pointerX, options.pointerY);
    if (el) {
      try {
        if (forceClick) el.click();
      } catch (err) {
        logger.log('Elemento não clicável.');
      } finally {
        el.dispatchEvent(new MouseEvent('mousedown', opt));
        el.dispatchEvent(new MouseEvent('mouseup', opt));
      }
    }
  }, 50);

  return element;
};
