import Regex from 'conpass-regex';
import Audience from './audience/audience';
import { logger } from './index';

const validateUrl = (listFlow, url, isNps) => {
  logger.log(`Verificando ${isNps ? 'pesquisas' : 'fluxos'} em "${url}"`);

  const newListFlow = !isNps
    ? listFlow.filter(flow => flow.triggerMode !== 'commandLine')
    : listFlow;

  if (url && newListFlow.length)
    return newListFlow.filter(flow =>
      new Regex(
        (flow.url && flow.url.replace(/http(|s):\/\//g, '')) || ''
      ).test(url)
    );

  return newListFlow;
};

const validate = (listFlow, user, field, value, secondField, isNps) => {
  let newListFlow = listFlow;

  if (field && secondField && value) {
    newListFlow = newListFlow.filter(
      flow => flow[field] === value || flow[secondField] === value
    );
  } else if ((field || secondField) && value) {
    newListFlow = newListFlow.filter(
      flow => flow[field || secondField] === value
    );
  }

  if (newListFlow && newListFlow.length && user) {
    if (!isNps) {
      logger.log('Fluxo encontrado com sucesso.');
      logger.space();
    }

    newListFlow = newListFlow.filter(flow =>
      Audience.validate(
        user,
        flow.audience,
        flow.logicalOperator || 'AND',
        flow,
        isNps
      )
    );

    return (
      (newListFlow.length > 1 && newListFlow) ||
      (newListFlow.length && newListFlow[0]) ||
      null
    );
  }

  if (!isNps) {
    logger.log('Nenhum fluxo encontrado.');
    logger.space();
  }

  return null;
};

export default { validateUrl, validate };
