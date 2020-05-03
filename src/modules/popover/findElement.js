import Logger from '../logger';

const find = (
  target,
  elementSelector,
  elementObj,
  hideLogger,
  targetType,
  frame
) => {
  let element;

  if (!target) {
    Logger.log(`Documento (${targetType}) não informado.`);
    return false;
  }

  // Method recommended
  if (elementSelector) {
    element = target.querySelector(elementSelector);
    if (!element && !hideLogger)
      Logger.log('Elemento não encontrado por querySelector.');
  }

  // Id Method
  if (!element && elementObj && elementObj.idHTML) {
    element = target.getElementById(elementObj.idHTML);
    if (!element && !hideLogger) Logger.log('Elemento não encontrado por id.');
  }

  // Name Method
  if (!element && elementObj && elementObj.tagName && elementObj.nameHTML) {
    element = target.querySelector(
      `${elementObj.tagName}[name="${elementObj.nameHTML}"]`
    );
    if (!element && !hideLogger)
      Logger.log('Elemento não encontrado por atributo name.');
  }

  // TextContent Method
  if (!element && elementObj && elementObj.tagName && elementObj.textContent) {
    const elements = target.querySelectorAll(elementObj.tagName);
    for (let i = 0; i < elements.length; i += 1) {
      let text = elements[i].textContent.toLowerCase();
      text = text.replace(/\s+/g, '');
      if (text === elementObj.textContent.toLowerCase()) {
        element = elements[i];
        if (!element && !hideLogger)
          Logger.log('Elemento não encontrado por tag e conteúdo.');
        break;
      }
    }
  }

  if (!element) {
    if (!hideLogger) Logger.warn('Elemento não encontrado:', elementSelector);

    return false;
  }

  if (elementSelector !== '.conpass-step') {
    if (targetType === 'iFrame' && frame) {
      window.iFrameElement = frame;
    } else {
      delete window.iFrameElement;
    }
  }

  return element;
};

export default function findElement(
  elementSelector,
  elementObj,
  hideLogger = false
) {
  const target = window.top.document;
  const iFrames = target.querySelectorAll('iframe');
  let element = find(
    target,
    elementSelector,
    elementObj,
    hideLogger,
    'document'
  );

  if (!element && iFrames && iFrames.length) {
    // converts from nodeElements to array
    const arrayiFrames = Array.prototype.slice.call(iFrames);
    const arrayiFramesFilter =
      arrayiFrames &&
      arrayiFrames.length &&
      arrayiFrames
        .map(item =>
          find(
            item && item.contentDocument,
            elementSelector,
            elementObj,
            hideLogger,
            'iFrame',
            item
          )
        )
        .filter(item => item);

    element =
      arrayiFramesFilter && arrayiFramesFilter.length && arrayiFramesFilter[0];
  }

  return element;
}
