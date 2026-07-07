import { describe, expect, it } from 'vitest';

import {
  getCacheControlForPath,
  getDefaultLocaleRedirectPathname,
  getResumeRewritePathname,
} from '@/proxy';

describe('getCacheControlForPath', () => {
  it('keeps assets cacheable for a long time', () => {
    expect(getCacheControlForPath('/fonts/GeistMono[wght].woff2')).toBe(
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
    expect(getCacheControlForPath('/a')).toBe(
      'private, no-cache, no-store, must-revalidate',
    );
  });
});

describe('getDefaultLocaleRedirectPathname', () => {
  it('redirects Korean-prefixed URLs to the no-prefix canonical path', () => {
    expect(getDefaultLocaleRedirectPathname('/ko')).toBe('/');
    expect(getDefaultLocaleRedirectPathname('/ko/projects/aira')).toBe('/projects/aira');
  });

  it('does not redirect no-prefix or English-prefixed URLs', () => {
    expect(getDefaultLocaleRedirectPathname('/projects/aira')).toBeNull();
    expect(getDefaultLocaleRedirectPathname('/en/projects/aira')).toBeNull();
  });
});

describe('getResumeRewritePathname', () => {
  it('serves the printable resume at the resume subdomain root', () => {
    expect(getResumeRewritePathname('resume.junwon.dev', '/')).toBe('/resume');
    expect(getResumeRewritePathname('resume.junwon.dev:443', '/')).toBe('/resume');
  });

  it('leaves non-root resume subdomain paths and portfolio hosts unchanged', () => {
    expect(getResumeRewritePathname('resume.junwon.dev', '/projects/aira')).toBeNull();
    expect(getResumeRewritePathname('junwon.dev', '/')).toBeNull();
    expect(getResumeRewritePathname('localhost:3000', '/')).toBeNull();
  });
});
