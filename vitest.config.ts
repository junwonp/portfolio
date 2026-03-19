import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [svelte({ hot: false })],
  resolve: {
    conditions: ['browser'],
    alias: {
      $lib: '/src/lib',
      $app: '/node_modules/@sveltejs/kit/src/runtime/app',
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
