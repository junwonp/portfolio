import { fileURLToPath } from 'node:url';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { playwright } from '@vitest/browser-playwright';
import { configDefaults, defineConfig } from 'vitest/config';

// Real-browser layout assertions. Files here are named `*.browser.test.*` so the
// Node project's `include` cannot also claim them.
export default defineConfig({
  plugins: [vanillaExtractPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    name: 'browser',
    clearMocks: true,
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
