import { fileURLToPath } from 'node:url';
import mdx from '@mdx-js/rollup';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { configDefaults, defineConfig } from 'vitest/config';

import rehypeHeadingIds from './src/lib/mdx/rehypeHeadingIds.ts';

// Pure-logic and jsdom tests. jsdom is opt-in per file via the
// `@vitest-environment jsdom` docblock; `cloudflare:workers` stays aliased to
// the empty mock because these tests assert binding-less behaviour.
export default defineConfig({
  plugins: [
    mdx({
      providerImportSource: '@/mdx-components',
      rehypePlugins: [rehypeHeadingIds],
      remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
    }),
    vanillaExtractPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'cloudflare:workers': fileURLToPath(
        new URL('./src/lib/server/infrastructure/cloudflare-workers.mock.ts', import.meta.url),
      ),
    },
  },
  test: {
    name: 'node',
    clearMocks: true,
    // Surfaces a timer, interval, or observer a test forgot to release. The
    // timer/observer-driven jsdom hook tests live in this project.
    detectAsyncLeaks: true,
    environment: 'node',
    experimental: {
      fsModuleCache: true,
    },
    // jest-dom only here and in the browser project; the workers runtime has no
    // DOM and its config deliberately does not load this.
    setupFiles: ['./vitest.setup.jest-dom.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs'],
    exclude: [
      ...configDefaults.exclude,
      'src/**/*.workers.test.{ts,tsx}',
      'src/**/*.browser.test.{ts,tsx}',
    ],
  },
});
