import styled, { keyframes } from 'styled-components';
import loading from './assets/loading';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const SectionStyle = styled.div`
  --background-color: ${props => {
    if (props.type === 'popover') {
      return props.theme.popover.background || 'white';
    }

    return props.theme.modal.background || 'white';
  }};
  all: unset;
  font-size: 14px;
  font-family: sans-serif;
  font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif;
  background-color: #fff;
  background-color: ${props => {
    if (props.type === 'popover') {
      return props.theme.popover.background;
    }

    return props.theme.modal.background;
  }};

  opacity: 0;
  /* transition: all .3s ease-in-out; */
  
  z-index: 2147483647;
  position: absolute;

  &.conpass-show {
    animation: ${fadeIn} 0.5s ease-out;
  }

  border-radius: ${props => {
    if (props.type === 'popover') {
      return props.theme.popover && !Number.isNaN(props.theme.popover.radius)
        ? `${props.theme.popover.radius}px`
        : '10px';
    }

    return props.theme.modal && !Number.isNaN(props.theme.modal.radius)
      ? `${props.theme.modal.radius}px`
      : '10px';
  }};
  width: 90%;
  right: 0;
  left: 0;
  top: 120px;

  margin: auto;
  
  color: ${props => {
    if (props.type === 'popover' && props.theme.popover.fontColor) {
      return props.theme.popover.fontColor;
    }

    if (props.type !== 'popover' && props.theme.modal.fontColor) {
      return props.theme.modal.fontColor;
    }

    return props.theme.fontPrimaryColor;
  }};

  box-shadow: ${props =>
    props.theme.shadow !== 'none' ? '2px 2px 10px rgba(0,0,0,0.2)' : ''};

  padding: ${props => (props.type === 'popover' ? '20px' : '0')};

  * {
    box-sizing: border-box;
  }

  *:focus {
    outline: 0;
  }

  .loading-spinner {
    width: 60px;
    height: 56px;
    position: relative;
    background: url('${loading}') no-repeat center / 40px;
  }

  &.conpass-modal,
  &.conpass-video,
  &.conpass-notification {
    top: auto;
    left: auto;
    z-index: 2147483647;
    right: auto;
    bottom: auto;
    max-width: 100%;
    position: relative;
    .loading-spinner {
      width: 100%;
    }
  }

  &.conpass-notification {
    .loading-spinner {
      height: 100%;
      background-size: 65px;
    }
  }

  @media only screen and (min-width: 400px) {
    width: ${props => {
      if (props.type === 'popover') {
        return '390px';
      }
      if (props.type === 'modal') {
        return '300px';
      }
      return '700px';
    }};
  }

  &.conpass-popover {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;

    .conpass-image {
      width: 60px;

      & + .conpass-content {
        padding-left: 15px;
        width: calc(100% - 60px);
      }
    }

    .conpass-content {
      display: flex;
      align-items: stretch;
      flex-direction: column;

      div {
        font-weight: normal;
        & + div {
          width: 100%;
          line-height: 1.42;
        }
      }
      
      * {
        font-size: 13px;

        & b {
          font-size: inherit;
          font-weight: bold !important;
        }

        & i {
          font-size: inherit;
          font-style: italic !important;
        }

        & u {
          font-size: inherit;
          text-decoration: underline !important;
        }

        & [size="1"] {
          font-size: 11px !important;
        }

        & [size="2"] {
          font-size: 13px !important;
        }

        & [size="3"] {
          font-size: 16px !important;
        }

        & [size="4"] {
          font-size: 18px !important;
        }

        & [size="5"] {
          font-size: 24px !important;
        }

        & [size="6"] {
          font-size: 30px !important;
        }

        & [size="7"], & [size="8"], & [size="9"], & [size="10"] {
          font-size: 36px !important;
        }
      }
    }

    .conpass-footer {
      width: 100%;
    }

    &.top {
      &:before {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        top: 100%;
        left: 50%;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid var(--background-color);
        transform: translateX(-50%);
      }
    }

    &.bottom {
      &:before {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        bottom: 100%;
        left: 50%;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid var(--background-color);
        transform: translateX(-50%);
      }
    }

    &.left {
      &:before {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        top: 50%;
        left: 100%;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid var(--background-color);
        transform: translateY(-50%);
      }
    }

    &.right {
      &:before {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        top: 50%;
        right: 100%
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 10px solid var(--background-color);
        transform: translateY(-50%);
      }
    }

    &.top-right {
      &:before {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        top: calc(100% - 10px);
        right: calc(100% - 10px);
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 20px solid var(--background-color);
        transform: rotate(-45deg);
      }
    }
  
    &.bottom-right {
      &:before {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        bottom: calc(100% - 10px);
        right: calc(100% - 10px);
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 20px solid var(--background-color);
        transform: rotate(45deg);
      }
    }

    &.top-left {
      &:before {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        top: calc(100% - 10px);
        left: calc(100% - 10px);
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 20px solid var(--background-color);
        transform: rotate(-135deg);
      }
    }
    &.bottom-left {
      &:before {
        content: '';
        display: block;
        position: absolute;
        width: 0;
        height: 0;
        bottom: calc(100% - 10px);
        left: calc(100% - 10px);
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 20px solid var(--background-color);
        transform: rotate(135deg);
      }
    }
  }

  .conpass-popover {
    margin: 40px;
    font-size: 14px;
    min-width: 350px;
    max-width: 400px;
    text-align: left;
    padding: 12px 15px;
    border-radius: 5px;
    position: absolute;
    z-index: 2147483647;
    font-family: 'arial';
    background-color: #fff;
    box-shadow: 1px 1px 10px 0 rgba(0, 0, 0, 0.1);
  }

  .conpass-popover .content * {
    font-size: 14px;
  }
  .conpass-popover .title {
    font-weight: bold;
    font-size: 15px;
    margin-bottom: 10px;
  }
  .conpass-popover img {
    float: left;
    border: 1px solid #fff;
    max-width: 50px;
    max-width: 50px;
    margin-right: 15px;
  }
  .conpass-popover .bottom-buttons {
    display: flex;
    justify-content: space-between;
  }

  .conpass-popover .button {
    margin-bottom: 0;
  }

  .conpass-video iframe {
    width: 100%;
    height: auto;
    min-height: 350px;
  }

  .conpass-popover .conpass-footer {
    margin-top: 5px;
  }

  .conpass-popover .title {
    text-align: left;
  }

  &.conpass-notification img {
    width: 100%;
    height: 100%;
    position: relative;
  }
`;

export default SectionStyle;
