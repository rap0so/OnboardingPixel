import React from 'react';
import { I18n } from 'react-i18nify';
import { logger } from '../../../modules';
import { ContextModel } from '../../../io/models';
import CloseButtonStyle from './closeButtonStyle';
import getProps from '../../../helpers/get';

const action = {
  reducer: 'flow',
  type: 'CLEAR_FLOW',
  payload: {}
};

const canceledStep = {
  reducer: 'activity',
  type: 'POST_ACTIVITY',
  payload: {
    status: 'canceled',
    type: 'step'
  }
};

const canceledFlow = {
  reducer: 'activity',
  type: 'POST_ACTIVITY',
  payload: {
    status: 'canceled',
    type: 'flow'
  }
};

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

const closeCustomerFeedback = {
  reducer: 'customerFeedback',
  type: 'CLOSE_CUSTOMER_FEEDBACK'
};

const closeNps = {
  reducer: 'nps',
  type: 'CLOSE_NPS'
};

const closeNpsNoVote = {
  reducer: 'nps',
  type: 'NO_VOTE_NPS',
  payload: 'noVote'
};

function CloseButton(props) {
  const { Context, stepType, callback } = props;
  const progress = getProps(Context, 'state.flow.progress', {});
  const { active, onStep, type: progressType, position } = progress;
  const shouldAddPadding =
    active && onStep && progressType === 'bar' && position === 'top';
  return (
    <CloseButtonStyle
      // eslint-disable-next-line
      tabIndex="99"
      className="conpass-close-button"
      aria-label={I18n.t('closeDialog')}
      onClick={e => {
        if (stepType === 'customerFeedback') {
          logger.log('Feedback do fluxo encerrado pelo usuário.');
          Context.dispatch(closeCustomerFeedback);
        } else if (stepType === 'nps') {
          logger.log('Nps encerrado pelo usuário após votar.');
          window.setTimeout(() => {
            Context.dispatch(closeNps);
          }, 2000);
          if (callback) callback(e);
        } else if (stepType === 'npsNoVote') {
          logger.log('Nps encerrado pelo usuário.');
          Context.dispatch(closeNpsNoVote);
        } else if (stepType === 'modal') {
          Context.dispatch(finishedStep);
          Context.dispatch(finishedFlow);
          Context.dispatch(action);
        } else {
          logger.log('Fluxo encerrado pelo usuário.');
          Context.dispatch(canceledStep);
          Context.dispatch(canceledFlow);
          Context.dispatch(action);
        }
      }}
      stepType={stepType}
      shouldAddPadding={shouldAddPadding}
    />
  );
}

CloseButton.defaultProps = {
  Context: {
    state: undefined,
    dispatch: () => {}
  }
};

CloseButton.propTypes = ContextModel;

export default CloseButton;
