import { logger } from './index';

const startFlow = {
  state: null,
  dispatch: null,
  callStack: {
    count: 0,
    actions: [],
    setAction(action, self) {
      self.callStack.actions.push(action);
      self.callStack.run(self);
    },
    run(self) {
      if (self.callStack.actions.length) {
        if (
          (!self.dispatch ||
            !self.state ||
            (self.state && !self.state.listFlows)) &&
          self.callStack.count <= 100
        ) {
          // eslint-disable-next-line
          self.callStack.count += 1;
          window.setTimeout(() => self.callStack.run(self), 1000);
          logger.warn(
            `Lista de fluxos não encontrada, tentativa ${self.callStack.count +
              1}...`
          );
          return;
        }

        if (self.callStack.count > 100) {
          logger.warn('Lista de fluxos não encontrada, tentativas esgotadas.');
          return;
        }

        // eslint-disable-next-line
        self.callStack.count = 0;
        self.callStack.actions.forEach(action => self.dispatch(action));
      }
    }
  },
  setState(state) {
    this.state = state;
  },
  setDispatch(dispatch) {
    this.dispatch = dispatch;
  },
  init(user, options) {
    const newOptions = {
      ...options
    };

    let waitDispatchCount = 0;
    const waitDispatch = window.setInterval(() => {
      if (this.dispatch || waitDispatchCount >= 100) {
        window.clearInterval(waitDispatch);
        if (this.callStack.actions.length) newOptions.callStack = true;

        if (this.dispatch) {
          this.dispatch({
            reducer: 'user',
            type: 'IDENTIFY_USER',
            payload: {
              ...user,
              options: newOptions
            }
          });
        }
      } else if (!this.dispatch && waitDispatchCount >= 100) {
        logger.warn('Aplicação não foi iniciada.');
      }

      waitDispatchCount += 1;
    }, 50);
  },
  startFlow(shortId, options) {
    if (!shortId) return;

    const newOptions = {
      ...options,
      alwaysShow: options && options.show,
      extra: {
        type: 'shortid',
        activity: {
          type: 'startFlowByCommandLine'
        }
      }
    };

    const action = {
      reducer: 'flow',
      type: 'GET_FLOW_TITLE',
      payload: {
        shortId,
        options: newOptions
      }
    };

    if (!this.dispatch) {
      logger.warn('Lista de fluxos não encontrada, tentativa 1...');
      this.callStack.setAction(action, this);
      return;
    }

    this.dispatch(action);
  },
  startFlowAuto() {
    if (!this.dispatch) {
      logger.warn('Aplicação não foi iniciada.');
      return;
    }

    this.dispatch({
      reducer: 'flow',
      type: 'GET_FLOWS',
      payload: {
        options: {
          autoStart: true
        }
      }
    });
  },
  startFlowById(flowId, options) {
    if (!flowId) return;
    if (!this.dispatch) {
      logger.warn('Aplicação não foi iniciada.');
      return;
    }

    const newOptions = {
      ...options,
      alwaysShow: options && options.show,
      extra: {
        type: 'flowid',
        activity: {
          type: 'startFlowById'
        }
      }
    };

    this.dispatch({
      reducer: 'flow',
      type: 'GET_FLOW_ID',
      payload: {
        flowId,
        options: newOptions
      }
    });
  },
  startFlowByJson(token, flowData, options, callback) {
    callback();
    if (!flowData) return;
    if (!this.dispatch) {
      logger.warn('Aplicação não foi iniciada.');
      return;
    }

    const newOptions = {
      ...options,
      alwaysShow: options && options.show,
      extra: {
        type: 'flowjson'
      }
    };

    this.dispatch({
      reducer: 'flow',
      type: 'GET_FLOW_JSON',
      payload: {
        flow: flowData,
        options: newOptions
      }
    });
  }
};

export default startFlow;
