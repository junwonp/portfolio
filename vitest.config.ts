import { defineConfig } from 'vitest/config';

// Three projects, each with an explicit `include` so a test file can only ever
// land in one of them:
//   node    - pure logic, MDX/catalog tests, and the jsdom-docblock files (mocked bindings)
//   workers - `*.workers.test.ts` inside the real Workers runtime with real D1/KV/R2
//   browser - `*.browser.test.tsx` in Chromium for real layout measurements
// Coverage is a Vitest-level option, so it stays here and spans all projects.
export default defineConfig({
  test: {
    // `runtime` marks files that boot a real runtime (workerd via Miniflare, or
    // Chromium), so `--tagsFilter runtime` selects the slow half and
    // `--tagsFilter '!runtime'` the fast node half. `dom` marks the jsdom-backed
    // files whose timer/observer lifecycle is what `detectAsyncLeaks` watches.
    tags: [
      { name: 'runtime', description: 'Boots a real runtime (workerd or Chromium), slower.' },
      { name: 'dom', description: 'Runs against jsdom instead of the Node environment.' },
    ],
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
        // Type-level tests and benchmarks are tooling, not shipped code, so they
        // stay out of the production denominator the same way *.test.* does.
        'src/**/*.test-d.ts',
        'src/**/*.bench.{ts,tsx}',
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
        statements: 85,
        branches: 78,
        functions: 85,
        lines: 87,
      },
    },
  },
});
