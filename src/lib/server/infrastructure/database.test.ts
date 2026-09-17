import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveDbFromEnv } from '@/lib/server/infrastructure/database';

const importDatabase = async () => {
  vi.resetModules();
  return import('@/lib/server/infrastructure/database');
};

afterEach(() => {
  vi.doUnmock('cloudflare:workers');
});

describe('resolveDbFromEnv', () => {
  it('returns the Cloudflare D1 binding when it is present', () => {
    const db = { prepare: () => ({}) } as unknown as D1Database;

    expect(resolveDbFromEnv({ portfolio_db: db })).toBe(db);
  });

  it('does not read D1 bindings from string process env values', () => {
    expect(resolveDbFromEnv({ portfolio_db: 'not-a-d1-binding' })).toBeUndefined();
  });

  it('returns undefined when the runtime env is missing', () => {
    expect(resolveDbFromEnv(undefined)).toBeUndefined();
  });

  it('returns undefined when the runtime env has no portfolio_db binding', () => {
    expect(resolveDbFromEnv({})).toBeUndefined();
  });

  it('returns undefined when the portfolio_db binding is not an object', () => {
    expect(resolveDbFromEnv({ portfolio_db: 42 })).toBeUndefined();
    expect(resolveDbFromEnv({ portfolio_db: null })).toBeUndefined();
  });

  it('returns undefined when the binding is an object without a prepare key', () => {
    expect(resolveDbFromEnv({ portfolio_db: {} })).toBeUndefined();
  });
});

describe('getCloudflareEnv', () => {
  it('memoizes the runtime import so later calls reuse the same promise', async () => {
    const { getCloudflareEnv } = await importDatabase();

    const firstPromise = getCloudflareEnv();
    const secondPromise = getCloudflareEnv();

    expect(secondPromise).toBe(firstPromise);
    await expect(firstPromise).resolves.toEqual({});
  });

  it('resolves undefined when the Workers runtime module cannot be imported', async () => {
    vi.resetModules();
    vi.doMock('cloudflare:workers', () => {
      throw new Error('cloudflare:workers is only available on the Workers runtime');
    });

    const { getCloudflareEnv } = await import('@/lib/server/infrastructure/database');

    await expect(getCloudflareEnv()).resolves.toBeUndefined();
  });
});

describe('getDb', () => {
  it('returns undefined when the runtime env provides no D1 binding', async () => {
    const { getDb } = await importDatabase();

    await expect(getDb()).resolves.toBeUndefined();
  });

  it('returns undefined when the runtime env itself is missing', async () => {
    vi.doMock('cloudflare:workers', () => ({ env: undefined }));

    const { getDb } = await importDatabase();

    await expect(getDb()).resolves.toBeUndefined();
  });

  it('returns the D1 binding exposed by the runtime env', async () => {
    const db = { prepare: vi.fn() } as unknown as D1Database;
    vi.doMock('cloudflare:workers', () => ({ env: { portfolio_db: db } }));

    const { getDb } = await importDatabase();

    await expect(getDb()).resolves.toBe(db);
  });
});
