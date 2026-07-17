import { describe, expect, it } from 'vitest';

import {
  getCacheControlForPath,
  getDefaultLocaleRedirectPathname,
  getDefaultLocaleRewritePathname,
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

describe('getDefaultLocaleRewritePathname', () => {
  it('maps public Korean portfolio paths to the internal locale segment', () => {
    expect(getDefaultLocaleRewritePathname('/')).toBe('/ko');
    expect(getDefaultLocaleRewritePathname('/projects/aira')).toBe('/ko/projects/aira');
    expect(getDefaultLocaleRewritePathname('/privacy')).toBe('/ko/privacy');
    expect(getDefaultLocaleRewritePathname('/application-slug')).toBe('/ko/application-slug');
  });

  it('leaves explicit locale paths unchanged', () => {
    expect(getDefaultLocaleRewritePathname('/en')).toBeNull();
    expect(getDefaultLocaleRewritePathname('/en/projects/aira')).toBeNull();
    expect(getDefaultLocaleRewritePathname('/ko')).toBeNull();
    expect(getDefaultLocaleRewritePathname('/ko/projects/aira')).toBeNull();
  });

  it.each([
    '/_next',
    '/_next/data/build-id/index.json',
    '/favicon.ico',
    '/api',
    '/api/analytics',
    '/a',
    '/a/applications',
    '/admin',
    '/admin/settings',
    '/print',
    '/print/portfolio',
    '/resume',
    '/resume/download',
    '/fonts/GeistMono[wght].woff2',
    '/images/preview.webp',
    '/certificates/example.pdf',
  ])('does not rewrite reserved path %s', (pathname) => {
    expect(getDefaultLocaleRewritePathname(pathname)).toBeNull();
  });

  it('does not rewrite static files while preserving route-like dotted segments', () => {
    expect(getDefaultLocaleRewritePathname('/robots.txt')).toBeNull();
    expect(getDefaultLocaleRewritePathname('/theme-initializer.js')).toBeNull();
    expect(getDefaultLocaleRewritePathname('/.well-known/security.txt')).toBeNull();
    expect(getDefaultLocaleRewritePathname('/.well-known')).toBe('/ko/.well-known');
  });

  it('does not rewrite unsupported route shapes or existing metadata routes', () => {
    expect(getDefaultLocaleRewritePathname('/foo/bar')).toBeNull();
    expect(getDefaultLocaleRewritePathname('/projects')).toBeNull();
    expect(getDefaultLocaleRewritePathname('/projects/aira/extra')).toBeNull();
    expect(getDefaultLocaleRewritePathname('/opengraph-image')).toBeNull();
    expect(getDefaultLocaleRewritePathname('/twitter-image')).toBeNull();
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
