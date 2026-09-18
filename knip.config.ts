import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  entry: [
    // vinext owns routing, so App Router file conventions are entry points.
    'src/app/**/{page,layout,route,default,not-found,error,global-error,loading,template,opengraph-image,twitter-image,icon,apple-icon,sitemap,robots,manifest}.{ts,tsx}',
    // Tool configs and every runnable script, including the ones only the
    // git hooks and CI call by name.
    '*.config.{ts,mjs,js}',
    'vitest.*.config.ts',
    'scripts/**/*.mjs',
    // Run by name rather than imported: bench, type tests, git hooks, CI gate.
    'src/**/*.bench.ts',
    'src/**/*.test-d.ts',
    'scripts/privacy-gate.mjs',
    'scripts/verify-print-layout.mjs',
    // Referenced by src/app/layout.tsx as a script URL at runtime.
    'public/theme-initializer.js',
  ],
  project: ['src/**/*.{ts,tsx}', 'scripts/**/*.mjs'],
  ignoreDependencies: [
    // `cloudflare:workers` is a runtime-provided module specifier, not an npm
    // package, so knip reports it as an unlisted dependency.
    'cloudflare',
  ],
};

export default config;
