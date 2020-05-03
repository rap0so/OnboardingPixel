import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: ${props => props.theme.overlayOpacity}; }
`;

const OverlayTag = styled.div`
  pointer-events: none;
  position: absolute;
  z-index: 2147483647;
  text-align: center;
  overflow: auto;
  display: flex;
  overflow: hidden;
  transition: 0.25s ease-in-out;
  animation: ${fadeIn} 0.3s ease-out;

  .element-click {
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    z-index: 1;
    border: none;
    cursor: pointer;
    position: absolute;
    background: transparent;
    pointer-events: auto;
  }

  .element-hover {
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    z-index: 1;
    border: none;
    position: absolute;
    background: transparent;
    pointer-events: auto;
  }

  .conpass-overlay-block {
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: none;
    position: fixed;
    pointer-events: none;

    > div {
      position: fixed;
      pointer-events: none;
    }
  }

  &.use-fade {
    border-radius: 2px;
    box-shadow: 0 0 0 10000px ${props => props.theme.overlayColor} !important;
    opacity: ${props => props.theme.overlayOpacity};

    .conpass-overlay-block {
      display: block;

      > div {
        position: fixed;
        pointer-events: all;
      }
    }
  }
`;

export default OverlayTag;
