import nodeConfig from './vitest.node.config.ts';

// Stryker rewrites the same source file once per mutant and re-runs vitest in
// one process, but the node config's on-disk transform cache
// (`experimental.fsModuleCache`) would keep serving the pre-mutation module for
// every run after the first — every mutant would report as surviving. This
// config is the node project without that cache, used only by Stryker.
export default {
  ...nodeConfig,
  test: {
    ...nodeConfig.test,
    experimental: { fsModuleCache: false },
  },
};
