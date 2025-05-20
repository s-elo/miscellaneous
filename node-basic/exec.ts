/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);

const demoName = args[0];

execSync(`ts-node ${path.resolve(__dirname, `./src/${demoName}/index.ts`)}`, {
  stdio: 'inherit',
});
