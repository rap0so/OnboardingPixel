import React, { Component } from 'react';
import { ThemeProvider } from 'styled-components';
import { ContextModel } from '../io/models';
import {
  Section,
  Overlay,
  CloseButton,
  Footer,
  ProgressBar
} from './components';
import StepStyle from './stepStyle';
import {
  logger,
  setTheme,
  customEvent,
  setPosition,
  injectCustomCss,
  scrollToElement
} from '../modules';
import _get from '../helpers/get';

const defStyle = show => ({
  position: 'fixed',
  left: 0,
  top: 0,
  right: 0,
  padding: '10',
  bottom: 0,
  pointerEvents: (show && 'all') || 'none',
  zIndex: 2147483632,
  overflow: 'auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
});

class Step extends Component {
  constructor(props) {
    super(props);
    this.step = React.createRef();
    this.state = {
      style: {},
      show: false
    };
    this.updateStep = this.updateStep.bind(this);
    this.escapeCloseStep = this.escapeCloseStep.bind(this);
    this.stopScrollListener = this.stopScrollListener.bind(this);
  }

  componentDidMount() {
    const { Context } = this.props;
    const { flow, currentStep } = Context.state;
    const step = Context.state && flow && flow.steps[currentStep - 1 || 0];

    logger.log(`Iniciado o ${currentStep || 0}º passo.`);
    this.customEvent(currentStep);

    window.addEventListener('scroll', this.stopScrollListener);
    window.addEventListener('keydown', this.escapeCloseStep);

    if (step.type === 'popover') {
      const selfStep = this.step;
      setTimeout(() => {
        const element = scrollToElement(
          step.elementSelector,
          step.element,
          selfStep,
          step.placement,
          flow.skipToNextStep,
          Context.dispatch,
          step.order,
          Context.state.loadStepType
        );
        if (element || !flow.skipToNextStep) this.updateStep(step);
      }, step.delay || 50);
    } else {
      this.setState({
        style: {}
      });
      setTimeout(() => {
        this.setState({
          show: true
        });
      }, 50);
    }

    Context.dispatch({
      reducer: 'activity',
      type: 'POST_ACTIVITY',
      payload: {
        status: 'start',
        type: 'step'
      }
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { state } = this;
    const { Context } = this.props;
    const { flow, currentStep } = nextProps.Context.state;
    const step =
      nextProps.Context.state && flow && flow.steps[currentStep - 1 || 0];

    if (currentStep !== Context.state.currentStep) {
      logger.log(`Iniciado o ${currentStep || 0}º passo.`);

      this.setState({
        show: false
      });

      if (this.step && this.step.focus) this.step.focus();
      this.customEvent(Context.state.currentStep, 'onfinishstep');
      this.customEvent(currentStep);

      if (step.type === 'popover') {
        const selfStep = this.step;
        setTimeout(() => {
          const element = scrollToElement(
            step.elementSelector,
            step.element,
            selfStep,
            step.placement,
            flow.skipToNextStep,
            Context.dispatch,
            step.order,
            nextProps.Context.state.loadStepType
          );

          setTimeout(() => {
            if (element || !flow.skipToNextStep) this.updateStep(step);
          }, 600);
        }, step.delay || 0);
      } else {
        this.setState({
          style: {}
        });
        setTimeout(() => {
          this.setState({
            show: true
          });
        }, 50);
      }

      Context.dispatch({
        reducer: 'activity',
        type: 'POST_ACTIVITY',
        payload: {
          status: 'start',
          type: 'step'
        }
      });
    }

    return (
      nextProps.Context.state.currentStep !== Context.state.currentStep ||
      state.show !== nextState.show ||
      state.style !== nextState.style
    );
  }

  componentWillUnmount() {
    const { Context } = this.props;
    this.customEvent(Context.state.currentStep, 'onfinishstep');
    window.removeEventListener('scroll', this.stopScrollListener);
    window.removeEventListener('keydown', this.escapeCloseStep);
  }

  customEvent(currentStep, type = 'onstartstep') {
    const { Context } = this.props;
    const { flow } = Context.state;
    const step = flow.steps[currentStep - 1 || 0];

    if (!step) return;

    const details = {
      order: step.order,
      title: (
        step.title ||
        (step.properties &&
          step.properties.introTxtModal &&
          step.properties.introTxtModal) ||
        ''
      ).replace(/<[^>]*>/g, ''),
      type: step.type
    };

    if (step.elementSelector) details.elementSelector = step.elementSelector;

    customEvent(type, details);
  }

  updateStep(step) {
    const { position, placement } = setPosition(
      step.elementSelector,
      step.element,
      step.placement
    );
    this.setState({
      style: position || {},
      placement,
      show: true
    });
  }

  stopScrollListener() {
    const { Context } = this.props;
    const { flow, currentStep } = Context.state;
    const step = flow && flow.steps[currentStep - 1 || 0];

    if (step.type !== 'popover') return;

    window.clearTimeout(this.isScrolling);

    this.isScrolling = setTimeout(() => {
      this.updateStep(step);
    }, 60);
  }

  escapeCloseStep(event) {
    const { Context } = this.props;

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

    if (event.keyCode === 27) {
      if (!event.autoFinish) logger.log('Fluxo encerrado pelo usuário.');
      Context.dispatch(canceledStep);
      Context.dispatch(canceledFlow);
      Context.dispatch(action);
    }

    if (event.keyCode === 9) {
      event.preventDefault();
      // event.stopPropagation();
      const { shiftKey } = event;

      const thisClass = event.target.className.split(' ')[0] || '';
      const thisIndex = event.target.getAttribute('tabindex');
      let conpassIndexElements = [
        ...document.querySelectorAll(
          `.conpass-wrapper [tabindex]:not(.${thisClass})`
        )
      ];

      if (conpassIndexElements && conpassIndexElements.length) {
        conpassIndexElements = conpassIndexElements.sort(
          (a, b) =>
            (!shiftKey &&
              parseInt(a.getAttribute('tabindex'), 10) -
                parseInt(b.getAttribute('tabindex'), 10)) ||
            (shiftKey &&
              parseInt(b.getAttribute('tabindex'), 10) -
                parseInt(a.getAttribute('tabindex'), 10))
        );

        const conpassIndexElementsResult = conpassIndexElements.filter(
          item =>
            (!shiftKey &&
              parseInt(item.getAttribute('tabindex'), 10) >
                parseInt(thisIndex, 10)) ||
            (shiftKey &&
              parseInt(item.getAttribute('tabindex'), 10) <
                parseInt(thisIndex, 10))
        );

        if (conpassIndexElementsResult && conpassIndexElementsResult.length) {
          conpassIndexElementsResult[0].focus();
        } else {
          conpassIndexElements[0].focus();
        }
      }
    }
  }

  render() {
    const { style, placement, show } = this.state;
    const { Context } = this.props;

    if (!Context.state) {
      return null;
    }

    const { flow, currentStep } = Context.state;

    flow.styles = {
      width: 500
    };

    const step =
      Context.state && flow && flow.steps && flow.steps[currentStep - 1 || 0];
    const beforeStep =
      (Context.state && flow && flow.steps && flow.steps[currentStep - 2]) ||
      {};
    injectCustomCss(flow.theme.css);
    const newTheme = setTheme(flow.theme, { mode: 'conpass' });
    if (!step) return null;

    const { progress } = flow;
    const progressType = _get(progress, 'type');
    const progressPosition = _get(progress, 'onStep', false);
    const progressTypeAllowed =
      (progressType === 'simple' && !progressPosition) ||
      (progressType === 'bar' && !progressPosition);
    const shouldShowProgressBar =
      progress && progress.active && progressTypeAllowed;
    return (
      <ThemeProvider theme={newTheme}>
        <div
          aria-live="polite"
          className="conpass-wrapper"
          style={step.type !== 'popover' ? defStyle(show) : null}
        >
          <Overlay
            show={show}
            step={step}
            Context={Context}
            stepType={step.type}
            useFade={step.useFade}
            element={step.element}
            beforeStep={beforeStep}
            updateStep={this.updateStep}
            triggerMode={step.triggerMode}
            elementSelector={step.elementSelector}
          />
          {shouldShowProgressBar && (
            <ProgressBar flow={flow} currentStep={currentStep} />
          )}
          <StepStyle
            role="dialog"
            modal="true"
            tabIndex="0"
            aria-label={step.title}
            type={step.type}
            className={`conpass-step conpass-${step.type} ${placement} ${
              show ? 'conpass-show' : ''
            }`}
            style={{ ...style, opacity: show ? 1 : 0 }}
            ref={node => {
              if (node) {
                this.step = node;
                node.focus();
              }
            }}
          >
            <CloseButton {...this.props} stepType={step.type} />

            {step.sections.map(section => {
              const newProps = {
                ...section,
                Context
              };
              return (
                <Section
                  step={step}
                  key={[section.type, section.order].join('-')}
                  tabIndex={section.order}
                  {...newProps}
                />
              );
            })}

            {step.type !== 'modal' && <Footer {...this.props} step={step} />}
          </StepStyle>
        </div>
      </ThemeProvider>
    );
  }
}

Step.defaultProps = {
  Context: {
    state: undefined,
    dispatch: () => {}
  }
};

Step.propTypes = ContextModel;
export default Step;
