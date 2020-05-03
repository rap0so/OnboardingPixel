import styled from 'styled-components';

const CloseButtonStyle = styled.div`
  cursor: pointer;
  position: absolute;
  right: 10px;
  top: ${props => (props.shouldAddPadding ? '25px' : '10px')}
  width: 20px;
  height: 20px;
  opacity: 0.4;
  transition: 0.3s all;
  z-index: 1;

  transform: ${props =>
    props.stepType === 'popover' ? 'scale(0.75)' : 'scale(1)'};

  :after,
  :before {
    content: '';
    height: 20px;
    width: 20px;
    border-top: 2px solid #000;
    position: absolute;
    top: 6px;
    right: -7px;
    transform: rotate(-45deg);
  }

  :before {
    right: 6px;
    transform: rotate(45deg);
  }

  :hover {
    opacity: 0.8;
    transform: ${props =>
      props.stepType === 'popover' ? 'scale(0.85)' : 'scale(1.05)'};
  }
`;

export default CloseButtonStyle;
