import { defineConfig } from 'vitest/config';

// Three projects, each with an explicit `include` so a test file can only ever
// land in one of them:
//   node    - pure logic, MDX/catalog tests, and the jsdom-docblock files (mocked bindings)
//   workers - `*.workers.test.ts` inside the real Workers runtime with real D1/KV/R2
//   browser - `*.browser.test.tsx` in Chromium for real layout measurements
// Coverage is a Vitest-level option, so it stays here and spans all projects.
export default defineConfig({
  test: {
    projects: [
      './vitest.node.config.ts',
      './vitest.workers.config.ts',
      './vitest.browser.config.ts',
    ],
    coverage: {
      // Istanbul, not v8: `@cloudflare/vitest-plugin` throws for the v8 provider
      // because it needs `node:inspector`, which is a stub inside workerd.
      // Istanbul instruments source and runs on any runtime, so all three
      // projects stay in one coverage run.
      provider: 'istanbul',
      reporter: ['text-summary', 'html', 'json-summary'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/*.css.ts',
        '**/env.d.ts',
        'src/generated/**',
        'src/lib/generated/**',
        '**/cloudflare-workers.mock.ts',
        '**/homeTypes.ts',
        '**/projectTypes.ts',
        '**/projectDetailMdx.ts',
      ],
      // Ratchet: kept a few points under measured coverage so a modest refactor cannot fail the gate.
      thresholds: {
        statements: 57,
        branches: 48,
        functions: 57,
        lines: 59,
      },
    },
  },
});
