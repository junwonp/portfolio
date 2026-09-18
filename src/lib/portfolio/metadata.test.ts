import { describe, expect, it } from 'vitest';

import {
  getHomeMetadata,
  getPrivacyMetadata,
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

  it('keeps the home page open graph and twitter copy in both locales', () => {
    const korean = getHomeMetadata('ko');
    const english = getHomeMetadata('en');

    expect(korean.title).toBe('박준원 | 프로필');
    expect(korean.description).toContain('프론트엔드 개발자 박준원');
    expect(korean.authors).toEqual([{ name: '박준원' }]);
    expect(korean.openGraph).toMatchObject({
      type: 'website',
      url: 'https://junwon.dev/',
      title: '박준원 | 프로필',
      description: expect.stringContaining('프론트엔드 개발자 박준원'),
      siteName: '박준원 | 프로필',
      locale: 'ko_KR',
    });
    expect(korean.twitter).toMatchObject({
      card: 'summary_large_image',
      title: '박준원 | 프로필',
      site: '@junwonp',
    });

    expect(english.title).toBe('Junwon Park | Profile');
    expect(english.authors).toEqual([{ name: 'Junwon Park' }]);
    expect(english.openGraph).toMatchObject({
      type: 'website',
      url: 'https://junwon.dev/en',
      description: expect.stringContaining('Frontend developer Junwon Park'),
      siteName: 'Junwon Park | Profile',
      locale: 'en_US',
    });
    expect(english.twitter).toMatchObject({
      card: 'summary_large_image',
      title: 'Junwon Park | Profile',
      site: '@junwonp',
    });
  });

  it('builds locale-aware home preview images from the localized paths', () => {
    expect(getHomeMetadata('ko').openGraph?.images).toEqual([
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: '박준원 - 프론트엔드 개발자 프로필',
      },
    ]);
    expect(getHomeMetadata('en').openGraph?.images).toEqual([
      {
        url: '/en/opengraph-image.png',
        width: 1200,
        height: 630,
        type: 'image/png',
        alt: 'Junwon Park - Frontend Developer Profile',
      },
    ]);
    expect(getHomeMetadata('ko').twitter?.images).toEqual(['/twitter-image.png']);
    expect(getHomeMetadata('en').twitter?.images).toEqual(['/en/twitter-image.png']);
  });

  it('keeps the privacy policy copy and canonical URLs per locale', () => {
    const korean = getPrivacyMetadata('ko');
    const english = getPrivacyMetadata('en');

    expect(korean.title).toBe('개인정보 처리방침 | 박준원 포트폴리오');
    expect(korean.description).toBe('박준원의 개인 포트폴리오 웹사이트 개인정보 처리방침입니다.');
    expect(korean.alternates).toEqual({
      canonical: 'https://junwon.dev/privacy',
      languages: {
        'en-US': 'https://junwon.dev/en/privacy',
        'ko-KR': 'https://junwon.dev/privacy',
      },
    });
    expect(korean.openGraph).toMatchObject({
      type: 'website',
      url: 'https://junwon.dev/privacy',
      title: '개인정보 처리방침 | 박준원 포트폴리오',
      description: '박준원의 개인 포트폴리오 웹사이트 개인정보 처리방침입니다.',
      siteName: '박준원 | 프로필',
      locale: 'ko_KR',
      images: ['/opengraph-image.png'],
    });
    expect(korean.twitter).toEqual({
      card: 'summary',
      title: '개인정보 처리방침 | 박준원 포트폴리오',
      description: '박준원의 개인 포트폴리오 웹사이트 개인정보 처리방침입니다.',
      images: ['/twitter-image.png'],
    });

    expect(english.title).toBe("Privacy Policy | Junwon's Portfolio");
    expect(english.description).toBe("Privacy Policy for Junwon's personal portfolio website.");
    expect(english.alternates).toEqual({
      canonical: 'https://junwon.dev/en/privacy',
      languages: {
        'en-US': 'https://junwon.dev/en/privacy',
        'ko-KR': 'https://junwon.dev/privacy',
      },
    });
    expect(english.openGraph).toMatchObject({
      type: 'website',
      url: 'https://junwon.dev/en/privacy',
      title: "Privacy Policy | Junwon's Portfolio",
      description: "Privacy Policy for Junwon's personal portfolio website.",
      siteName: 'Junwon Park | Profile',
      locale: 'en_US',
      images: ['/en/opengraph-image.png'],
    });
    expect(english.twitter).toEqual({
      card: 'summary',
      title: "Privacy Policy | Junwon's Portfolio",
      description: "Privacy Policy for Junwon's personal portfolio website.",
      images: ['/en/twitter-image.png'],
    });
  });

  it('prefers the project preview image for open graph and twitter when provided', () => {
    const metadata = getProjectPageMetadata({ locale: 'en', slug: 'aira' });

    expect(metadata.title).toBe('aira | Project');
    expect(metadata.description).toContain('Global AI character chat platform');
    expect(metadata.openGraph).toEqual({
      title: 'aira | Project',
      description: expect.stringContaining('Global AI character chat platform'),
      url: 'https://junwon.dev/en/projects/aira',
      images: ['/images/aira/v2_main.webp'],
    });
    expect(metadata.twitter).toEqual({
      card: 'summary_large_image',
      title: 'aira | Project',
      description: expect.stringContaining('Global AI character chat platform'),
      images: ['/images/aira/v2_main.webp'],
    });
  });

  it('falls back to the localized preview images when a project has no image', () => {
    const metadata = getProjectPageMetadata({ locale: 'en', slug: 'mnd-excel-viewer' });

    expect(metadata.title).toBe('Web-based Document Viewer | Project');
    expect(metadata.description).toBe('Spreadsheet and text viewer for large intranet documents');
    expect(metadata.alternates?.canonical).toBe('https://junwon.dev/en/projects/mnd-excel-viewer');
    expect(metadata.openGraph?.url).toBe('https://junwon.dev/en/projects/mnd-excel-viewer');
    expect(metadata.openGraph?.images).toEqual(['/en/opengraph-image.png']);
    expect(metadata.twitter?.images).toEqual(['/en/twitter-image.png']);
  });

  it('returns empty metadata for a slug that has no detail route', () => {
    expect(getProjectPageMetadata({ locale: 'en', slug: 'not-a-project' })).toEqual({});
    expect(getProjectPageMetadata({ locale: 'ko', slug: 'day-planner' })).toEqual({});
  });
});
