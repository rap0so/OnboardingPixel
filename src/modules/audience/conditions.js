import Validator from 'validator';
import Moment from 'moment';
import { logger } from '../index';

const formatData = stringDate => {
  let newStrigDate = stringDate;

  if (!(typeof newStrigDate === 'string')) {
    newStrigDate = newStrigDate.toString();
  }

  let date = Moment.invalid();
  try {
    if (stringDate.includes('/') && !date.isValid()) {
      if (stringDate.split('/')[0].length <= 2) {
        date = Moment(stringDate, 'DD/MM/YYYY');
      }
    }

    if (stringDate.includes('-') && !date.isValid()) {
      if (stringDate.split('-')[0].length <= 2) {
        date = Moment(stringDate, 'DD-MM-YYYY');
      }
    }

    if (!date.isValid()) {
      date = Moment(stringDate);
    }
  } catch {
    logger.error('Problema ao formatar a data, verificar o valor informado.');
  }

  return date;
};

const atLeastOneElement = (valuesInAudience, valuesInUser) => {
  if (valuesInAudience.length <= 0 || valuesInUser.length <= 0) return false;
  for (
    let indexInAudience = 0;
    indexInAudience < valuesInAudience.length;
    indexInAudience += 1
  ) {
    const inAudience = valuesInAudience[indexInAudience];
    for (
      let indexInUser = 0;
      indexInUser < valuesInUser.length;
      indexInUser += 1
    ) {
      const inUser = valuesInUser[indexInUser];
      if (inAudience === inUser) return true;
    }
  }
  return false;
};

