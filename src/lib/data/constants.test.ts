import { afterEach, describe, expect, it, vi } from 'vitest';

const importPortfolioUrl = async () => {
  vi.resetModules();
  const constants = await import('./constants');
  return constants.PORTFOLIO_URL;
};

describe('PORTFOLIO_URL', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the production canonical URL for non-local deploy environments', async () => {
    vi.stubEnv('APP_ENV', 'development');
    vi.stubEnv('NODE_ENV', 'production');

    await expect(importPortfolioUrl()).resolves.toBe('https://junwon.dev');
  });

  it('uses the local URL for local development', async () => {
    vi.stubEnv('APP_ENV', 'local');
    vi.stubEnv('NODE_ENV', 'production');

    await expect(importPortfolioUrl()).resolves.toBe('http://localhost:3000');
  });

  it('uses an explicit portfolio URL override without trailing slashes', async () => {
    vi.stubEnv('PORTFOLIO_URL', 'https://preview.junwon.dev///');
    vi.stubEnv('NODE_ENV', 'production');

    await expect(importPortfolioUrl()).resolves.toBe('https://preview.junwon.dev');
  });
});
