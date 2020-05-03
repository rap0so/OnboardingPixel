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

const iconSize = 40;

const CustomerFeedbackStyle = styled.div`
  all: unset;
  width: 255px;
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
    border-radius: ${props =>
      props.theme.popover && !Number.isNaN(props.theme.popover.radius)
        ? `${props.theme.popover.radius}px`
        : '10px'};
    background-color: ${props => props.theme.popover.background};
    --background-color: ${props => props.theme.popover.background || 'white'};
  }

  .back {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    padding: 30px 0;
    position: absolute;
    align-items: center;
    background: #12c1c7;
    transform: rotateY(-180deg);
    backface-visibility: hidden;
    box-shadow: ${props =>
      props.theme.shadow !== 'none' ? '2px 2px 10px rgba(0,0,0,0.2)' : ''};
    border-radius: ${props =>
      props.theme.popover && !Number.isNaN(props.theme.popover.radius)
        ? `${props.theme.popover.radius}px`
        : '10px'};

    * {
      margin: 0 auto;
    }

    h4 {
      color: #fff;
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

  .customer-feedback-list-vote {
    padding: 0;
    display: flex;
    list-style: none;
    text-align: center;
    justify-content: space-evenly;

    li {
      padding: 10px;
      display: inline-block;
      vertical-align: center;
    }

    .customer-feedback-like,
    .customer-feedback-dislike {
      padding: 0;
      width: ${iconSize}px;
      height: ${iconSize}px;
      opacity: 0.6;
      border: none;
      background: none;

      svg {
        width: ${iconSize}px;
        height: ${iconSize}px;
        fill: ${props => {
          if (props.theme.popover.fontColor) {
            return props.theme.popover.fontColor;
          }
          return props.theme.fontPrimaryColor;
        }};
      }

      &:hover {
        opacity: 1;
      }

      &.customer-feedback-like {
        transform: translateY(-6px);
      }

      &.customer-feedback-dislike {
        transform: rotateX(180deg) rotateY(180deg) translateY(-6px);
      }

      &.vote {
        &.customer-feedback-like {
          transform: translateY(-6px) scale(0.8, 0.8);
        }

        &.customer-feedback-dislike {
          transform: rotateX(180deg) rotateY(180deg) translateY(-6px)
            scale(0.8, 0.8);
        }
      }
    }
  }
`;

export default CustomerFeedbackStyle;
