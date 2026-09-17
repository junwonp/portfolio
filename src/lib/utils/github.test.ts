import { describe, expect, it } from 'vitest';

import { getGithubHref } from '@/lib/utils/github';

describe('getGithubHref', () => {
  it('returns an empty string for missing links', () => {
    expect(getGithubHref(null)).toBe('');
    expect(getGithubHref(undefined)).toBe('');
    expect(getGithubHref('')).toBe('');
  });

  it('keeps an absolute URL untouched', () => {
    expect(getGithubHref('https://github.com/junwonp')).toBe('https://github.com/junwonp');
    expect(getGithubHref('http://example.com/repo')).toBe('http://example.com/repo');
  });

  it('expands a bare owner or owner/repo into a GitHub URL', () => {
    expect(getGithubHref('junwonp')).toBe('https://github.com/junwonp');
    expect(getGithubHref('junwonp/portfolio')).toBe('https://github.com/junwonp/portfolio');
  });
});
