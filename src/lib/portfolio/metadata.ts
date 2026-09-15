import type { Metadata } from 'next';

import { GITHUB_USERNAME, PORTFOLIO_URL } from '@/config/site';
import { getProjectMetadata } from '@/lib/portfolio/catalog';
import { getLocalizedPathname, type Language } from '@/lib/utils/language';
import { metadataMap } from '@/lib/utils/metadata';

interface ProjectMetadataInput {
  locale: Language;
  slug: string;
}

const getAbsoluteUrl = (pathname: string, locale: Language): string =>
  new URL(getLocalizedPathname(pathname, locale), PORTFOLIO_URL).toString();

const getLanguageAlternates = (pathname: string) => ({
  'ko-KR': getAbsoluteUrl(pathname, 'ko'),
  'en-US': getAbsoluteUrl(pathname, 'en'),
});

const getOgImagePath = (locale: Language): string =>
  locale === 'en' ? '/en/opengraph-image.png' : '/opengraph-image.png';

const getTwitterImagePath = (locale: Language): string =>
  locale === 'en' ? '/en/twitter-image.png' : '/twitter-image.png';

export const getHomeMetadata = (locale: Language): Metadata => {
  const content = metadataMap[locale];
  const canonical = getAbsoluteUrl('/', locale);
  const ogImageUrl = getOgImagePath(locale);
  const twitterImageUrl = getTwitterImagePath(locale);

  return {
    title: content.title,
    description: content.description,
    authors: [{ name: content.authorName }],
    alternates: {
      canonical,
      languages: getLanguageAlternates('/'),
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title: content.ogTitle,
      description: content.ogDescription,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          type: 'image/png',
          alt:
            content.imageAlt ||
            (locale === 'en' ? "Junwon Park's Portfolio" : '박준원의 포트폴리오'),
        },
      ],
      siteName: content.siteName,
      locale: content.locale,
    },
    twitter: {
      card: 'summary_large_image',
      title: content.twitterTitle,
      description: content.twitterDescription,
      images: [twitterImageUrl],
      site: `@${GITHUB_USERNAME}`,
    },
  };
};

// A short link serves the same tailored home view as its target, so only the
// indexing policy differs from the home page.
export const getShortUrlMetadata = (locale: Language): Metadata => ({
  ...getHomeMetadata(locale),
  robots: { index: false, follow: false },
});

const privacyMetadataCopy: Record<Language, { title: string; description: string }> = {
  en: {
    title: "Privacy Policy | Junwon's Portfolio",
    description: "Privacy Policy for Junwon's personal portfolio website.",
  },
  ko: {
    title: '개인정보 처리방침 | 박준원 포트폴리오',
    description: '박준원의 개인 포트폴리오 웹사이트 개인정보 처리방침입니다.',
  },
};

export const getPrivacyMetadata = (locale: Language): Metadata => {
  const copy = privacyMetadataCopy[locale];
  const content = metadataMap[locale];
  const pathname = '/privacy';
  const canonical = getAbsoluteUrl(pathname, locale);

  return {
    title: copy.title,
    description: copy.description,
    alternates: {
      canonical,
      languages: getLanguageAlternates(pathname),
    },
    openGraph: {
      type: 'website',
      url: canonical,
      title: copy.title,
      description: copy.description,
      siteName: content.siteName,
      locale: content.locale,
      images: [getOgImagePath(locale)],
    },
    twitter: {
      card: 'summary',
      title: copy.title,
      description: copy.description,
      images: [getTwitterImagePath(locale)],
    },
  };
};

export const getProjectPageMetadata = ({ locale, slug }: ProjectMetadataInput): Metadata => {
  const rawMetadata = getProjectMetadata(slug, locale);
  if (!rawMetadata) return {};

  const pathname = `/projects/${slug}`;
  const canonical = getAbsoluteUrl(pathname, locale);
  const content = metadataMap[locale];
  const title = `${rawMetadata.title || slug} | ${content.projectTitleSuffix}`;
  const description = rawMetadata.description || '';

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: getLanguageAlternates(pathname),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [rawMetadata.image ?? getOgImagePath(locale)],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [rawMetadata.image ?? getTwitterImagePath(locale)],
    },
  };
};
