// scripts/sync-html-to-config-simple.js
// Lightweight HTML-to-YAML syncer using built-in Node.js modules only

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { load, dump } from 'js-yaml';

class SimpleHTMLConfigSyncer {
  constructor() {
    this.htmlPath = join(__dirname, '..', 'public', 'login.html');
    this.configPath = join(__dirname, '..', 'config', 'login-config.yaml');
    this.backupPath = join(
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
      const htmlContent = readFileSync(this.htmlPath, 'utf8');

      // Extract selectors using regex patterns
      const detectedSelectors = this.extractSelectorsWithRegex(htmlContent);

      // Read current YAML config
      const configContent = readFileSync(this.configPath, 'utf8');
      const config = load(configContent);

      // Backup current config
      writeFileSync(this.backupPath, configContent);
      console.log(`📋 Backed up current config to: ${this.backupPath}`);

      // Update selectors in config
      const changes = this.updateSelectors(config, detectedSelectors);

      if (changes.length > 0) {
        // Write updated config
        const updatedYaml = dump(config, {
          lineWidth: -1,
          noRefs: true,
          quotingType: "'",
        });

        writeFileSync(this.configPath, updatedYaml);

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

  extractSelectorsWithRegex(htmlContent) {
    const selectors = {};

    // Username input - look for input with name="username" or id="username"
    const usernameMatch = htmlContent.match(
      /<input[^>]*(?:name=["']username["']|id=["']([^"']+)["'])[^>]*>/i,
    );
    if (usernameMatch) {
      const idMatch = htmlContent.match(
        /<input[^>]*id=["']([^"']+)["'][^>]*(?:name=["']username["']|type=["']text["'])/i,
      );
      if (idMatch) {
        selectors.username_input = `#${idMatch[1]}`;
      } else {
        selectors.username_input = 'input[name="username"]';
      }
    }

    // Password input
    const passwordMatch = htmlContent.match(
      /<input[^>]*(?:name=["']password["']|id=["']([^"']+)["'])[^>]*type=["']password["']/i,
    );
    if (passwordMatch) {
      const idMatch = htmlContent.match(
        /<input[^>]*id=["']([^"']+)["'][^>]*type=["']password["']/i,
      );
      if (idMatch) {
        selectors.password_input = `#${idMatch[1]}`;
      } else {
        selectors.password_input = 'input[type="password"]';
      }
    }

    // Submit button
    const submitMatch = htmlContent.match(
      /<button[^>]*type=["']submit["'][^>]*>|<input[^>]*type=["']submit["'][^>]*>/i,
    );
    if (submitMatch) {
      selectors.submit_button = 'button[type="submit"]';
    } else {
      // Fallback for any button in form
      const buttonMatch = htmlContent.match(/<button[^>]*>/i);
      if (buttonMatch) {
        selectors.submit_button = 'button';
      }
    }

    // Welcome message
    const welcomeMatch = htmlContent.match(/<[^>]*id=["']welcome["'][^>]*>/i);
    if (welcomeMatch) {
      selectors.welcome_message = '#welcome';
    }

    // Error message
    const errorMatch = htmlContent.match(
      /<[^>]*class=["'][^"']*error-message[^"']*["'][^>]*>/i,
    );
    if (errorMatch) {
      selectors.error_message = '.error-message';
    }

    // Page title (h1)
    const titleMatch = htmlContent.match(/<h1[^>]*>/i);
    if (titleMatch) {
      selectors.page_title = 'h1';
    }

    console.log('🔍 Detected selectors from HTML:');
    Object.entries(selectors).forEach(([key, value]) => {
      console.log(`   • ${key}: ${value}`);
    });

    return selectors;
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
    const reportsDir = join(__dirname, '..', 'reports');
    if (!existsSync(reportsDir)) {
      mkdirSync(reportsDir, { recursive: true });
    }

    const reportPath = join(reportsDir, 'config-changes.md');

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

    writeFileSync(reportPath, report);
    console.log(`📊 Change report generated: ${reportPath}`);
  }
}

// Run if called directly
if (require.main === module) {
  const syncer = new SimpleHTMLConfigSyncer();
  syncer.syncConfig();
}

export default { SimpleHTMLConfigSyncer };
