import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProjectDetailPage from '@/lib/components/ProjectDetailPage';
import { applyProjectDetailContentOverride } from '@/lib/content/editableContent';
import { getProjectMetadata } from '@/lib/content/projects';
import { getProjectDetailBlocks } from '@/lib/content/projects/detailContent';
import { GITHUB_PROFILE } from '@/lib/data/constants';
import { canCurrentRequestWriteAdminContent } from '@/lib/server/adminRequest';
import { getDb } from '@/lib/server/db';
import { getProjectDetailContentOverride } from '@/lib/server/editableContentStore';
import { getPortfolioLocale } from '@/lib/server/portfolioLocale';
import { SUPPORTED_LANGUAGES } from '@/lib/utils/language';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata dynamically
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getPortfolioLocale();

  const rawMetadata = getProjectMetadata(slug, locale);
  if (!rawMetadata) return {};

  const title = `${rawMetadata.title || slug} | Project`;
  const description = rawMetadata.description || '';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: rawMetadata.image ? [{ url: rawMetadata.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: rawMetadata.image ? [rawMetadata.image] : [],
    },
  };
}

export default async function ProjectDetail({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getPortfolioLocale();

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
