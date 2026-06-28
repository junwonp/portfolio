import React from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from 'next/navigation';

import ProjectDetailPage from '@/lib/components/ProjectDetailPage';
import { getProjectMetadata } from '@/lib/content/projects';
import { GITHUB_PROFILE } from '@/lib/data/constants';
import { getDb } from '@/lib/server/db';
import { getProjectTechStackOverride } from '@/lib/server/editableContentStore';
import { getPortfolioLocale } from '@/lib/server/portfolioLocale';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const projectMdxMap: Record<string, Record<string, React.ComponentType<any>>> = {
  'agentic-workflow': {
    en: dynamic(() => import('@/lib/content/projects/agentic-workflow/detail.en.mdx')),
    ko: dynamic(() => import('@/lib/content/projects/agentic-workflow/detail.ko.mdx')),
  },
  aira: {
    en: dynamic(() => import('@/lib/content/projects/aira/detail.en.mdx')),
    ko: dynamic(() => import('@/lib/content/projects/aira/detail.ko.mdx')),
  },
  'camerafi-studio': {
    en: dynamic(() => import('@/lib/content/projects/camerafi-studio/detail.en.mdx')),
    ko: dynamic(() => import('@/lib/content/projects/camerafi-studio/detail.ko.mdx')),
  },
  'election-aggregator': {
    en: dynamic(() => import('@/lib/content/projects/election-aggregator/detail.en.mdx')),
    ko: dynamic(() => import('@/lib/content/projects/election-aggregator/detail.ko.mdx')),
  },
  'mnd-excel-viewer': {
    en: dynamic(() => import('@/lib/content/projects/mnd-excel-viewer/detail.en.mdx')),
    ko: dynamic(() => import('@/lib/content/projects/mnd-excel-viewer/detail.ko.mdx')),
  },
  'oneline-bank': {
    en: dynamic(() => import('@/lib/content/projects/oneline-bank/detail.en.mdx')),
    ko: dynamic(() => import('@/lib/content/projects/oneline-bank/detail.ko.mdx')),
  },
  'sveltekit-portfolio': {
    en: dynamic(() => import('@/lib/content/projects/sveltekit-portfolio/detail.en.mdx')),
    ko: dynamic(() => import('@/lib/content/projects/sveltekit-portfolio/detail.ko.mdx')),
  },
  'today-weather': {
    en: dynamic(() => import('@/lib/content/projects/today-weather/detail.en.mdx')),
    ko: dynamic(() => import('@/lib/content/projects/today-weather/detail.ko.mdx')),
  },
};

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
