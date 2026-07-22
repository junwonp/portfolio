import mdx from '@mdx-js/rollup';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { fileURLToPath } from 'node:url';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdxFrontmatter from 'remark-mdx-frontmatter';
import { defineConfig } from 'vitest/config';

import rehypeHeadingIds from './src/lib/mdx/rehypeHeadingIds';

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
    environment: 'node',
  },
});
