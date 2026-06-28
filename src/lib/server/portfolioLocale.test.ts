import { describe, expect, it } from 'vitest';

import { resolvePortfolioLocale } from '@/lib/server/portfolioLocale';

describe('resolvePortfolioLocale', () => {
  it('returns ko for a valid Korean locale header value', () => {
    expect(resolvePortfolioLocale('ko')).toBe('ko');
  });

  it('returns en for a valid English locale header value', () => {
    expect(resolvePortfolioLocale('en')).toBe('en');
  });

  it('falls back to ko for missing or invalid values', () => {
    expect(resolvePortfolioLocale(null)).toBe('ko');
    expect(resolvePortfolioLocale('ja')).toBe('ko');
    expect(resolvePortfolioLocale(undefined)).toBe('ko');
  });
});
