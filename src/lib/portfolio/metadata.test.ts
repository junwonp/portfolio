import { describe, expect, it } from 'vitest';

import {
  getHomeMetadata,
  getProjectPageMetadata,
  getShortUrlMetadata,
} from '@/lib/portfolio/metadata';

describe('portfolio metadata', () => {
  it('keeps Korean canonical URLs prefixless and English URLs under /en', () => {
    const korean = getHomeMetadata('ko');
    const english = getHomeMetadata('en');

    expect(korean.alternates?.canonical).toBe('https://junwon.dev/');
    expect(english.alternates?.canonical).toBe('https://junwon.dev/en');
    expect(korean.alternates?.languages).toEqual({
      'en-US': 'https://junwon.dev/en',
      'ko-KR': 'https://junwon.dev/',
    });
  });

  it('builds locale-aware project canonical and language alternate URLs', () => {
    const metadata = getProjectPageMetadata({ locale: 'en', slug: 'aira' });

    expect(metadata.alternates?.canonical).toBe('https://junwon.dev/en/projects/aira');
    expect(metadata.alternates?.languages).toEqual({
      'en-US': 'https://junwon.dev/en/projects/aira',
      'ko-KR': 'https://junwon.dev/projects/aira',
    });
  });

  it('gives short links the home title while keeping them out of the index', () => {
    const korean = getShortUrlMetadata('ko');
    const english = getShortUrlMetadata('en');

    expect(korean.title).toBe('박준원 | 프로필');
    expect(korean.alternates?.canonical).toBe('https://junwon.dev/');
    expect(english.title).toBe('Junwon Park | Profile');
    expect(korean.robots).toEqual({ index: false, follow: false });
    expect(english.robots).toEqual({ index: false, follow: false });
  });
});
