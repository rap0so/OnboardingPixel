const getCssInPositionSimple = position => {
  const defaultLeftRight = {
    position: 'absolute',
    top: '45%',
    fontSize: 11,
    transform: 'rotate(90deg)',
    zIndex: 2147483647
  };
  switch (position) {
    case 'top':
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        margin: 'auto',
        textAlign: 'center',
        zIndex: 2147483647
      };
    case 'left':
      return {
        left: 0,
        ...defaultLeftRight
      };
    case 'right':
      return {
        right: 0,
        ...defaultLeftRight
      };
    default:
      return {};
  }
};
const getCssOutPositionSimple = position => {
  const defaultCssTopBottom = {
    position: 'fixed',
    left: 0,
    right: 0,
    textAlign: 'center'
  };
  const defaultCssLeftRight = {
    position: 'fixed',
    top: '40%'
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
        left: 5
      };
    case 'right':
      return {
        ...defaultCssLeftRight,
        right: 5
      };
    default:
      return {
        bottom: 0,
        ...defaultCssTopBottom
      };
  }
};

const getCssSimple = (inOrOut, position) =>
  inOrOut
    ? getCssInPositionSimple(position)
    : getCssOutPositionSimple(position);

export { getCssInPositionSimple, getCssOutPositionSimple };
export default getCssSimple;
