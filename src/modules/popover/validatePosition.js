const placements = [
  'top',
  'top-right',
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
  'left',
  'top-left'
];

const getNextInArray = (array, item) => {
  const index = array.indexOf(item);
  return (index + 1) % array.length;
};

const checkSpace = (sides = [], stepPosition, stepElement) => {
  const { left: offsetLeft, top: offsetTop } = stepPosition;
  const { clientWidth: stepWidth, clientHeight: stepHeight } = stepElement;

  return sides.reduce((acc, side) => {
    switch (side) {
      case 'top':
        return acc && offsetTop > 10;
      case 'right':
        return acc && offsetLeft + stepWidth + 10 < window.innerWidth;
      case 'bottom':
        return acc && offsetTop + stepHeight + 10 < document.body.scrollHeight;
      case 'left':
        return acc && offsetLeft > 10;
      default:
        return acc;
    }
  }, true);
};

function validatePosition(stepPosition, stepElement, placement) {
  let hasValidPosition = true;

  if (placement === 'top') {
    hasValidPosition = checkSpace(
      ['top', 'left', 'right'],
      stepPosition,
      stepElement
    );
  }

  if (placement === 'top-right') {
    hasValidPosition = checkSpace(['top', 'right'], stepPosition, stepElement);
  }

  if (placement === 'right') {
    hasValidPosition = checkSpace(
      ['bottom', 'right', 'top'],
      stepPosition,
      stepElement
    );
  }

  if (placement === 'bottom-right') {
    hasValidPosition = checkSpace(
      ['bottom', 'right'],
      stepPosition,
      stepElement
    );
  }

  if (placement === 'bottom') {
    hasValidPosition = checkSpace(
      ['bottom', 'left', 'right'],
      stepPosition,
      stepElement
    );
  }

  if (placement === 'bottom-left') {
    hasValidPosition = checkSpace(
      ['bottom', 'left'],
      stepPosition,
      stepElement
    );
  }

  if (placement === 'left') {
    hasValidPosition = checkSpace(
      ['bottom', 'left', 'top'],
      stepPosition,
      stepElement
    );
  }

  if (placement === 'top-left') {
    hasValidPosition = checkSpace(['top', 'left'], stepPosition, stepElement);
  }

  return {
    hasValidPosition,
    newPlacement: hasValidPosition
      ? placement
      : placements[getNextInArray(placements, placement)]
  };
}

export default validatePosition;
