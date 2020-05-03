import React from 'react';
import styled from 'styled-components';
import { ContextModel } from '../../../io/models';
import { Button } from '../../sections';
import ProgressBar from '../../progressBar';
import helper from '../../../helpers';

const FooterStyle = styled.div`
  margin: ${props => (props.type === 'popover' ? '15px 0 0 0' : '20px')};
  display: flex;
  flex-direction: row;
  align-content: space-between;
  justify-content: space-between;
`;

function Footer(props) {
  const { Context, step } = props;
  const flow = Context && Context.state && Context.state.flow;
  const currentStep = Context && Context.state && Context.state.currentStep;
  const { progress } = flow;
  const { getProp: _get } = helper;
  const isProgressActive = _get(progress, 'active', false);
  const progressPosition = _get(progress, 'onStep', false);
  const progressType = _get(progress, 'type');
  const progressTypeAllowed =
    (progressType === 'simple' && progressPosition) ||
    (progressType === 'bar' && progressPosition);
  const shouldShowProgressBar =
    progress && isProgressActive && progressTypeAllowed;
  return (
    <FooterStyle className="conpass-footer" type={step.type}>
      <Button
        // eslint-disable-next-line
        tabIndex="98"
        label={(step.properties && step.properties.btnPreviousMsg) || 'Back'}
        type="back"
        size={step.type === 'popover' ? 'small' : 'normal'}
        hide={Context.state.currentStep === 1}
        {...props}
      />
      {shouldShowProgressBar && (
        <ProgressBar flow={flow} currentStep={currentStep} />
      )}
      {step.triggerMode !== 'onElementClick' &&
        step.triggerMode !== 'onMouseOver' && (
          <Button
            // eslint-disable-next-line
            tabIndex="97"
            label={
              (step.type !== 'popover' &&
                step.properties &&
                step.properties.buttonStartTxt) ||
              (step.properties && step.properties.btnNextMsg) ||
              'Next'
            }
            type={
              (Context.state.currentStep === Context.state.flow.steps.length &&
                'finish') ||
              'next'
            }
            size={step.type === 'popover' ? 'small' : 'normal'}
            {...props}
            link={step.properties && step.properties.link}
          />
        )}
    </FooterStyle>
  );
}

Footer.defaultProps = {
  Context: {
    state: undefined,
    dispatch: () => {}
  }
};

Footer.propTypes = ContextModel;

export default Footer;
