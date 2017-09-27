import 'babel-polyfill';
import {
  throwOnConsoleErrorsEverywhere,
  throwOnConsoleWarningsEverywhere,
  clearTimeoutsBetweenTests,
} from './util/testUtils';


var integrationContext = require.context("./integration", false, /Tests?\.js$/);

describe('integration tests', () => {
  throwOnConsoleErrorsEverywhere();
  throwOnConsoleWarningsEverywhere();
  clearTimeoutsBetweenTests();
  integrationContext.keys()
    .filter(
          key => !process.env.mocha_entry ||
        ('./test/integration'+key.slice(1)).indexOf(process.env.mocha_entry) >= 0
    )
    .forEach(integrationContext);
});
