export default {
  plugins: ['@stryker-mutator/vitest-runner'],
  testRunner: 'vitest',
  vitest: {
    configFile: 'vitest.stryker.config.ts',
  },
  // Stryker 10's sandbox rewrites tsconfig.json through the TypeScript 5 API
  // (`ts.parseConfigFileTextToJson`), which TypeScript 7 removed. This repo's
  // tsconfig declares no `extends` or `references`, so the rewrite has nothing
  // to do; pointing it at a name absent from the sandbox makes it a no-op.
  tsconfigFile: 'tsconfig.stryker-skip.json',
  // None of these are inputs to the node tests, and `.codegraph` is a symlinked
  // directory that Stryker cannot copy into the sandbox.
  ignorePatterns: [
    '.codegraph',
    '.lighthouseci',
    '.next',
    '.playwright-cli',
    '.vinext',
    'coverage',
    'dist',
    'output',
    'playwright-report',
    'test-results',
  ],
  mutate: ['src/lib/portfolio/techStack.ts', 'src/lib/utils/*.ts', '!src/lib/utils/*.test.ts'],
  reporters: ['clear-text', 'progress'],
  coverageAnalysis: 'perTest',
  concurrency: 2,
  thresholds: { high: 80, low: 60, break: null },
  cleanTempDir: true,
};