export default {
  equal: (userAudienceValue, fieldAudienceValue, type) => {
    switch (type) {
      case 'Text':
        return userAudienceValue === fieldAudienceValue.toString();
      case 'Number':
        return userAudienceValue === Number(fieldAudienceValue.toString());
      case 'Boolean': {
        const a = Validator.isBoolean(userAudienceValue.toString())
          ? JSON.parse(userAudienceValue.toString())
          : false;
        const b = Validator.isBoolean(fieldAudienceValue.toString())
          ? JSON.parse(fieldAudienceValue.toString())
          : false;

        return a === b;
      }
      case 'Date': {
        const dateInUser = formatData(userAudienceValue);
        const dateInFlow = formatData(fieldAudienceValue.toString());

        return dateInUser.isSame(dateInFlow);
      }
      default:
        return false;
    }
  },
  not_equal: (userAudienceValue, fieldAudienceValue, type) => {
    switch (type) {
      case 'Text':
        return userAudienceValue !== fieldAudienceValue.toString();
      case 'Number':
        return userAudienceValue !== Number(fieldAudienceValue.toString());
      case 'Boolean': {
        const a = Validator.isBoolean(userAudienceValue.toString())
          ? JSON.parse(userAudienceValue.toString())
          : false;
        const b = Validator.isBoolean(fieldAudienceValue.toString())
          ? JSON.parse(fieldAudienceValue.toString())
          : false;

        return a !== b;
      }
      case 'Date': {
        const dateInUser = formatData(userAudienceValue);
        const dateInFlow = formatData(fieldAudienceValue.toString());

        return !dateInUser.isSame(dateInFlow);
      }
      default:
        return false;
    }
  },
  greater_than: (userAudienceValue, fieldAudienceValue, type) => {
    switch (type) {
      case 'Number':
        return userAudienceValue > Number(fieldAudienceValue.toString());
      case 'Date': {
        const dateInUser = formatData(userAudienceValue);
        const dateInFlow = formatData(fieldAudienceValue.toString());

        return dateInUser.isAfter(dateInFlow);
      }
      default:
        return false;
    }
  },
  greater_than_or_equal: (userAudienceValue, fieldAudienceValue, type) => {
    switch (type) {
      case 'Number':
        return userAudienceValue >= Number(fieldAudienceValue.toString());
      case 'Date': {
        const dateInUser = formatData(userAudienceValue);
        const dateInFlow = formatData(fieldAudienceValue.toString());

        return dateInUser.isSameOrAfter(dateInFlow);
      }
      default:
        return false;
    }
  },
  less_than: (userAudienceValue, fieldAudienceValue, type) => {
    switch (type) {
      case 'Number':
        return userAudienceValue < Number(fieldAudienceValue.toString());
      case 'Date': {
        const dateInUser = formatData(userAudienceValue);
        const dateInFlow = formatData(fieldAudienceValue.toString());

        return dateInUser.isBefore(dateInFlow);
      }
      default:
        return false;
    }
  },
  less_than_or_equal: (userAudienceValue, fieldAudienceValue, type) => {
    switch (type) {
      case 'Number':
        return userAudienceValue <= Number(fieldAudienceValue.toString());
      case 'Date': {
        const dateInUser = formatData(userAudienceValue);
        const dateInFlow = formatData(fieldAudienceValue.toString());

        return dateInUser.isSameOrBefore(dateInFlow);
      }
      default:
        return false;
    }
  },
  all: (userAudienceValue, fieldAudienceValue, type) => {
    switch (type) {
      case 'Array': {
        if (Array.isArray(userAudienceValue)) {
          const valuesInAudience = fieldAudienceValue
            .split(',')
            .map(value => value.toString().trim());
          return userAudienceValue.all(valuesInAudience);
        }

        if (typeof userAudienceValue === 'string') {
          const valuesInAudience = fieldAudienceValue
            .split(',')
            .map(value => value.toString().trim());
          const valueInUser = userAudienceValue
            .split(',')
            .map(value => value.toString().trim());
          return valueInUser.all(valuesInAudience);
        }

        return false;
      }

      default:
        return false;
    }
  },
  includes: (userAudienceValue, fieldAudienceValue, type) => {
    switch (type) {
      case 'Text': {
        return userAudienceValue
          ? userAudienceValue.toString().includes(fieldAudienceValue)
          : false;
      }

      case 'Array': {
        if (Array.isArray(userAudienceValue)) {
          return userAudienceValue.includes(fieldAudienceValue);
        }
        if (typeof valueInUser === 'string') {
          const valueInUser = userAudienceValue
            .split(',')
            .map(value => value.toString().trim());
          return valueInUser.includes(fieldAudienceValue);
        }

        return false;
      }

      default:
        return false;
    }
  },
  at_least_one_element: (userAudienceValue, fieldAudienceValue, type) => {
    switch (type) {
      case 'Array': {
        if (Array.isArray(userAudienceValue)) {
          const valuesInAudience = fieldAudienceValue
            .split(',')
            .map(value => value.toString().trim());
          return atLeastOneElement(valuesInAudience, userAudienceValue);
        }

        if (typeof userAudienceValue === 'string') {
          const valueInUser = userAudienceValue
            .split(',')
            .map(value => value.toString().trim());
          const valuesInAudience = fieldAudienceValue
            .split(',')
            .map(value => value.toString().trim());
          return atLeastOneElement(valuesInAudience, valueInUser);
        }

        return false;
      }

      default:
        return false;
    }
  },
  not_contains_any_element: (userAudienceValue, fieldAudienceValue, type) => {
    switch (type) {
      case 'Array': {
        if (Array.isArray(userAudienceValue)) {
          const valuesInAudience = fieldAudienceValue
            .split(',')
            .map(value => value.toString().trim());
          return !atLeastOneElement(valuesInAudience, userAudienceValue);
        }

        if (typeof userAudienceValue === 'string') {
          const valueInUser = userAudienceValue
            .split(',')
            .map(value => value.toString().trim());
          const valuesInAudience = fieldAudienceValue
            .split(',')
            .map(value => value.toString().trim());
          return !atLeastOneElement(valuesInAudience, valueInUser);
        }

        return false;
      }

      default:
        return false;
    }
  },
  contains_only_one: (userAudienceValue, fieldAudienceValue, type) => {
    switch (type) {
      case 'Array': {
        if (
          Array.isArray(userAudienceValue) ||
          typeof userAudienceValue === 'string'
        ) {
          let valueInUser = userAudienceValue;
          if (typeof userAudienceValue === 'string') {
            valueInUser = userAudienceValue
              .split(',')
              .map(value => value.toString().trim());
          }

          const results = [];
          const valuesInAudience = fieldAudienceValue
            .split(',')
            .map(value => value.toString().trim());

          for (let index = 0; index < valueInUser.length; index += 1) {
            const inUser = valueInUser[index];
            const isContained = valuesInAudience.includes(inUser.toString());
            if (isContained) {
              results.push(isContained);
              break;
            }
          }

          return results.length >= 1;
        }

        return false;
      }

      default:
        return false;
    }
  },
  not_includes: (userAudienceValue, fieldAudienceValue, type) => {
    switch (type) {
      case 'Text': {
        return userAudienceValue
          ? userAudienceValue.toString().includes(fieldAudienceValue)
          : false;
      }

      case 'Array': {
        if (Array.isArray(userAudienceValue)) {
          return !userAudienceValue.includes(fieldAudienceValue);
        }
        if (typeof valueInUser === 'string') {
          const valueInUser = userAudienceValue
            .split(',')
            .map(value => value.toString().trim());
          return !valueInUser.includes(fieldAudienceValue);
        }

        return false;
      }

      default:
        return false;
    }
  }
};
