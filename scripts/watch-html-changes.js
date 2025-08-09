// scripts/watch-html-changes.js
// File watcher to automatically sync HTML changes to YAML config

const fs = require('fs');
const path = require('path');
const { HTMLConfigSyncer } = require('./sync-html-to-config');

class HTMLWatcher {
  constructor() {
    this.htmlPath = path.join(__dirname, '..', 'public', 'login.html');
    this.syncer = new HTMLConfigSyncer();
    this.debounceTimeout = null;
  }

  startWatching() {
    console.log('👀 Watching for HTML changes...');
    console.log(`📁 Monitoring: ${this.htmlPath}`);
    console.log('🔄 Auto-sync enabled - YAML config will update when HTML changes');
    console.log('⏹️  Press Ctrl+C to stop\n');

    fs.watchFile(this.htmlPath, { interval: 1000 }, (curr, prev) => {
      if (curr.mtime !== prev.mtime) {
        console.log(`\n📝 HTML file changed at ${new Date().toLocaleTimeString()}`);
        
        // Debounce multiple rapid changes
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
          this.syncer.syncConfig();
          console.log('\n👀 Continuing to watch for changes...\n');
        }, 2000);
      }
    });

    // Keep the process alive
    process.on('SIGINT', () => {
      console.log('\n⏹️  Stopping HTML watcher...');
      fs.unwatchFile(this.htmlPath);
      process.exit(0);
    });
  }
}

// Run if called directly
if (require.main === module) {
  const watcher = new HTMLWatcher();
  watcher.startWatching();
}

module.exports = { HTMLWatcher };
