import React from 'react';
import ReactDOM from 'react-dom';
import { I18n } from 'react-i18nify';
import { StoreProvider, StoreConsumer } from './stores';
import App from './App';
import { init, isAccessMobile, customEvent } from './modules';
import Languages from './locales';

I18n.setTranslations(Languages);

const startPixel = () => {
  if (!isAccessMobile()) {
    /**
     * <conpass> will be the App anchor
     */
    I18n.setLocale((navigator.language.includes('pt') && 'pt-br') || 'en-us');
    const conpassTag = init.createConpassTag('conpass-tag');
    init.injectConpassTag(conpassTag, document.body);
    ReactDOM.render(
      <StoreProvider conpassMeta={window.conpassMeta}>
        <StoreConsumer>
          <App />
        </StoreConsumer>
      </StoreProvider>,
      document.getElementById('conpass-tag')
    );
  }
};

const conpassEvent = () => {
  customEvent('onconpassload');
};

/**
 * Conpass API is initted when the
 * bundle is loaded
 */
window.Conpass = init.externalAPI(startPixel);

let conpassInitIntervalCount = 0;
const conpassInitInterval = window.setInterval(() => {
  if (window.conpassMeta || conpassInitIntervalCount >= 1000) {
    window.clearInterval(conpassInitInterval);
    init.createObserver(document.body, startPixel);
    startPixel();
  }
  conpassInitIntervalCount += 1;
}, 250);

conpassEvent();
