/* eslint-disable */

/**
 * ESlint is disabled here because it
 * does not add enzyme dependencies
 * as dev dependencies
 */

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

/* eslint-enable */
