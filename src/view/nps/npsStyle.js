import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const rotateFront = keyframes`
  from { transform: rotateY(0deg); }
  to { transform: rotateY(-180deg); }
`;

const rotateBack = keyframes`
  from { transform: rotateY(180deg); }
  to { transform: rotateY(0deg); }
`;

const rotateFrontInverse = keyframes`
  from { transform: rotateY(0deg); }
  to { transform: rotateY(180deg); }
`;

const rotateBackInverse = keyframes`
  from { transform: rotateY(180deg); }
  to { transform: rotateY(360deg); }
`;

const buttonSize = 40;

const NpsTyle = styled.div`
  all: unset;
  width: 600px;
  margin: auto;
  display: block;
  font-size: 14px;
  max-width: 100%;
  position: relative;
  z-index: 2147483647;
  animation: ${fadeIn} 0.5s ease-out;
  font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
  perspective: 800px;
  color: ${props => {
    if (props.theme.popover.fontColor) {
      return props.theme.popover.fontColor;
    }
    return props.theme.fontPrimaryColor;
  }};

  * {
    box-sizing: border-box;

    &:focus {
      outline: 0;
    }
  }

  .front {
    padding: 10px;
    background-color: #fff;
    backface-visibility: hidden;
    box-shadow: ${props =>
      props.theme.shadow !== 'none' ? '2px 2px 10px rgba(0,0,0,0.2)' : ''};
    border-radius: 5px;
    background-color: ${props => props.theme.popover.background};
    --background-color: ${props => props.theme.popover.background || 'white'};

    .conpass-title {
      text-align: left;

      > div {
        font-size: 16px;
        padding: 15px 10px;
        text-align: inherit;
      }
    }
  }

  .back {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 30px 0;
    background: #fff;
    position: absolute;
    align-items: center;
    align-content: space-evenly;
    transform: rotateY(-180deg);
    backface-visibility: hidden;
    box-shadow: ${props =>
      props.theme.shadow !== 'none' ? '2px 2px 10px rgba(0,0,0,0.2)' : ''};
    border-radius: 5px;

    * {
      color: #333;
      margin: 0 auto;
      text-align: center;
    }

    p {
      font-size: 16px;
    }

    h4 {
      width: 100%;
      display: block;
    }
  }

  &.thank-you {
    .front {
      animation: ${rotateFront} 0.2s ease-in;
      -webkit-animation-fill-mode: forwards;
    }
    .back {
      animation: ${rotateBack} 0.2s ease-in;
      -webkit-animation-fill-mode: forwards;
    }
  }

  &.thank-you-inverse {
    .front {
      animation: ${rotateFrontInverse} 0.2s ease-in;
      -webkit-animation-fill-mode: forwards;
    }
    .back {
      animation: ${rotateBackInverse} 0.2s ease-in;
      -webkit-animation-fill-mode: forwards;
    }
  }

  .nps-list-values {
    margin: 0;
    display: flex;
    padding: 0 5px;
    list-style: none;
    text-align: center;
    justify-content: space-evenly;

    li {
      padding: 10px 5px;
      display: inline-block;
      vertical-align: middle;
    }

    .nps-button-value {
      padding: 0;
      color: #666;
      border: none;
      padding: 0 8px;
      cursor: pointer;
      font-size: 14px;
      background: none;
      text-align: center;
      border-radius: 5px;
      border: 2px solid #666;
      width: ${buttonSize}px;
      height: ${buttonSize}px;
      transition: all 0.2s ease-in-out;

      &:hover,
      &.active {
        color: #444;
        border-color: #444;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.35);
      }
    }
  }

  .nps-legend {
    padding: 0 10px;

    li {
      width: 50%;
      display: inline-block;

      &:last-child {
        text-align: right;
      }
    }
  }

  .nps-comment-container {
    width: 100%;
    min-width: 560px;
    padding: 10px 5px;
    position: relative;

    .nps-comment-value {
      width: 100%;
      color: #333;
      resize: none;
      height: 80px;
      overflow-y: auto;
      padding: 8px 10px;
      background: #fff;
      border-radius: 3px;
    }

    small {
      left: 5px;
      position: absolute;
      top: calc(100% - 10px);
    }
  }

  .nps-actions-container {
    display: block;
    padding: 0 5px;
    text-align: right;

    button {
      color: #fff;
      cursor: pointer;
      font-size: 12px;
      font-weight: 400;
      padding: 5px 8px;
      border-radius: 0px;
      border-width: 0px;
      text-decoration: none;
      border-style: initial;
      border-color: initial;
      border-image: initial;
      display: inline-block;
      background-color: #e35b05;

      &:disabled {
        opacity: 0.65;
        pointer-events: none;
      }

      &.no-comment {
        background: #bfb5af;
      }
    }
  }
`;

export default NpsTyle;
