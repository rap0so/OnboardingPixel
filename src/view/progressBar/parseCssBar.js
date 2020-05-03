const getCssInPositionBar = (position, isOnTitle) => {
  const defaultCssTopBottom = {
    right: 0,
    position: 'absolute',
    width: 'calc(100% - 40px)',
    left: 0,
    margin: 'auto'
  };
  switch (position) {
    case 'top':
      return {
        ...defaultCssTopBottom,
        top: isOnTitle ? 2 : -4,
        width: 'calc(100% - 22px)'
      };
    case 'bottom':
      return {
        ...defaultCssTopBottom,
        bottom: 8
      };
    default:
      return {
        ...defaultCssTopBottom,
        bottom: 8
      };
  }
};
const getCssOutPositionBar = position => {
  const defaultCssTopBottom = {
    width: '100%',
    position: 'fixed',
    left: 0,
    right: 0
  };
  const defaultCssLeftRight = {
    position: 'fixed',
    width: '100vh',
    transform: 'rotate(90deg)',
    transformOrigin: '100% 0',
    top: 0
  };

  switch (position) {
    case 'top':
      return {
        top: 0,
        ...defaultCssTopBottom
      };
    case 'left':
      return {
        ...defaultCssLeftRight,
        transformOrigin: '0px 0px',
        left: 16
      };
    case 'right':
      return {
        ...defaultCssLeftRight,
        transform: 'rotate(-90deg)',
        right: 16,
        transformOrigin: '100% 0'
      };
    default:
      return {
        bottom: 1,
        ...defaultCssTopBottom
      };
  }
};

const getCssBar = (inOrOut, position, isOnTitle) =>
  inOrOut
    ? getCssInPositionBar(position, isOnTitle)
    : getCssOutPositionBar(position);

export { getCssInPositionBar, getCssOutPositionBar };
export default getCssBar;
