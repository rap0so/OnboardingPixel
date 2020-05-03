import React, { Component } from 'react';
import { ContextModel } from './io/models';
import { localStorage } from './api';
import { resetUser, uninstall, startFlow } from './modules';

import { Step, Assistant, CustomerFeedback, Nps } from './view';

class App extends Component {
  constructor(props) {
    super(props);
    if (window.cpt) localStorage.conpass.set('token', window.cpt);
    if (window.cppt) localStorage.conpass.set('publicToken', window.cppt);

    startFlow.setDispatch(props.Context.dispatch);
    resetUser.setDispatch(props.Context.dispatch);
    uninstall.setDispatch(props.Context.dispatch);
  }

  shouldComponentUpdate(nextProps) {
    const { props } = this;
    startFlow.setState(props.Context.state);

    return (
      props.Context.state &&
      nextProps.Context.state &&
      (JSON.stringify(props.Context.state.nps) !==
        JSON.stringify(nextProps.Context.state.nps) ||
        JSON.stringify(props.Context.state.flow) !==
          JSON.stringify(nextProps.Context.state.flow) ||
        JSON.stringify(props.Context.state.assistant) !==
          JSON.stringify(nextProps.Context.state.assistant) ||
        JSON.stringify(props.Context.state.currentStep) !==
          JSON.stringify(nextProps.Context.state.currentStep) ||
        JSON.stringify(props.Context.state.customerFeedback) !==
          JSON.stringify(nextProps.Context.state.customerFeedback) ||
        JSON.stringify(props.Context.state.voteId) !==
          JSON.stringify(nextProps.Context.state.voteId))
    );
  }

  render() {
    const { Context } = this.props;

    if (Context.state && Context.state.nps) return <Nps {...this.props} />;

    if (Context.state && Context.state.customerFeedback)
      return <CustomerFeedback {...this.props} />;

    if (Context.state && Context.state.assistant)
      return <Assistant {...this.props} />;

    if (
      Context.state &&
      Context.state.flow &&
      !Context.state.isLoadingListNps &&
      !Context.state.isLoadingNps
    )
      return <Step {...this.props} />;

    return null;
  }
}

App.defaultProps = {
  Context: {
    state: {
      currentStep: 1,
      flow: undefined,
      assistant: undefined,
      customerFeedback: undefined
    },
    dispatch: () => {}
  }
};

App.propTypes = ContextModel;
export default App;
