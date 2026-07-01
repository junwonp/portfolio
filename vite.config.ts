import { cloudflare } from '@cloudflare/vite-plugin';
import babel from '@rolldown/plugin-babel';
import { kvDataAdapter } from '@vinext/cloudflare/cache/kv-data-adapter';
import { reactCompilerPreset } from '@vitejs/plugin-react';
import vinext from 'vinext';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    vinext({
      cache: {
        data: kvDataAdapter({ binding: 'VINEXT_KV_CACHE' }),
      },
    }),
    babel({ presets: [reactCompilerPreset()] }),
    cloudflare({
      viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
    }),
  ],
});
