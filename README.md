<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
From https://www.youtube.com/watch?v=OTm6bfcVuXg&t=1s

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start or $env:PORT=8080; yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Load Testing

```bash
# Quick artillery test (console output only)
$ yarn run test:artillery:quick

# Artillery test with timestamped JSON report
$ yarn run test:artillery

# Artillery test with timestamped JSON + HTML reports
$ yarn run test:artillery:html

# Open the latest HTML report in browser
$ yarn run report:open

# Load testing workflow (recommended)
$ yarn run start              # Start the app in background
$ Start-Sleep -Seconds 3      # Wait for app to start
$ curl http://localhost:3000  # Verify app is responding
$ yarn run test:artillery:html # Run load test with reports
$ yarn run report:open        # View the HTML report
```

### Report Files
Reports are saved in the `reports/` directory with timestamps:
- **JSON reports**: `load-test-YYYY-MM-DD_HH-mm-ss.json` (machine-readable)
- **HTML reports**: `load-test-YYYY-MM-DD_HH-mm-ss.html` (human-readable)

### Understanding Artillery Reports
- **P95**: 95% of requests completed within this time
- **P99**: 99% of requests completed within this time  
- **Apdex Score**: User satisfaction (0.94-1.00 = Excellent)
- **Request Rate**: Requests per second handled
- **Success Rate**: Percentage of successful requests

### Export report configured in package.json
```
    "test:artillery": "powershell -Command \"$timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'; New-Item -ItemType Directory -Force -Path reports; artillery run ./artillery.yaml --output reports/load-test-$timestamp.json\"",
    "test:artillery:html": "powershell -Command \"$timestamp = Get-Date -Format 'yyyy-MM-dd_HH-mm-ss'; New-Item -ItemType Directory -Force -Path reports; artillery run ./artillery.yaml --output reports/load-test-$timestamp.json; artillery report reports/load-test-$timestamp.json --output reports/load-test-$timestamp.html\"",
    "test:artillery:quick": "artillery run ./artillery.yaml"
```

### Summarize the latest Artillery JSON report (human-readable)
```
$ yarn run test:artillery_summary
```
This will print a summary to the console, showing if your test PASSED or FAILED thresholds, and why.

### Test

```
$ yarn run test
$ yarn run test:e2e
$ yarn run test:cov
```

### Cypress E2E & Login Performance Testing

### Cypress Login Test
Open 2 terminals
![open 2 terminals](readme/TwoTerminals.png)
```bash
# Run website first
yarn run start
# Run Cypress login test (headless)
yarn run test:cypress:login
# Open Cypress interactive test runner
yarn run cypress:open
```

- Edit the test in `cypress/e2e/login.cy.js` to match your login page selectors and assertions.

### Artillery Login Performance Test
```bash
# Quick login test (console output only)
yarn run test:artillery:login

# Login test with timestamped JSON report
yarn run test:artillery:login:json

# Login test with timestamped JSON + HTML reports
yarn run test:artillery:login:html

# Config-driven login test (uses shared YAML configuration)
yarn run test:artillery:login:config

# Generate test data from configuration
yarn run generate:test-data

# Summarize the latest login test JSON report
yarn run test:artillery:login:summary
```

### Login Test Report Files
Login test reports are saved in the `reports/` directory with timestamps:
- **JSON reports**: `login-test-YYYY-MM-DD_HH-mm-ss.json` (machine-readable)
- **HTML reports**: `login-test-YYYY-MM-DD_HH-mm-ss.html` (human-readable)

### Configuration-Driven Development
The login feature uses a shared configuration file `config/login-config.yaml` that defines:
- **UI Selectors**: CSS selectors for all login page elements
- **Test Data**: Valid/invalid user credentials for testing
- **API Contracts**: Expected request/response formats
- **Performance Thresholds**: Acceptable response times and success rates

This allows frontend and backend developers to work in parallel using the same "contract."

#### Automatic HTML-to-Config Synchronization
```bash
# Manually sync HTML changes to YAML config
yarn run sync:html-to-config

# Watch for HTML changes and auto-sync (development mode)
yarn run watch:html-changes

# PowerShell version of manual sync
yarn run sync:html-to-config:ps
```

When you change selectors in `public/login.html`, run the sync command to automatically update the YAML configuration. This ensures your tests stay in sync with UI changes.

