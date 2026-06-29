import { describe, expect, it } from 'vitest';

import { extractApplicationSlugFromPath, normalizeApplicationSlug } from '@/lib/utils/applicationSlug';

describe('application slug utilities', () => {
  it('normalizes application slugs for stored links', () => {
    expect(normalizeApplicationSlug(' Toss Frontend! ')).toBe('tossfrontend');
    expect(normalizeApplicationSlug('TEAM-2026')).toBe('team-2026');
  });

  it('extracts application slugs from single-segment public paths', () => {
    expect(extractApplicationSlugFromPath('/toss')).toBe('toss');
    expect(extractApplicationSlugFromPath('/abcd')).toBe('abcd');
    expect(extractApplicationSlugFromPath('/Toss-Frontend/')).toBe('toss-frontend');
  });

  it('excludes reserved routes, nested paths, and invalid slug paths', () => {
    expect(extractApplicationSlugFromPath('/a')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/api')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/projects/foo')).toBeUndefined();
    expect(extractApplicationSlugFromPath('')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/ab_cd')).toBeUndefined();
  });
});
