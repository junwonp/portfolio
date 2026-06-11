import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    cssTarget: 'chrome80',
    cssMinify: 'esbuild',
    minify: true,
  },
  ssr: {
    noExternal: ['lucide-svelte'],
  },
});
