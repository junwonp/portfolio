import { fileURLToPath } from 'node:url';
import mdx from '@mdx-js/rollup';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig } from 'vitest/config';

import rehypeHeadingIds from './src/lib/mdx/rehypeHeadingIds.ts';

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
    clearMocks: true,
    environment: 'node',
    fsModuleCache: true,
    coverage: {
      provider: 'v8',
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
      // Ratchet: floor of the 2026-09 baseline. Raise when coverage improves.
      thresholds: {
        statements: 40,
        branches: 34,
        functions: 37,
        lines: 41,
      },
    },
  },
});
