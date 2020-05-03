import localStorage from './localStorage';
import { logger } from '../modules';

// const defApiUrl = 'https://api2.conpass.io/v2/pixel/';
// const analyticsUrl = 'https://analytics.conpass.io/v2/';

const defApiUrl = process.env.REACT_API_ENDPOINT;
const analyticsUrl = process.env.REACT_API_ANALYTICS_ENDPOINT;

const api = {
  fetch: options => (url, action = {}, dispatch = () => {}, body) => {
    const token = localStorage.conpass.get('token') || window.cpt;
    const defOptions = {
      headers: {
        'x-access-token': token,
        'content-type': 'application/json'
      }
    };

    if (body) defOptions.body = (body && JSON.stringify(body)) || '{}';

    fetch(`${defApiUrl}${url}`, { ...options, ...defOptions })
      .then(result => {
        result.json().then(response => {
          dispatch({
            ...action,
            payload: { ...response, dispatch },
            extra: (action && action.extra) || {}
          });
        });
      })
      .catch(err => {
        logger.error(
          'Houve uma instabilidade ao receber a resposta da Api, tente novamente...',
          `(${(err && err.message) || ''})`
        );
      });
  }
};

const analytics = {
  api: {
    fetch: options => (url, body, action = {}, dispatch = () => {}) => {
      const defOptions = {
        headers: {
          'x-access-token': localStorage.conpass.get('token') || window.cpt,
          'content-type': 'application/json'
        },
        body: JSON.stringify(body)
      };
      fetch(analyticsUrl + url, { ...options, ...defOptions }).then(result => {
        result.json().then(response => {
          dispatch({ ...action, payload: response, extra: action.extra || {} });
        });
      });
    }
  }
};

const rdStation = {
  api: {
    fetch: options => (url, body, callback) => {
      const formData = new FormData();
      formData.append('email', body.email);
      formData.append('identificador', body.identificador);
      formData.append('token_rdstation', body.token_rdstation);

      const defOptions = {
        headers: {
          // 'x-access-token': localStorage.conpass.get('token') || window.cpt,
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData)
      };
      fetch(url, { ...options, ...defOptions }).then(result => {
        callback(result);
      });
    }
  }
};

export default {
  get: api.fetch({ method: 'GET' }),
  put: api.fetch({ method: 'PUT' }),
  post: api.fetch({ method: 'POST' }),
  delete: api.fetch({ method: 'DELETE' }),
  analytics: {
    post: analytics.api.fetch({ method: 'POST' })
  },
  rdStation: {
    post: rdStation.api.fetch({ method: 'POST' })
  }
};
