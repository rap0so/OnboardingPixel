import findElement from './findElement';
import validatePosition from './validatePosition';

/**
 * @param  {number} a
 */
function divideBy2(a) {
  return a / 2;
}

function getOffsetRect(el) {
  const rect = el.getBoundingClientRect();

  // add window scroll position to get the offset position
  let left = rect.left + window.scrollX;
  let top = rect.top + window.scrollY;
  let right = rect.right + window.scrollX;
  let bottom = rect.bottom + window.scrollY;

  if (window.iFrameElement) {
    const rectFrame = window.iFrameElement.getBoundingClientRect();

    top += rectFrame.top;
    left += rectFrame.left;
    right += rectFrame.right;
    bottom += rectFrame.bottom;
  }

  // width and height are the same
  const { width, height } = rect;
  return { left, top, right, bottom, width, height };
}

/**
 * @param  {string} placement
 * @param  {object} targetElRect
 * @param  {object} stepElRect
 */
function getPositionByPlacement(placement, targetElRect, stepElRect) {
  const OFFSET = 12;
  let topPosition = targetElRect.top + targetElRect.height + OFFSET;
  let leftPosition =
    targetElRect.left -
    divideBy2(stepElRect.width) +
    divideBy2(targetElRect.width);

  switch (placement.toString().toLowerCase()) {
    case 'top': // working
      topPosition = targetElRect.top - stepElRect.height - OFFSET;
      leftPosition =
        targetElRect.left -
        divideBy2(stepElRect.width) +
        divideBy2(targetElRect.width);
      break;
    case 'bottom': // working
      topPosition = targetElRect.top + targetElRect.height + OFFSET;
      leftPosition =
        targetElRect.left -
        divideBy2(stepElRect.width) +
        divideBy2(targetElRect.width);
      break;
    case 'left': // working
      topPosition =
        targetElRect.top -
        divideBy2(stepElRect.height) +
        divideBy2(targetElRect.height);
      leftPosition = targetElRect.left - stepElRect.width - OFFSET;
      break;
    case 'right': // working
      topPosition =
        targetElRect.top -
        divideBy2(stepElRect.height) +
        divideBy2(targetElRect.height);
      leftPosition = targetElRect.left + targetElRect.width + OFFSET;
      break;
    case 'top-left': // working
      topPosition = targetElRect.top - stepElRect.height;
      leftPosition = targetElRect.left - stepElRect.width - OFFSET;
      break;
    case 'top-right': // working
      topPosition = targetElRect.top - stepElRect.height;
      leftPosition = targetElRect.left + targetElRect.width + OFFSET;
      break;
    case 'bottom-right': // working
      topPosition = targetElRect.top + targetElRect.height;
      leftPosition =
        targetElRect.left + parseFloat(targetElRect.width) + OFFSET;
      break;
    case 'bottom-left': // working
      topPosition = targetElRect.top + targetElRect.height;
      leftPosition = targetElRect.left - stepElRect.width - OFFSET;
      break;
    default:
      leftPosition = 0;
      topPosition = 0;
  }

  return {
    left: leftPosition,
    top: topPosition,
    right: 'auto'
  };
}

/**
 * @param  {string} element
 * @param  {string} placement
 */
function setPosition(element, elementObj, placement = 'top') {
  if (!element) {
    return null;
  }

  const targetElement = findElement(element, elementObj);
  const stepElement = findElement('.conpass-step');

  let newPosition = {};
  let hasValidPosition;
  let newPlacement;

  if (targetElement && stepElement) {
    const targetElementPosition = getOffsetRect(targetElement);
    const stepElementPosition = getOffsetRect(stepElement);

    newPosition = getPositionByPlacement(
      placement,
      targetElementPosition,
      stepElementPosition
    );

    ({ hasValidPosition, newPlacement } = validatePosition(
      newPosition,
      stepElement,
      placement
    ));

    while (!hasValidPosition) {
      const revalidate = validatePosition(
        newPosition,
        stepElement,
        newPlacement
      );

      ({ hasValidPosition, newPlacement } = revalidate);

      newPosition = getPositionByPlacement(
        newPlacement,
        targetElementPosition,
        stepElementPosition
      );

      if (newPlacement === placement) hasValidPosition = true;
    }
  }

  return { position: newPosition, placement: newPlacement };
}

export { setPosition, getOffsetRect };
