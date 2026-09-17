import { fileURLToPath } from 'node:url';
import { cloudflareTest } from '@cloudflare/vitest-plugin';
import { defineConfig } from 'vitest/config';

// Runs in the real Workers runtime through Miniflare. Bindings (D1, KV, R2)
// come from wrangler.jsonc, `import { env } from 'cloudflare:workers'` is the
// real module here, and storage is isolated per test file. No jsdom and no
// `environment` override: the integration rejects custom environments.
export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.jsonc' },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    name: 'workers',
    clearMocks: true,
    include: ['src/**/*.workers.test.{ts,tsx}'],
  },
});
