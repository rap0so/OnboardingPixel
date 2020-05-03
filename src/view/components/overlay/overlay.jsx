import React from 'react';
import PropTypes from 'prop-types';
import Simulate from './simulate';
import OverlayStyle from './overlayStyle';
import { localStorage } from '../../../api';
import { ContextModel } from '../../../io/models';
import { findElement, PseudoStyler, callDispatch } from '../../../modules';
import { getOffsetRect } from '../../../modules/popover/setPosition';

class Overlay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pseudoElement: null
    };
    this.handleOver = this.handleOver.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.styler = new PseudoStyler();
    this.styler.loadDocumentStyles();
  }

  componentWillReceiveProps(nextProps) {
    const { pseudoElement } = this.state;
    const newBeforeStep = nextProps.beforeStep;

    if (nextProps.show) {
      if (
        newBeforeStep &&
        (newBeforeStep.elementSelector || newBeforeStep.element)
      ) {
        const beforeElement = findElement(
          newBeforeStep.elementSelector,
          newBeforeStep.element,
          true
        );

        if (beforeElement && newBeforeStep.triggerMode === 'onMouseOver') {
          this.styler.addStyle(beforeElement, ':hover');
          this.setState({
            pseudoElement: beforeElement
          });
          if (beforeElement.focus) {
            beforeElement.focus();
            beforeElement.dispatchEvent(new MouseEvent('mouseover'));
          }
        } else if (pseudoElement) {
          this.setState({
            pseudoElement: null
          });
          if (pseudoElement.blur) {
            pseudoElement.blur();
            pseudoElement.dispatchEvent(new MouseEvent('mouseout'));
          }
          this.styler.removeStyle(pseudoElement, ':hover');
        }
      } else if (pseudoElement) {
        this.setState({
          pseudoElement: null
        });
        this.styler.removeStyle(pseudoElement, ':hover');
        pseudoElement.dispatchEvent(new MouseEvent('mouseout'));
      }
    }
  }

  componentWillUnmount() {
    const { pseudoElement } = this.state;

    if (pseudoElement) {
      this.styler.removeStyle(pseudoElement, ':hover');
      pseudoElement.blur();
      pseudoElement.dispatchEvent(new MouseEvent('mouseout'));
    }
  }

  handleClick(event) {
    const { element, Context, triggerMode, elementSelector } = this.props;
    if (triggerMode !== 'onElementClick') return;

    const getLocation = href => {
      const l = document.createElement('a');
      l.href = href;
      return l;
    };

    const user = localStorage.user.has('data') && localStorage.user.get('data');
    const step =
      Context.state &&
      Context.state.flow &&
      Context.state.flow.steps &&
      Context.state.flow.steps[Context.state.currentStep - 1 || 0];
    const nextStep = step && Context.state.flow.steps[step.order + 1];
    const equalDomain =
      (nextStep &&
        `${getLocation(nextStep.targetURL).hostname}${
          getLocation(nextStep.targetURL).port
        }` === `${window.location.hostname}${window.location.port}`) ||
      false;

    Context.dispatch({
      reducer: 'activity',
      type: 'POST_ACTIVITY',
      payload: {
        status: 'finished',
        type: 'step'
      }
    });

    if (
      Context.state &&
      Context.state.flow &&
      Context.state.flow &&
      Context.state.flow.activeCrossDomain &&
      !equalDomain
    ) {
      user.currentStep =
        Context.state &&
        Context.state.currentStep &&
        Context.state.currentStep + 1;
      user.currentFlow = Context.state.flow.shortid;
      user.notReceive = true;

      const updateUser = {
        reducer: 'user',
        type: 'CREATE_OR_UPDATE_USER',
        payload: user
      };

      callDispatch(Context.dispatch, updateUser);
      callDispatch(Context.dispatch, {
        reducer: 'flow',
        type: 'FORCE_CLEAR_FLOW'
      });
    } else {
      Context.dispatch({
        reducer: 'flow',
        type:
          (Context.state.currentStep === Context.state.flow.steps.length &&
            'CLEAR_FLOW') ||
          'LOAD_STEP',
        payload: {
          order:
            Context.state &&
            Context.state.currentStep &&
            Context.state.currentStep + 1
        }
      });
    }

    const elementNode = findElement(elementSelector, element, true);
    if (elementNode)
      Simulate(
        elementNode,
        'click',
        {
          pointerX: event.clientX,
          pointerY: event.clientY
        },
        (step && step.properties && step.properties.isSpa) || false
      );
  }

  handleOver() {
    const { elementSelector, element, Context, triggerMode } = this.props;
    if (triggerMode !== 'onMouseOver') return;

    Context.dispatch({
      reducer: 'activity',
      type: 'POST_ACTIVITY',
      payload: {
        status: 'finished',
        type: 'step'
      }
    });

    Context.dispatch({
      reducer: 'flow',
      type:
        (Context.state.currentStep === Context.state.flow.steps.length &&
          'CLEAR_FLOW') ||
        'LOAD_STEP',
      payload: {
        order:
          Context.state &&
          Context.state.currentStep &&
          Context.state.currentStep + 1
      }
    });

    const simulateOver = elem => {
      const mouseover = new MouseEvent('onmouseover', {
        view: window,
        bubbles: true
      });
      const mouseenter = new MouseEvent('onmouseenter', {
        view: window,
        bubbles: true
      });

      if (typeof elem.onmouseover === 'function') {
        elem.onmouseover();
      } else if (typeof elem.onmouseenter === 'function') {
        elem.onmouseenter();
      } else {
        elem.dispatchEvent(mouseover);
        elem.dispatchEvent(mouseenter);
      }
    };

    const elementNode = findElement(elementSelector, element, true);
    if (elementNode) simulateOver(elementNode);
  }

  render() {
    const { show, useFade, triggerMode } = this.props;

    if (!show) return null;

    const { stepType, elementSelector, element } = this.props;
    let selector;
    let style = {
      padding: 0
    };
    const blockStyle = {
      top: {},
      left: {},
      bottom: {},
      right: {}
    };

    if (stepType === 'popover' && (elementSelector || element)) {
      selector = findElement(elementSelector, element, true);
    }

    const position = selector ? getOffsetRect(selector) : {};
    const positionOverlay = selector ? selector.getBoundingClientRect() : {};

    if (selector) {
      style = {
        top: position.top,
        left: position.left,
        padding: `${position.height / 2}px ${position.width / 2}px`
      };

      const computedStyle = window.getComputedStyle(selector);
      if (computedStyle && computedStyle.borderRadius) {
        style.borderRadius = computedStyle.borderRadius;
      }

      // top element position and size
      blockStyle.top.left = 0;
      blockStyle.top.top = 0;
      blockStyle.top.width = window.innerWidth;
      blockStyle.top.height = positionOverlay.top > 0 ? positionOverlay.top : 0;

      // left element position and size
      blockStyle.left.left = 0;
      blockStyle.left.top = positionOverlay.top;
      blockStyle.left.width =
        positionOverlay.left > 0 ? positionOverlay.left : 0;
      blockStyle.left.height = positionOverlay.height;

      // bottom element position and size
      blockStyle.bottom.left = 0;
      blockStyle.bottom.top = positionOverlay.top + positionOverlay.height;
      blockStyle.bottom.width = window.innerWidth;
      blockStyle.bottom.height =
        window.innerHeight - positionOverlay.top - positionOverlay.height > 0
          ? window.innerHeight - positionOverlay.top - positionOverlay.height
          : 0;

      // right element position and size
      blockStyle.right.left = positionOverlay.right;
      blockStyle.right.top = positionOverlay.top;
      blockStyle.right.width =
        window.innerWidth - positionOverlay.right > 0
          ? window.innerWidth - positionOverlay.right
          : 0;
      blockStyle.right.height = positionOverlay.height;
    }

    return (
      <OverlayStyle
        style={style}
        className={`conpass-overlay ${useFade ? 'use-fade' : ''}`}
        {...this.props}
      >
        <div className="conpass-overlay-block no-events">
          <div className="conpass-block-top" style={blockStyle.top} />
          <div className="conpass-block-left" style={blockStyle.left} />
          <div className="conpass-block-bottom" style={blockStyle.bottom} />
          <div className="conpass-block-right" style={blockStyle.right} />
        </div>
        {triggerMode === 'onElementClick' && (
          <button
            type="button"
            // eslint-disable-next-line
            tabIndex="99"
            onClick={this.handleClick}
            className="element-click"
            style={{ padding: style.padding }}
          />
        )}
        {triggerMode === 'onMouseOver' && (
          <div
            onMouseOver={this.handleOver}
            // eslint-disable-next-line
            tabIndex="99"
            onFocus={this.handleOver}
            className="element-hover"
            style={{ padding: style.padding }}
          />
        )}
      </OverlayStyle>
    );
  }
}

Overlay.defaultProps = {
  stepType: '',
  elementSelector: '',
  element: {},
  triggerMode: '',
  noEvents: false,
  useFade: true,
  show: true,
  beforeStep: {},
  step: {},
  updateStep: () => {},
  Context: {
    state: undefined,
    dispatch: () => {}
  }
};

Overlay.propTypes = {
  stepType: PropTypes.string,
  elementSelector: PropTypes.string,
  element: PropTypes.shape({}),
  triggerMode: PropTypes.string,
  noEvents: PropTypes.bool,
  useFade: PropTypes.bool,
  show: PropTypes.bool,
  beforeStep: PropTypes.shape({
    elementSelector: PropTypes.string,
    element: PropTypes.shape({}),
    triggerMode: PropTypes.string
  }),
  step: PropTypes.shape({}),
  updateStep: PropTypes.func,
  Context: ContextModel.Context
};

export default Overlay;
