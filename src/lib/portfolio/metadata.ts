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

export const getHomeMetadata = (locale: Language): Metadata => {
  const content = metadataMap[locale];
  const canonical = getAbsoluteUrl('/', locale);
  const ogImageUrl = locale === 'en' ? '/en/opengraph-image.png' : '/opengraph-image.png';
  const twitterImageUrl = locale === 'en' ? '/en/twitter-image.png' : '/twitter-image.png';

  return {
    title: content.title,
    description: content.description,
    authors: [{ name: 'Junwon Park' }],
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

export const getProjectPageMetadata = ({
  locale,
  slug,
}: ProjectMetadataInput): Metadata => {
  const rawMetadata = getProjectMetadata(slug, locale);
  if (!rawMetadata) return {};

  const pathname = `/projects/${slug}`;
  const canonical = getAbsoluteUrl(pathname, locale);
  const title = `${rawMetadata.title || slug} | Project`;
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
      images: rawMetadata.image ? [{ url: rawMetadata.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: rawMetadata.image ? [rawMetadata.image] : [],
    },
  };
};
