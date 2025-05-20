/* eslint-disable @typescript-eslint/no-var-requires */
const { execSync } = require('child_process');

const exec = (command) => {
  execSync(command, { stdio: 'inherit' });
};

function run(command, projectName, ...args) {
  exec(
    `turbo run ${command} ${projectName ? `--filter=${projectName}` : ''} ${
      args.length ? `-- ${args.join(' ')}` : ''
    }`,
  );
}

const args = process.argv.slice(2);

run(args[0], args[1], ...args.slice(2));
