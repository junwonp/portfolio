import { describe, expect, it } from 'vitest';

import { resolveDbFromEnv } from '@/lib/server/db';

describe('resolveDbFromEnv', () => {
  it('returns the Cloudflare D1 binding when it is present', () => {
    const db = { prepare: () => ({}) } as unknown as D1Database;

    expect(resolveDbFromEnv({ portfolio_db: db })).toBe(db);
  });

  it('does not read D1 bindings from string process env values', () => {
    expect(resolveDbFromEnv({ portfolio_db: 'not-a-d1-binding' })).toBeUndefined();
  });
});
