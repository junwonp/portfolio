import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  plugins: [sveltekit()],
  build: {
    target: ['es2022', 'chrome80', 'safari13', 'firefox78', 'edge80'],
    cssTarget: 'chrome80',
    cssMinify: 'esbuild',
    minify: true,
    chunkSizeWarningLimit: 1000,
  },
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
  ssr: {
    noExternal: ['lucide-svelte'],
  },
}));
