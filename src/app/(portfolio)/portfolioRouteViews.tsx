import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import HomePage from '@/lib/components/HomePage';
import ProjectDetailPage from '@/lib/components/ProjectDetailPage';
import { applyProjectDetailContentOverride } from '@/lib/content/editableContent';
import { getProjectMetadata } from '@/lib/content/projects';
import { getProjectDetailBlocks } from '@/lib/content/projects/detailContent';
import { GITHUB_PROFILE, GITHUB_USERNAME, PORTFOLIO_URL } from '@/lib/data/constants';
import { canCurrentRequestWriteAdminContent } from '@/lib/server/adminRequest';
import { RESERVED_APPLICATION_SLUGS } from '@/lib/server/applicationLinks';
import { getActiveApplicationLinkBySlug } from '@/lib/server/applicationLinkStore';
import { getDb } from '@/lib/server/db';
import { getProjectDetailContentOverride } from '@/lib/server/editableContentStore';
import {
  getHomePageData,
  resolveHomeTailoredViewFromOverride,
  resolveHomeTailoredViewFromSearchParams,
} from '@/lib/server/homePageData';
import { getLocalizedPathname, type Language, SUPPORTED_LANGUAGES } from '@/lib/utils/language';
import { metadataMap } from '@/lib/utils/metadata';

type SearchParams = { [key: string]: string | string[] | undefined };

interface HomeRouteInput {
  locale: Language;
  searchParams: SearchParams;
}

interface ProjectRouteInput {
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
          alt: content.imageAlt || (locale === 'en' ? "Junwon Park's Portfolio" : '박준원의 포트폴리오'),
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

export const getProjectPageMetadata = ({ locale, slug }: ProjectRouteInput): Metadata => {
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

export async function renderHomeRoute({ locale, searchParams }: HomeRouteInput) {
  const db = getDb();
  const tailoredView = resolveHomeTailoredViewFromSearchParams(searchParams);
  const data = await getHomePageData({ db, locale, tailoredView });

  return <HomePage data={data} />;
}

export async function renderShortUrlRoute({ locale, slug }: ProjectRouteInput) {
  if (RESERVED_APPLICATION_SLUGS.has(slug.toLowerCase())) {
    notFound();
  }

  const db = getDb();
  if (!db) {
    notFound();
  }

  const applicationLink = await getActiveApplicationLinkBySlug(db, slug);

  if (!applicationLink) {
    notFound();
  }

  const tailoredView = resolveHomeTailoredViewFromOverride({
    projectIds: applicationLink.projectIds,
    role: applicationLink.role,
    summaryPreset: applicationLink.summaryPreset,
  });
  const data = await getHomePageData({ db, locale, tailoredView });

  return <HomePage data={data} />;
}

export async function renderProjectDetailRoute({ locale, slug }: ProjectRouteInput) {
  const rawMetadata = getProjectMetadata(slug, locale);
  const detailBlocks = getProjectDetailBlocks(slug, locale);

  if (!rawMetadata || !detailBlocks) {
    notFound();
  }

  const db = getDb();
  const [projectContentOverrideByLocaleEntries, isAdminEditor] = await Promise.all([
    Promise.all(
      SUPPORTED_LANGUAGES.map(async (targetLocale) => [
        targetLocale,
        await getProjectDetailContentOverride(db, slug, targetLocale),
      ] as const),
    ),
    canCurrentRequestWriteAdminContent(),
  ]);
  const projectContentOverrideByLocale = Object.fromEntries(projectContentOverrideByLocaleEntries);

  const normalizeMetadata = (metadata: typeof rawMetadata) => ({
    ...metadata,
    githubLink:
      metadata.githubLink && !metadata.githubLink.startsWith('http')
        ? `${GITHUB_PROFILE}/${metadata.githubLink}`
        : metadata.githubLink,
  });
  const projectContentByLocale = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((targetLocale) => {
      const localizedMetadata = getProjectMetadata(slug, targetLocale) ?? rawMetadata;
      const localizedBlocks = getProjectDetailBlocks(slug, targetLocale) ?? detailBlocks;
      const localizedProjectContent = applyProjectDetailContentOverride(
        {
          blocks: localizedBlocks,
          metadata: localizedMetadata,
        },
        projectContentOverrideByLocale[targetLocale],
      );

      return [
        targetLocale,
        {
          blocks: localizedProjectContent.blocks,
          metadata: normalizeMetadata(localizedProjectContent.metadata),
        },
      ];
    }),
  );
  const projectContent = projectContentByLocale[locale];

  return (
    <ProjectDetailPage
      slug={slug}
      locale={locale}
      metadata={projectContent.metadata}
      detailBlocks={projectContent.blocks}
      projectContentByLocale={{
        en: {
          detailBlocks: projectContentByLocale.en.blocks,
          metadata: projectContentByLocale.en.metadata,
        },
        ko: {
          detailBlocks: projectContentByLocale.ko.blocks,
          metadata: projectContentByLocale.ko.metadata,
        },
      }}
      isAdminEditor={isAdminEditor}
    />
  );
}
