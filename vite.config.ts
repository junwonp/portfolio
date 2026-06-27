import { cloudflare } from '@cloudflare/vite-plugin';
import { kvDataAdapter } from '@vinext/cloudflare/cache/kv-data-adapter';
import vinext from 'vinext';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    vinext({
      cache: {
        data: kvDataAdapter({ binding: 'VINEXT_KV_CACHE' }),
      },
    }),
    cloudflare({
      viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
    }),
  ],
});
