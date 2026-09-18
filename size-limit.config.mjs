// Measures the built client bundle in `dist/`, so run `pnpm build` first.
// `running: false` skips Lighthouse-free headless-Chrome runtime timing from
// `@size-limit/time` (the preset-app addition); these are size budgets only.
// The first entry mirrors the landing page's first-load set: `vinext build`
// records the browser entry plus its preload modules in
// `dist/server/vinext-client-assets.js` (rolldown runtime, framework, vinext,
// and the app entry chunk).
export default [
  {
    name: 'Landing page first-load JS',
    path: [
      'dist/client/_next/static/chunks/rolldown-runtime-*.js',
      'dist/client/_next/static/chunks/framework-*.js',
      'dist/client/_next/static/chunks/vinext-*.js',
      'dist/client/_next/static/chunks/index-*.js',
    ],
    gzip: true,
    limit: '160 kB',
    running: false,
  },
  {
    name: 'Client JS (all chunks)',
    path: 'dist/client/_next/static/chunks/*.js',
    gzip: true,
    limit: '280 kB',
    running: false,
  },
];
