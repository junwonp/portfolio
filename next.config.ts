import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/github',
        destination: 'https://github.com/junwonp',
        permanent: false,
      },
      {
        source: '/linkedin',
        destination: 'https://www.linkedin.com/in/junwonp',
        permanent: false,
      },
    ];
  },
  webpack: (config) => {
    if (config.watchOptions) {
      const existingIgnored = config.watchOptions.ignored;
      config.watchOptions.ignored = [
        ...(Array.isArray(existingIgnored)
          ? existingIgnored
          : existingIgnored
            ? [existingIgnored]
            : []),
        '**/node_modules/**',
        '**/.wrangler/**',
        '**/.open-next/**',
        '**/.next/**',
        '**/.git/**',
      ];
    }
    return config;
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm', 'remark-frontmatter', 'remark-mdx-frontmatter'],
  },
});

export default withMDX(nextConfig);

import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';
initOpenNextCloudflareForDev();
