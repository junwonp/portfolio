import { describe, expect, it } from 'vitest';

import {
  extractApplicationSlugFromPath,
  extractApplicationSlugFromReferrer,
  getApplicationLinkPathname,
  normalizeApplicationSlug,
} from '@/lib/utils/applicationSlug';

describe('application slug utilities', () => {
  it('normalizes application slugs for stored links', () => {
    expect(normalizeApplicationSlug(' Toss Frontend! ')).toBe('tossfrontend');
    expect(normalizeApplicationSlug('TEAM-2026')).toBe('team-2026');
  });

  it('extracts application slugs from the /r/ short-link namespace', () => {
    expect(extractApplicationSlugFromPath('/r/toss')).toBe('toss');
    expect(extractApplicationSlugFromPath('/r/abcd')).toBe('abcd');
    expect(extractApplicationSlugFromPath('/r/Toss-Frontend/')).toBe('toss-frontend');
    expect(extractApplicationSlugFromPath('/en/r/abcd')).toBe('abcd');
  });

  it('ignores legacy root paths, reserved routes, and malformed paths', () => {
    expect(extractApplicationSlugFromPath('/abcd')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/en/abcd')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/a')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/privacy')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/legacy-slug')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/r')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/r/foo/bar')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/r/ab_cd')).toBeUndefined();
    expect(extractApplicationSlugFromPath('/r/robots.txt')).toBeUndefined();
    expect(extractApplicationSlugFromPath('')).toBeUndefined();
  });

  it('round-trips the built short-link pathname', () => {
    expect(getApplicationLinkPathname('abcd')).toBe('/r/abcd');
    expect(extractApplicationSlugFromPath(getApplicationLinkPathname('abcd'))).toBe('abcd');
  });

  it('extracts application slugs from own-domain referrers', () => {
    expect(extractApplicationSlugFromReferrer('https://junwon.dev/r/p48r')).toBe('p48r');
    expect(extractApplicationSlugFromReferrer('https://www.junwon.dev/en/r/abcd')).toBe('abcd');
    expect(extractApplicationSlugFromReferrer('https://junwon.dev/r/p48r/')).toBe('p48r');
  });

  it('ignores external, root, legacy, and non-slug referrers', () => {
    expect(extractApplicationSlugFromReferrer('https://github.com/user/repo')).toBeUndefined();
    expect(extractApplicationSlugFromReferrer('https://junwon.dev/')).toBeUndefined();
    expect(extractApplicationSlugFromReferrer('https://junwon.dev/p48r')).toBeUndefined();
    expect(extractApplicationSlugFromReferrer('https://junwon.dev/projects/aira')).toBeUndefined();
    expect(extractApplicationSlugFromReferrer('direct')).toBeUndefined();
    expect(extractApplicationSlugFromReferrer('')).toBeUndefined();
    expect(extractApplicationSlugFromReferrer('not a url')).toBeUndefined();
  });
});
