import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [
    vitePreprocess(),
    mdsvex({
      highlight: {
        langs: ['javascript', 'typescript', 'mermaid'],
      },
    }),
  ],
  kit: {
    csp: {
      mode: 'nonce',
      directives: {
        'default-src': ['none'],
        'script-src': ['self'],
        'style-src': ['self', 'unsafe-inline'],
        'img-src': ['self', 'data:'],
        'font-src': ['self'],
        'media-src': ['self'],
        'connect-src': ['self'],
        'frame-ancestors': ['none'],
        'object-src': ['none'],
        'base-uri': ['self'],
      },
    },
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: '404.html',
      precompress: true,
      strict: true,
    }),
    alias: {
      $test: 'src/test',
    },
    paths: {
      base: process.env.BASE_PATH || '',
    },
    prerender: {
      handleHttpError: ({ path, message }) => {
        if (
          path.startsWith('/fonts/') ||
          path.startsWith('/certificates/') ||
          path.startsWith('/images/') ||
          path.startsWith('/projects/')
        ) {
          console.warn(message);
          return;
        }

        throw new Error(message);
      },
    },
  },
  extensions: ['.svelte', '.svx'],
};

export default config;
