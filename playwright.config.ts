import { defineConfig, devices } from '@playwright/test';

/*
 * End-to-end suite for the unauthenticated public surfaces. Every spec here has
 * to pass against a bare `pnpm dev` — no `.dev.vars`, no Cloudflare Access, no
 * seeded D1 row — so the CI job needs no secrets beyond what the workflow
 * already has.
 *
 * Playwright starts the app itself (webServer below), so `pnpm test:e2e` is the
 * single entry point. In CI the server always starts fresh; locally an already
 * running dev server on the same port is reused.
 *
 * Screenshots are captured as artifacts, never compared against a baseline:
 * baselines would be generated on the maintainer's macOS machine while CI
 * renders on Linux, and font rasterisation differs between the two. The print
 * document's established gate (scripts/verify-print-layout.mjs) measures
 * geometry for the same reason, and the specs here mirror it.
 */

const port = Number(process.env.E2E_PORT ?? 3000);
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: './e2e',
  /*
   * Loads every route the specs visit once, before any test runs, so the dev
   * server's lazy dependency optimizer has settled: an on-demand re-bundle
   * invalidates its own already-served URLs and reloads the page, which aborts a
   * navigation in flight. See the file for the reproduction.
   */
  globalSetup: './e2e/global-setup.ts',
  /*
   * `*.e2e.ts`, not the usual `*.spec.ts`: Vitest runs with its default include,
   * which matches both `.test.` and `.spec.` files anywhere in the repository,
   * so an e2e spec would be collected as a unit test. Naming these away from
   * that pattern keeps the two runners independent.
   */
  testMatch: '**/*.e2e.ts',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // One retry absorbs a cold-start render; the CI job is not a flake detector.
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  use: {
    baseURL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  expect: {
    timeout: 10_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
