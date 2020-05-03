import Conditions from './conditions';
import { logger } from '../index';

const validate = (user, audiences, logicalOperator, item, isNps) => {
  let matchAudience = audiences || [];
  const customFields = user.custom_fields;
  if (!audiences || !audiences.length) {
    logger.log(
      `${isNps ? 'A pesquisa' : 'O fluxo'} "${
        item.title
      }" não possui segmentação.`
    );
    logger.space();
    return true;
  }

  if (audiences.length && !customFields) return false;

  logger.log(
    `${isNps ? 'A pesquisa' : 'O fluxo'} "${item.title}" possui segmentação.`
  );
  logger.space();

  matchAudience = matchAudience.filter(audience => {
    const result = Object.keys(customFields).filter(key => {
      if (
        (customFields[key] && !customFields[key].toString()) ||
        !audience.customFieldId ||
        key !== audience.customFieldId.name
      )
        return false;

      const { value } = audience;
      const { type } = audience.customFieldId;
      logger.log(
        `Verificando o segmento "${
          audience.customFieldId.name
        }". (${JSON.stringify(customFields[key])})`
      );

      const resultConditions = Conditions[audience.logicalOperator](
        customFields[key],
        value,
        type
      );

      logger.log(
        `Usuário ${
          !resultConditions ? 'não ' : ''
        }é compatível com o segmento "${audience.customFieldId.name}".`
      );
      logger.space();

      return resultConditions;
    });

    return result && result.length;
  });

  return (
    (logicalOperator === 'AND' && matchAudience.length === audiences.length) ||
    (logicalOperator === 'OR' && matchAudience.length)
  );
};

export default { validate };
