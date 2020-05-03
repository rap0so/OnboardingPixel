import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { logger } from '../../../modules';
import { ContextModel } from '../../../io/models';

const ButtonElement = styled.button`
  padding: ${props => {
    if (props.size === 'normal') {
      return '10px 20px';
    }

    return '5px 8px';
  }};
  text-decoration: none;
  border-radius: ${props =>
    props.theme.btnRadius ? `${props.theme.btnRadius}px` : `4px`};
  color: ${props =>
    props.theme.btnTextColor ? props.theme.btnTextColor : '#fff'};
  border: 0;
  cursor: pointer;
  font-size: ${props => {
    if (props.size === 'normal') {
      return '14px';
    }

    return '12px';
  }};
  border-radius: ${props =>
    props.theme.btnRadius ? props.theme.btnRadius : '0px'};
  font-weight: ${props => (props.size !== 'small' ? 600 : 400)};
  background-color: ${props =>
    props.type === 'next' || props.type === 'finish'
      ? props.theme.btnPrimaryColor
      : props.theme.btnBackColor};
  visibility: ${props => (props.hide ? 'hidden' : '')};
  &:hover {
    opacity: 0.85;
    color: ${props =>
      props.theme.btnTextHoverColor ? props.theme.btnTextHoverColor : '#fff'};
  }
  &:focus {
    outline: 0;
  }
  /* &.previous {
    padding: 5px 10px;
    font-size: 14px;
    float: left;
  } */
  /* &.back {
    background-color: transparent;
  } */
  /* &.hide {
    visibility: hidden;
  } */
  &.branch {
    background-color: ${props =>
      props.theme.btnPrimaryColor ? props.theme.btnPrimaryColor : '#7adfba'};
    display: block;
    width: 100%;
    text-align: left;
    padding: 10px 32px 10px 12px;
    border-radius: 6px;
    margin: 10px 0;
    cursor: pointer;
    font-weight: 500;
    font-size: 16px;
    opacity: 0.9;
    color: #fff;
    position: relative;
    background-position: 216px center;
    background-repeat: no-repeat;
    -webkit-transition: all 0.2s;
    -moz-transition: all 0.2s;
    -o-transition: all 0.2s;
    transition: all 0.2s;
  }
  &.branch:hover {
    background-position: 218px center;
    opacity: 1;
  }
  &.branch:focus {
    outline: 0;
    border: 0;
  }
`;

const nextStepAction = (order, type) => ({
  reducer: 'flow',
  type: 'LOAD_STEP',
  payload: { order, type }
});

const closeFlowAction = () => ({
  reducer: 'flow',
  type: 'CLEAR_FLOW'
});

const startFlowAction = id => ({
  reducer: 'flow',
  type: 'GET_FLOW_ID',
  payload: {
    flowId: id,
    options: { alwaysShow: true, activity: { type: 'startFlowById' } }
  }
});

function Button(props) {
  const {
    Context,
    type,
    hide,
    size,
    label,
    className,
    idFlow,
    link,
    tabIndex
  } = props;
  const currentStep = Context.state && Context.state.currentStep;
  const stepOrder = type === 'next' ? currentStep + 1 : currentStep - 1 || 1;

  const action =
    (type === 'start_flow' && startFlowAction(idFlow)) ||
    (type !== 'finish' && nextStepAction(stepOrder, type)) ||
    closeFlowAction();

  const finishedStep = {
    reducer: 'activity',
    type: 'POST_ACTIVITY',
    payload: {
      status: 'finished',
      type: 'step'
    }
  };

  const finishedFlow = {
    reducer: 'activity',
    type: 'POST_ACTIVITY',
    payload: {
      status: 'finished',
      type: 'flow'
    }
  };

  const handleClick = () => {
    Context.dispatch(finishedStep);
    if (type === 'finish') {
      logger.log('Fluxo finalizado pelo usuário.');
      Context.dispatch(finishedFlow);
    }

    if (type === 'start_flow') {
      Context.dispatch(finishedFlow);
      Context.dispatch(closeFlowAction());
    }

    Context.dispatch(action);
  };

  return (
    <ButtonElement
      tabIndex={tabIndex}
      as={link && link.href ? 'a' : 'button'}
      type={type}
      className={[`button-${type}`, 'conpass-button', className].join(' ')}
      size={size}
      hide={hide}
      href={link && link.href}
      target={link && link.target}
      onClick={handleClick}
    >
      {(link && link.textContent) || label}
    </ButtonElement>
  );
}

Button.defaultProps = {
  label: 'Start',
  type: '',
  size: 'normal',
  idFlow: '',
  className: '',
  tabIndex: '',
  step: {},
  hide: false,
  link: {},
  Context: {
    state: undefined,
    dispatch: () => {}
  }
};

Button.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  size: PropTypes.string,
  idFlow: PropTypes.string,
  className: PropTypes.string,
  tabIndex: PropTypes.string,
  step: PropTypes.shape({}),
  hide: PropTypes.bool,
  link: PropTypes.shape({
    href: PropTypes.string,
    target: PropTypes.string,
    textContent: PropTypes.string
  }),
  Context: ContextModel.Context
};

export default Button;
