import { describe, expect, it } from 'vitest';

import {
  getLocalizedPathname,
  isValidLanguage,
  resolveLocaleFromPathname,
  stripLocalePathPrefix,
} from '@/lib/utils/language';

describe('isValidLanguage', () => {
  it('returns true for "ko"', () => {
    expect(isValidLanguage('ko')).toBe(true);
  });

  it('returns true for "en"', () => {
    expect(isValidLanguage('en')).toBe(true);
  });

  it('returns false for other strings', () => {
    expect(isValidLanguage('fr')).toBe(false);
    expect(isValidLanguage('ja')).toBe(false);
    expect(isValidLanguage('')).toBe(false);
  });

  it('returns false for non-string values', () => {
    expect(isValidLanguage(undefined)).toBe(false);
    expect(isValidLanguage(null)).toBe(false);
    expect(isValidLanguage(123)).toBe(false);
    expect(isValidLanguage(true)).toBe(false);
  });
});

describe('resolveLocaleFromPathname', () => {
  it('uses English for /en and nested /en paths', () => {
    expect(resolveLocaleFromPathname('/en')).toBe('en');
    expect(resolveLocaleFromPathname('/en/projects/aira')).toBe('en');
  });

  it('uses Korean for no-prefix paths and treats /ko as the default locale prefix', () => {
    expect(resolveLocaleFromPathname('/')).toBe('ko');
    expect(resolveLocaleFromPathname('/projects/aira')).toBe('ko');
    expect(resolveLocaleFromPathname('/ko/projects/aira')).toBe('ko');
  });

  it('does not treat en-like slugs as locale prefixes', () => {
    expect(resolveLocaleFromPathname('/energy')).toBe('ko');
    expect(resolveLocaleFromPathname('/enigma/projects')).toBe('ko');
  });
});

describe('stripLocalePathPrefix', () => {
  it('removes supported locale prefixes while preserving the rest of the path', () => {
    expect(stripLocalePathPrefix('/en')).toBe('/');
    expect(stripLocalePathPrefix('/en/projects/aira')).toBe('/projects/aira');
    expect(stripLocalePathPrefix('/ko/projects/aira')).toBe('/projects/aira');
  });

  it('preserves no-prefix paths unchanged', () => {
    expect(stripLocalePathPrefix('/projects/aira')).toBe('/projects/aira');
    expect(stripLocalePathPrefix('/')).toBe('/');
  });
});

describe('getLocalizedPathname', () => {
  it('keeps Korean URLs without a locale prefix', () => {
    expect(getLocalizedPathname('/en/projects/aira', 'ko')).toBe('/projects/aira');
    expect(getLocalizedPathname('/projects/aira', 'ko')).toBe('/projects/aira');
  });

  it('adds the /en prefix for English URLs', () => {
    expect(getLocalizedPathname('/projects/aira', 'en')).toBe('/en/projects/aira');
    expect(getLocalizedPathname('/en/projects/aira', 'en')).toBe('/en/projects/aira');
    expect(getLocalizedPathname('/', 'en')).toBe('/en');
  });
});
