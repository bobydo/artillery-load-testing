const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false,
    specPattern: 'cypress/e2e/**/*.cy.js',
    setupNodeEvents(on, config) {
      // Task to read login config file from Node.js environment
      on('task', {
        readLoginConfig() {
          try {
            const configPath = path.join(__dirname, 'config', 'login-config.yaml');
            return fs.readFileSync(configPath, 'utf8');
          } catch (error) {
            throw new Error(`Failed to read login configuration: ${error.message}`);
          }
        }
      });

      return config;
    },
  },
});
