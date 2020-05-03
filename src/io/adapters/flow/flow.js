import { apiMethods, localStorage } from '../../../api';
import { logger } from '../../../modules';
import formatData from './formatData';
import formatAssistant from './formatAssistant';

const containHistory = (user, field, flow) => {
  let found = false;
  for (let i = 0; i < user.history.length; i += 1) {
    if (user.history[i][field] === flow) {
      found = true;
      break;
    }
  }

  return found;
};

const validateFlow = (payload, flow, user) => {
  logger.log(`Verificando o fluxo "${flow.title}".`);

  if (user && containHistory(user, '_id', flow.id)) {
    logger.warn(
      `O fluxo "${flow.title}"`,
      `já foi visto por este usuário (${user.alias}).`
    );
    if (!payload.alwaysShow)
      logger.log(`O fluxo "${flow.title}" não será inicializado.`);
  }

  if (flow && flow.multiflow && flow.multiflow.active)
    logger.log(
      'Fluxo com opção "Prioridade" ativada.',
      `Prioridade: "${flow.multiflow.priority}".`
    );

  if (flow && (!containHistory(user, '_id', flow.id) || payload.alwaysShow)) {
    const formatedFlow = formatData(flow);
    if (formatedFlow) {
      return {
        success: true,
        flow: formatedFlow
      };
    }

    return false;
  }

  const formatedAssistate = formatAssistant(flow);
  if (formatedAssistate && formatedAssistate.showAssistant) {
    return {
      success: true,
      assistant: formatedAssistate
    };
  }

  return false;
};

const ResponseData = payload => {
  const user = localStorage.user.has('data') && localStorage.user.get('data');

  if (payload && payload.data) {
    if (Array.isArray(payload.data)) {
      logger.log('Foi encontrado mais de um fluxo na URL atual.');
      let flowsSegmented = payload.data.filter(
        flow => flow.multiflow && flow.multiflow.active
      );

      if (!flowsSegmented || (flowsSegmented && !flowsSegmented.length)) {
        logger.log('Nenhum dos fluxos está com a opção "Prioridade" ativada.');
      }

      flowsSegmented = flowsSegmented
        .sort(
          (flow, nextFlow) =>
            new Date(nextFlow.updatedAt).getTime() -
            new Date(flow.updatedAt).getTime()
        )
        .sort(
          (flow, nextFlow) =>
            flow.multiflow.priority - nextFlow.multiflow.priority
        )
        .map(flow => validateFlow(payload, flow, user))
        .filter(flow => flow);

      const flowsSegmentedResult =
        flowsSegmented &&
        flowsSegmented.length &&
        (flowsSegmented.filter(flow => flow.flow)[0] || flowsSegmented[0]);

      if (
        flowsSegmentedResult &&
        flowsSegmentedResult.success &&
        flowsSegmentedResult.flow &&
        !containHistory(user, '_id', flowsSegmentedResult.flow.id)
      ) {
        Promise.resolve(flowsSegmentedResult.flow).then(response => {
          user.history.push({
            _id: response.id,
            title: response.title,
            startDate: new Date().toISOString()
          });

          const historyAction = {
            reducer: 'user',
            type: 'CREATE_OR_UPDATE_USER'
          };

          localStorage.user.set('data', user);
          payload.dispatch(historyAction);
        });
      }

      const flowData =
        (localStorage.conpass.has('flow') &&
          localStorage.conpass.get('flow')) ||
        {};

      if (
        payload &&
        flowsSegmentedResult.flow &&
        flowsSegmentedResult.flow.shortid
      ) {
        flowData.currentStep =
          (flowData.type === 'auto' && flowData.currentStep) || 1;

        flowData.urlFlow = window.location.href;
        flowData.hashFlow = flowsSegmentedResult.flow.shortid;
        flowData.type = (payload.extra && payload.extra.type) || 'auto';
        localStorage.conpass.set('flow', flowData);
      }

      if (flowsSegmentedResult && flowsSegmentedResult.flow)
        logger.log(`Inciando o fluxo "${flowsSegmentedResult.flow.title}".`);

      return flowsSegmentedResult;
    }

    const verifiyFlowResult = validateFlow(payload, payload.data, user);

    if (
      verifiyFlowResult &&
      verifiyFlowResult.success &&
      verifiyFlowResult.flow &&
      !containHistory(user, '_id', verifiyFlowResult.flow.id)
    ) {
      Promise.resolve(verifiyFlowResult.flow).then(response => {
        user.history.push({
          _id: response.id,
          title: response.title,
          startDate: new Date().toISOString()
        });

        const historyAction = {
          reducer: 'user',
          type: 'CREATE_OR_UPDATE_USER'
        };

        localStorage.user.set('data', user);
        payload.dispatch(historyAction);
      });
    }

    const flowData =
      (localStorage.conpass.has('flow') && localStorage.conpass.get('flow')) ||
      {};

    if (payload && verifiyFlowResult.flow && verifiyFlowResult.flow.shortid) {
      const flowTypeAllowed =
        flowData.type === 'auto' || flowData.type === 'shortid';
      flowData.currentStep = (flowTypeAllowed && flowData.currentStep) || 1;

      flowData.urlFlow = window.location.href;
      flowData.hashFlow = verifiyFlowResult.flow.shortid;
      flowData.type = (payload.extra && payload.extra.type) || 'auto';
      localStorage.conpass.set('flow', flowData);
    }

    if (verifiyFlowResult && verifiyFlowResult.flow)
      logger.log(`Inciando o fluxo "${verifiyFlowResult.flow.title}".`);

    return verifiyFlowResult;
  }

  if (!payload.data && payload.flow) {
    return {
      success: true,
      isPreviewMode: true,
      flow: formatData(payload.flow)
    };
  }

  logger.log('Nenhum fluxo foi encontrado.');
  return null;
};

const RequestListFlows = (action, dispatch, payload) =>
  apiMethods.getFlows(payload, action, dispatch);

export default { ResponseData, RequestListFlows };
