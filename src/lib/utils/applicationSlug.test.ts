import { describe, expect, it } from 'vitest';

import {
  extractApplicationSlugFromPath,
  extractApplicationSlugFromReferrer,
  normalizeApplicationSlug,
} from '@/lib/utils/applicationSlug';

describe('application slug utilities', () => {
  it('normalizes application slugs for stored links', () => {
    expect(normalizeApplicationSlug(' Toss Frontend! ')).toBe('tossfrontend');
    expect(normalizeApplicationSlug('TEAM-2026')).toBe('team-2026');
  });

  it('extracts application slugs from single-segment public paths', () => {
    expect(extractApplicationSlugFromPath('/toss')).toBe('toss');
    expect(extractApplicationSlugFromPath('/abcd')).toBe('abcd');
    expect(extractApplicationSlugFromPath('/Toss-Frontend/')).toBe('toss-frontend');
    expect(extractApplicationSlugFromPath('/en/abcd')).toBe('abcd');
  });

  it('excludes reserved routes, nested paths, and invalid slug paths', () => {
    expect(extractApplicationSlugFromPath('/a')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/api')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/en')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/projects/foo')).toBeUndefined();
    expect(extractApplicationSlugFromPath('')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/ab_cd')).toBeUndefined();
  });

  it('extracts application slugs from own-domain referrers', () => {
    expect(extractApplicationSlugFromReferrer('https://junwon.dev/p48r')).toBe('p48r');
    expect(extractApplicationSlugFromReferrer('https://www.junwon.dev/en/abcd')).toBe('abcd');
    expect(extractApplicationSlugFromReferrer('https://junwon.dev/p48r/')).toBe('p48r');
  });

  it('ignores external, root, and non-slug referrers', () => {
    expect(extractApplicationSlugFromReferrer('https://github.com/user/repo')).toBeUndefined();
    expect(extractApplicationSlugFromReferrer('https://junwon.dev/')).toBeUndefined();
    expect(extractApplicationSlugFromReferrer('https://junwon.dev/projects/aira')).toBeUndefined();
    expect(extractApplicationSlugFromReferrer('direct')).toBeUndefined();
    expect(extractApplicationSlugFromReferrer('')).toBeUndefined();
    expect(extractApplicationSlugFromReferrer('not a url')).toBeUndefined();
  });
});
