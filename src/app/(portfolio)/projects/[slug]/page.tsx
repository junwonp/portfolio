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
  const [projectContentOverride, isAdminEditor] = await Promise.all([
    getProjectDetailContentOverride(db, slug, locale),
    canCurrentRequestWriteAdminContent(),
  ]);

  const projectContent = applyProjectDetailContentOverride(
    {
      blocks: detailBlocks,
      metadata: rawMetadata,
    },
    projectContentOverride,
  );

  const metadata = {
    ...projectContent.metadata,
    githubLink:
      projectContent.metadata.githubLink && !projectContent.metadata.githubLink.startsWith('http')
        ? `${GITHUB_PROFILE}/${projectContent.metadata.githubLink}`
        : projectContent.metadata.githubLink,
  };

  return (
    <ProjectDetailPage
      slug={slug}
      locale={locale}
      metadata={metadata}
      detailBlocks={projectContent.blocks}
      isAdminEditor={isAdminEditor}
    />
  );
}
