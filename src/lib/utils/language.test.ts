import { describe, expect, it } from 'vitest';

import { detectLanguageFromHeader, isValidLanguage } from '$lib/utils/language';

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

describe('detectLanguageFromHeader', () => {
  describe('null / empty input', () => {
    it('returns "en" for null', () => {
      expect(detectLanguageFromHeader(null)).toBe('en');
    });

    it('returns "en" for empty string', () => {
      expect(detectLanguageFromHeader('')).toBe('en');
    });
  });

  describe('single language', () => {
    it('returns "ko" for "ko"', () => {
      expect(detectLanguageFromHeader('ko')).toBe('ko');
    });

    it('returns "ko" for "ko-KR"', () => {
      expect(detectLanguageFromHeader('ko-KR')).toBe('ko');
    });

    it('returns "en" for "en"', () => {
      expect(detectLanguageFromHeader('en')).toBe('en');
    });

    it('returns "en" for "en-US"', () => {
      expect(detectLanguageFromHeader('en-US')).toBe('en');
    });

    it('returns "en" for an unsupported language', () => {
      expect(detectLanguageFromHeader('fr')).toBe('en');
    });
  });

  describe('multiple languages with quality values', () => {
    it('returns "ko" when ko has the highest quality', () => {
      expect(detectLanguageFromHeader('ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7')).toBe('ko');
    });

    it('returns "ko" even when en has higher quality (ko is always preferred when present)', () => {
      expect(detectLanguageFromHeader('en-US;q=0.9,ko;q=0.8')).toBe('ko');
    });

    it('returns "ko" when ko appears with default quality (1.0)', () => {
      expect(detectLanguageFromHeader('ko,en;q=0.9')).toBe('ko');
    });

    it('returns "en" when no ko in the list', () => {
      expect(detectLanguageFromHeader('fr,de;q=0.9,en;q=0.8')).toBe('en');
    });
  });
});
