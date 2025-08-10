// cypress/support/config-loader.js
// Utility to load and parse the login configuration YAML
import { load } from 'js-yaml';
class ConfigLoader {
  constructor() {
    this.config = null;
  }

  loadConfig() {
    // Use Cypress task to read file from Node.js environment
    return cy.task('readLoginConfig').then((configData) => {
      this.config = load(configData);
      return this.config;
    });
  }

  // Synchronous version that requires config to be pre-loaded
  getConfigSync() {
    if (!this.config) {
      throw new Error(
        'Configuration not loaded. Call loadConfig() first in your test.',
      );
    }
    return this.config;
  }

  // Get UI selectors
  getSelectors() {
    return this.getConfigSync().ui.login_page.selectors;
  }

  // Get UI text expectations
  getText() {
    return this.getConfigSync().ui.login_page.text;
  }

  // Get URLs
  getUrls() {
    return this.getConfigSync().ui.login_page.urls;
  }

  // Get API configuration
  getApi() {
    return this.getConfigSync().api.login;
  }

  // Get test data
  getTestData() {
    return this.getConfigSync().test_data;
  }

  // Get valid test user
  getValidUser(index = 0) {
    return this.getConfigSync().test_data.valid_users[index];
  }

  // Get invalid test user
  getInvalidUser(index = 0) {
    return this.getConfigSync().test_data.invalid_users[index];
  }

  // Get performance thresholds
  getPerformanceThresholds() {
    return this.getConfigSync().performance.load_test.thresholds;
  }
}

module.exports = new ConfigLoader();