- Edit `artillery-login.yaml` to match your real login API and payload if needed.

## HTML-to-YAML Configuration Sync
Contract file login-config.yaml between login.html and cypress test
![open 2 terminals](readme/locatorContact.png)

### Commands
```bash
# Manually sync HTML changes to YAML config (full-featured)
yarn run sync:html-to-config

# Lightweight sync (no external dependencies)
yarn run sync:html-to-config:simple

# Watch for HTML changes and auto-sync (development mode)
yarn run watch:html-changes

# PowerShell version of manual sync
yarn run sync:html-to-config:ps
```

### Example Output - Manual Sync
```
$ yarn run sync:html-to-config
🔄 Analyzing HTML file for selector changes...
🔍 Detected selectors from HTML:
   • username_input: #user-name
   • password_input: #password
   • submit_button: button[type="submit"]
   • welcome_message: #welcome
   • error_message: .error-message
   • page_title: h1
📋 Backed up current config to: login-config.yaml.backup
✅ Configuration updated successfully!
📝 Changes made:
   • username_input: #username → #user-name
📊 Change report generated: reports/config-changes.md
```

### Example Output - Watch Mode
```
$ yarn run watch:html-changes
👀 Watching for HTML changes...
📁 Monitoring: D:\newjob\artillery-load-testing\public\login.html
🔄 Auto-sync enabled - YAML config will update when HTML changes 
⏹️  Press Ctrl+C to stop

📝 HTML file changed at 3:42:50 PM
🔄 Analyzing HTML file for selector changes...
✅ Configuration updated successfully!
📝 Changes made:
   • username_input: #username → #user-name

👀 Continuing to watch for changes...
```

### How It Works
1. **Detects Changes**: Monitors `public/login.html` for selector modifications
2. **Smart Extraction**: Prioritizes selectors (ID > class > data-testid > name > type)
3. **Updates Config**: Automatically updates `config/login-config.yaml`
4. **Creates Backups**: Saves backup files before making changes
5. **Generates Reports**: Creates detailed change reports in `reports/config-changes.md`

### Use Cases
- **Frontend Developer**: Change HTML selectors without breaking tests
- **QA Engineer**: Ensure test selectors stay synchronized with UI
- **Team Workflow**: Maintain configuration contract automatically
- **CI/CD Pipeline**: Integrate with git hooks for automatic sync

---

## Cypress Debug

### Claude Sonnet 4.0 gave up info => Cypress debugging is notoriously difficult because:
1. Cypress runs in an Electron process (not pure Node.js)
2. It has multiple processes running
3. NODE_OPTIONS debugging often doesn't work reliably
4. The packaged app limitations prevent standard Node.js debugging


To debug Cypress and hit breakpoints in `cypress.config.js` in VS Code:

1. **Start your backend server in a separate terminal:**
   ```bash
   yarn start:dev
   ```
2. **Set breakpoints in `cypress.config.js` where you want to pause.**
3. **Use the provided launch configuration:**
   - Open `.vscode/launch.json` and ensure you have:
     ```json
     {
       "type": "node",
       "request": "launch",
       "name": "Debug Cypress Config (Node)",
       "program": "${workspaceFolder}/node_modules/cypress/bin/cypress",
       "args": ["run", "--spec", "cypress/e2e/login.cy.js"],
       "console": "integratedTerminal",
       "skipFiles": ["<node_internals>/**"],
       "cwd": "${workspaceFolder}"
     }
     ```
   - **Select "Debug Cypress Config (Node)"** in the Run & Debug panel and press **F5**.
4. **Alternatively, attach to a running process:**
   - In VS Code, press `Ctrl+Shift+P` → type `Debug: Attach to Node Process` → select the Cypress process.
5. **You can also run from terminal:**
   ```bash
   node --inspect-brk ./node_modules/cypress/bin/cypress run --spec cypress/e2e/login.cy.js
   ```
   Then attach as above.

### package.json debug script example
```json
"test:cypress:login:debug": "cross-env NODE_OPTIONS='--inspect' cypress run --spec cypress/e2e/login.cy.js"
```

**Note:**
- Do not use `.bin/cypress` (it's a shell script). Always use the real Node.js entry: `node_modules/cypress/bin/cypress`.
- This method allows you to hit breakpoints in your config and custom tasks.
