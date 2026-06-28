import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProjectDetailPage from '@/lib/components/ProjectDetailPage';
import { getProjectMetadata } from '@/lib/content/projects';
import { projectMdxMap } from '@/lib/content/projects/detailMdx';
import { GITHUB_PROFILE } from '@/lib/data/constants';
import { getDb } from '@/lib/server/db';
import { getProjectTechStackOverride } from '@/lib/server/editableContentStore';
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
  const mdxComponent = projectMdxMap[slug]?.[locale];

  if (!rawMetadata || !mdxComponent) {
    notFound();
  }

  const db = getDb();
  const techStackOverride = await getProjectTechStackOverride(db, slug, locale);

  const metadata = {
    ...rawMetadata,
    githubLink:
      rawMetadata.githubLink && !rawMetadata.githubLink.startsWith('http')
        ? `${GITHUB_PROFILE}/${rawMetadata.githubLink}`
        : rawMetadata.githubLink,
    techStack: techStackOverride ?? rawMetadata.techStack,
  };

  const MdxComponent = mdxComponent;

  return (
    <ProjectDetailPage slug={slug} locale={locale} metadata={metadata}>
      {MdxComponent ? <MdxComponent metadata={metadata} locale={locale} /> : null}
    </ProjectDetailPage>
  );
}
