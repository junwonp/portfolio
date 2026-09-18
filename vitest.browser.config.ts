import { fileURLToPath } from 'node:url';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { playwright } from '@vitest/browser-playwright';
import { configDefaults, defineConfig } from 'vitest/config';

// Real-browser layout assertions. Files here are named `*.browser.test.*` so the
// Node project's `include` cannot also claim them.
export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  // The jest-dom setup import is otherwise optimized on first use, which
  // reloads the page mid-test in browser mode.
  optimizeDeps: {
    include: ['@testing-library/jest-dom/vitest'],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    name: 'browser',
    clearMocks: true,
    setupFiles: ['./vitest.setup.jest-dom.ts'],
    include: ['src/**/*.browser.test.{ts,tsx}'],
    exclude: configDefaults.exclude,
    browser: {
      enabled: true,
      headless: true,
      provider: playwright(),
      // Vitest 4 requires explicit instances; `--project browser` still matches
      // the project by its original name and keeps every instance.
      instances: [{ browser: 'chromium' }],
    },
  },
});
