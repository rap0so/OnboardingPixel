import findElement from './findElement';
import { callDispatch, logger } from '../index';

function getElementY(query) {
  return window.pageYOffset + query.getBoundingClientRect().top;
}

function manualScroll(element, stepElement, placement) {
  const duration = 600;
  const startingY = window.pageYOffset;
  const elementY = getElementY(element);
  const elementClientHeight =
    element.tagName.toLowerCase() !== 'svg'
      ? element.clientHeight
      : element.getBoundingClientRect().height;
  const targetY =
    document.body.scrollHeight - elementY < window.innerHeight
      ? document.body.scrollHeight - window.innerHeight
      : elementY;
  const diff =
    targetY -
    startingY -
    (placement === 'top'
      ? stepElement.clientHeight + 18
      : window.innerHeight -
        elementClientHeight -
        stepElement.clientHeight -
        18);

  function easing(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
  let start;

  window.requestAnimationFrame(function step(timestamp) {
    if (!start) {
      start = timestamp;
    }
    const time = timestamp - start;
    let percent = Math.min(time / duration, 1);
    percent = easing(percent);
    window.scrollTo(0, startingY + diff * percent);

    if (time < duration) {
      window.requestAnimationFrame(step);
    }
  });

  return false;
}

function scrollToElement(
  elementSelector,
  elementObj,
  stepElement,
  placement,
  skipToNextStep,
  dispatch,
  stepOrder,
  stepType
) {
  const element = findElement(elementSelector, elementObj, true);

  if (!element || (!element.offsetParent && !element.offsetHeight)) {
    logger.log(
      'Opção para pular para o próximo passo',
      `${!skipToNextStep ? 'des' : ''}ativada`
    );
    if (skipToNextStep) {
      logger.log('Pulando para o próximo passo');
      callDispatch(dispatch, {
        reducer: 'flow',
        type: 'LOAD_STEP',
        payload: { order: stepType === 'next' ? stepOrder + 1 : stepOrder - 1 }
      });
    }

    return false;
  }

  const elementClientHeight =
    element.tagName.toLowerCase() !== 'svg'
      ? element.clientHeight
      : element.getBoundingClientRect().height;
  const viableHeight = elementClientHeight / 2 + stepElement.clientHeight + 30;

  if (placement === 'top' || placement === 'bottom') {
    if (viableHeight < window.innerHeight / 2) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }

    if (viableHeight >= window.innerHeight / 2) {
      manualScroll(element, stepElement, placement);
    }

    return true;
  }

  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  });

  return true;
}

export default scrollToElement;
