const getCssInPositionBar = () => ({
  display: 'none'
});

const getCssOutPositionBar = position => {
  const defaultCssTopBottom = {
    position: 'absolute',
    left: '50%',
    fontSize: 11,
    zIndex: 2147483647,
    top: 1
  };
  const defaultCssLeftRight = {
    position: 'absolute',
    transform: 'rotate(180deg)',
    left: '50%',
    bottom: -2,
    fontSize: 10,
    zIndex: 2147483647
  };

  switch (position) {
    case 'left':
      return {
        ...defaultCssLeftRight
      };
    case 'right':
      return {
        ...defaultCssLeftRight
      };
    default:
      return {
        ...defaultCssTopBottom
      };
  }
};
const getCssPositionBar = (inOrOut, position) =>
  inOrOut ? getCssInPositionBar() : getCssOutPositionBar(position);

export { getCssInPositionBar, getCssOutPositionBar };
export default getCssPositionBar;
