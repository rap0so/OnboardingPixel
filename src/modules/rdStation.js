import logger from './logger';
import { apiMethods } from '../api';

export default {
  sendDataRdStation(user, flow, step) {
    if (!user || !user.email) {
      logger.warn('Email é obrigatório. [Send data RDStation]');
      return;
    }
    if (!step) {
      logger.warn('Step é obrigatório. [Send data RDStation]');
      return;
    }
    if (!flow) {
      logger.warn('Flow é obrigatório. [Send data RDStation]');
      return;
    }

    if (
      flow.properties &&
      flow.properties.rdStationToken &&
      flow.properties.rdStationToken.length > 1
    ) {
      const tokenRdstation = flow.properties.rdStationToken;
      const { email } = user;
      const identificador = `CONPASS Onboarding. Fluxo: ${
        flow.title
      } - Passo: ${step.title ||
        step.properties.introTxtModal ||
        'sem título'}`;

      apiMethods.sendDataRdStation(tokenRdstation, email, identificador);
    }
  }
};
