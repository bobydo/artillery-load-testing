// scripts/sync-html-to-config.js
// Script to automatically detect HTML changes and update YAML configuration

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const { JSDOM } = require('jsdom');

class HTMLConfigSyncer {
  constructor() {
    this.htmlPath = path.join(__dirname, '..', 'public', 'login.html');
    this.configPath = path.join(__dirname, '..', 'config', 'login-config.yaml');
    this.backupPath = path.join(
      __dirname,
      '..',
      'config',
      'login-config.yaml.backup',
    );
  }

  async syncConfig() {
    try {
      console.log('🔄 Analyzing HTML file for selector changes...');

      // Read HTML file
      const htmlContent = fs.readFileSync(this.htmlPath, 'utf8');
      const dom = new JSDOM(htmlContent);
      const document = dom.window.document;

      // Extract selectors from HTML
      const detectedSelectors = this.extractSelectors(document);

      // Read current YAML config
      const configContent = fs.readFileSync(this.configPath, 'utf8');
      const config = yaml.load(configContent);

      // Backup current config
      fs.writeFileSync(this.backupPath, configContent);
      console.log(`📋 Backed up current config to: ${this.backupPath}`);

      // Update selectors in config
      const changes = this.updateSelectors(config, detectedSelectors);

      if (changes.length > 0) {
        // Write updated config
        const updatedYaml = yaml.dump(config, {
          lineWidth: -1,
          noRefs: true,
          quotingType: "'",
        });

        fs.writeFileSync(this.configPath, updatedYaml);

        console.log('✅ Configuration updated successfully!');
        console.log('📝 Changes made:');
        changes.forEach((change) => {
          console.log(
            `   • ${change.selector}: ${change.oldValue} → ${change.newValue}`,
          );
        });

        // Generate change report
        this.generateChangeReport(changes);
      } else {
        console.log('✅ No changes detected - configuration is up to date!');
      }
    } catch (error) {
      console.error('❌ Error syncing configuration:', error.message);
      process.exit(1);
    }
  }

  extractSelectors(document) {
    const selectors = {};

    // Username input
    const usernameInput = document.querySelector(
      'input[name="username"], input[id="username"], input[type="text"]',
    );
    if (usernameInput) {
      selectors.username_input = this.generateSelector(usernameInput);
    }

    // Password input
    const passwordInput = document.querySelector(
      'input[name="password"], input[id="password"], input[type="password"]',
    );
    if (passwordInput) {
      selectors.password_input = this.generateSelector(passwordInput);
    }

    // Submit button
    const submitButton = document.querySelector(
      'button[type="submit"], input[type="submit"]',
    );
    if (submitButton) {
      selectors.submit_button = this.generateSelector(submitButton);
    }

    // Welcome message
    const welcomeDiv = document.querySelector(
      '#welcome, .welcome, [data-testid="welcome"]',
    );
    if (welcomeDiv) {
      selectors.welcome_message = this.generateSelector(welcomeDiv);
    }

    // Error message
    const errorDiv = document.querySelector(
      '.error-message, .error, [data-testid="error"]',
    );
    if (errorDiv) {
      selectors.error_message = this.generateSelector(errorDiv);
    }

    // Page title
    const title = document.querySelector('h1, .title, [data-testid="title"]');
    if (title) {
      selectors.page_title = this.generateSelector(title);
    }

    console.log('🔍 Detected selectors from HTML:');
    Object.entries(selectors).forEach(([key, value]) => {
      console.log(`   • ${key}: ${value}`);
    });

    return selectors;
  }

  generateSelector(element) {
    // Prefer ID selector
    if (element.id) {
      return `#${element.id}`;
    }

    // Then class selector
    if (element.className && element.className.trim()) {
      const classes = element.className.trim().split(/\s+/);
      return `.${classes[0]}`;
    }

    // Then data-testid
    if (element.dataset && element.dataset.testid) {
      return `[data-testid="${element.dataset.testid}"]`;
    }

    // Then name attribute
    if (element.name) {
      return `[name="${element.name}"]`;
    }

    // Finally, tag + type
    if (element.type) {
      return `${element.tagName.toLowerCase()}[type="${element.type}"]`;
    }

    return element.tagName.toLowerCase();
  }

  updateSelectors(config, detectedSelectors) {
    const changes = [];
    const currentSelectors = config.ui.login_page.selectors;

    Object.entries(detectedSelectors).forEach(([key, newValue]) => {
      if (currentSelectors[key] && currentSelectors[key] !== newValue) {
        changes.push({
          selector: key,
          oldValue: currentSelectors[key],
          newValue: newValue,
        });
        currentSelectors[key] = newValue;
      } else if (!currentSelectors[key]) {
        changes.push({
          selector: key,
          oldValue: 'undefined',
          newValue: newValue,
        });
        currentSelectors[key] = newValue;
      }
    });

    return changes;
  }

  generateChangeReport(changes) {
    const reportPath = path.join(
      __dirname,
      '..',
      'reports',
      'config-changes.md',
    );
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

    let report = `# Configuration Changes Report\n\n`;
    report += `**Generated:** ${new Date().toLocaleString()}\n`;
    report += `**Source:** ${this.htmlPath}\n`;
    report += `**Target:** ${this.configPath}\n\n`;

    report += `## Changes Made\n\n`;
    changes.forEach((change) => {
      report += `### ${change.selector}\n`;
      report += `- **Before:** \`${change.oldValue}\`\n`;
      report += `- **After:** \`${change.newValue}\`\n\n`;
    });

    report += `## Impact\n\n`;
    report += `- ✅ Cypress tests will use updated selectors\n`;
    report += `- ✅ Artillery tests remain unaffected\n`;
    report += `- ⚠️  Review changes before committing to ensure accuracy\n\n`;

    // Ensure reports directory exists
    const reportsDir = path.dirname(reportPath);
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }

    fs.writeFileSync(reportPath, report);
    console.log(`📊 Change report generated: ${reportPath}`);
  }
}

// Run if called directly
if (require.main === module) {
  const syncer = new HTMLConfigSyncer();
  syncer.syncConfig();
}

module.exports = { HTMLConfigSyncer };
