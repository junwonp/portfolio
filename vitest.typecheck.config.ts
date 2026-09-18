import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Type-level contracts only. This config is intentionally NOT listed in the
// root `projects`: `typecheck.enabled` makes Vitest run the type tests on every
// invocation, and `pnpm test` must keep running only the runtime suite. The
// `typecheck` script points `--config` here instead.
export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    name: 'types',
    include: [],
    typecheck: {
      enabled: true,
      include: ['src/**/*.test-d.ts'],
      tsconfig: './tsconfig.json',
    },
  },
});
