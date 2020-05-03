import { version } from '../../package.json';

const conpassColor = 'color: #1680e4';
const debug = {
  messages: [],
  debug: false,
  setMessage(type, args) {
    this.messages.push({ type, args });
    this.showMessages();
  },
  clearMessages() {
    this.messages = [];
  },
  setDebug() {
    this.debug = true;
    this.showMessages();
  },
  showMessages() {
    if (!this.debug) return;
    this.messages.forEach(message => {
      if (message.type === 'log') {
        // eslint-disable-next-line
        console.log('%c Conpass Pixel:', conpassColor, ...message.args);
      }

      if (message.type === 'warn') {
        // eslint-disable-next-line
        console.warn('%c Conpass Pixel:', conpassColor, ...message.args);
      }

      if (message.type === 'error') {
        // eslint-disable-next-line
        console.error('%c Conpass Pixel:', conpassColor, ...message.args);
      }

      if (message.type === 'space') {
        // eslint-disable-next-line
        console.log('%c Conpass Pixel:', conpassColor, '---------------');
      }
    });
    this.clearMessages();
  }
};

debug.setMessage('log', ['Inicializado.']);
debug.setMessage('log', ['Versão', version]);
debug.setMessage('space');

const log = (...args) => debug.setMessage('log', args);
const warn = (...args) => debug.setMessage('warn', args);
const error = (...args) => debug.setMessage('error', args);
const space = () => debug.setMessage('space');

export default {
  log,
  warn,
  error,
  space,
  debug
};
