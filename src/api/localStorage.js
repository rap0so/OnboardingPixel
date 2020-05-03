import { logger } from '../modules';

const store = space => ({
  namespace: space || '',
  convert(value, convert = 'json') {
    let newValue;
    try {
      if (convert === 'json') {
        newValue = JSON.parse(value);
      } else {
        const { toJSON } = Array.prototype;
        try {
          if (toJSON) delete Array.prototype.toJSON;
          newValue = JSON.stringify(value);
        } finally {
          // eslint-disable-next-line
          if (toJSON) Array.prototype.toJSON = toJSON;
        }
      }
    } catch (error) {
      logger.warn(
        'Problema ao codificar/decodificar dados do localStorage.',
        error
      );
    }
    return newValue;
  },
  has(key) {
    return (localStorage.getItem(`${this.namespace}.${key}`) && true) || false;
  },
  get(key) {
    const value =
      this.has(key) && localStorage.getItem(`${this.namespace}.${key}`);
    return value && this.convert(value);
  },
  set(key, value) {
    const newValue = this.convert(value, 'string');

    if (newValue) {
      localStorage.setItem(`${this.namespace}.${key}`, newValue);
    }
  },
  remove(key) {
    if (this.has(key)) {
      localStorage.removeItem(`${this.namespace}.${key}`);
    }
  }
});

const conpass = store('conpass');
const user = store('conpass.user');
const flow = store('conpass.flow');

export default { conpass, user, flow };
