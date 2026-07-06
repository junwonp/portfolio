import { cloudflare } from '@cloudflare/vite-plugin';
import babel from '@rolldown/plugin-babel';
import { cdnAdapter } from '@vinext/cloudflare/cache/cdn-adapter';
import { kvDataAdapter } from '@vinext/cloudflare/cache/kv-data-adapter';
import { imagesOptimizer } from '@vinext/cloudflare/images/images-optimizer';
import { reactCompilerPreset } from '@vitejs/plugin-react';
import vinext from 'vinext';
import { defineConfig } from 'vite';

const cloudflareConfigPath = process.env.CLOUDFLARE_CONFIG_PATH ?? 'wrangler.jsonc';

export default defineConfig({
  plugins: [
    vinext({
      cache: {
        cdn: cdnAdapter(),
        data: kvDataAdapter({ binding: 'VINEXT_KV_CACHE' }),
      },
      images: {
        optimizer: imagesOptimizer(),
      },
    }),
    babel({ presets: [reactCompilerPreset()] }),
    cloudflare({
      configPath: cloudflareConfigPath,
      viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
    }),
  ],
});
