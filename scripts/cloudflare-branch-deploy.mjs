import { spawnSync } from 'node:child_process';

const branch = process.env.WORKERS_CI_BRANCH;

if (branch !== 'develop') {
  console.log(`Skipping non-production deploy for branch: ${branch ?? 'unknown'}`);
  process.exit(0);
}

const command = ['vinext', 'deploy', '--env', 'develop'];

const result = spawnSync('pnpm', ['exec', ...command], {
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
