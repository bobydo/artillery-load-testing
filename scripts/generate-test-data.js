// scripts/generate-test-data.js
// Script to generate Artillery CSV payload from YAML config

import { load } from 'js-yaml';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

function generateArtilleryPayload() {
  try {
    // Load the login configuration
    const configPath = join(__dirname, '..', 'config', 'login-config.yaml');
    const fileContents = readFileSync(configPath, 'utf8');
    const config = load(fileContents);

    // Extract test users
    const validUsers = config.test_data.valid_users;

    // Generate CSV content
    let csvContent = 'username,password\n';

    // Add valid users multiple times for load testing
    validUsers.forEach((user) => {
      // Add each user 3 times to increase load variety
      for (let i = 0; i < 3; i++) {
        csvContent += `${user.username},${user.password}\n`;
      }
    });

    // Write to artillery payload file
    const outputPath = join(__dirname, '..', 'config', 'artillery-payload.csv');
    writeFileSync(outputPath, csvContent);

    console.log('✅ Artillery payload CSV generated successfully!');
    console.log(`📄 File: ${outputPath}`);
    console.log(`📊 Generated ${validUsers.length * 3} test combinations`);
  } catch (error) {
    console.error('❌ Error generating Artillery payload:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateArtilleryPayload();
}

export default { generateArtilleryPayload };
