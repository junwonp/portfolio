import { describe, expect, it } from 'vitest';

import { getCacheControlForPath } from '@/proxy';

describe('getCacheControlForPath', () => {
  it('keeps assets cacheable for a long time', () => {
    expect(getCacheControlForPath('/fonts/WantedSansVariable.woff2')).toBe(
      'public, max-age=31536000, immutable',
    );
  });

  it('keeps public pages revalidatable without no-store', () => {
    expect(getCacheControlForPath('/projects/agentic-workflow')).toBe(
      'private, max-age=0, must-revalidate',
    );
  });

  it('keeps private routes no-store', () => {
    expect(getCacheControlForPath('/admin')).toBe(
      'private, no-cache, no-store, must-revalidate',
    );
  });
});
