import { createElement } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import ProjectDetailPage from '@/components/portfolio/project-detail/ProjectDetailPage';
import { GITHUB_PROFILE } from '@/config/site';
import { getProjectDetailComponent } from '@/lib/portfolio/catalog';
import { getProjectMetadata } from '@/lib/portfolio/catalog';
import { getProjectPageMetadata } from '@/lib/portfolio/metadata';
import { isValidLanguage } from '@/lib/utils/language';

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isValidLanguage(locale)) {
    notFound();
  }

  return getProjectPageMetadata({ locale, slug });
}

export default async function ProjectDetail({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;

  if (!isValidLanguage(locale)) {
    notFound();
  }

  const rawMetadata = getProjectMetadata(slug, locale);
  const DetailMdx = getProjectDetailComponent(slug, locale);

  if (!rawMetadata || !DetailMdx) {
    notFound();
  }

  const metadata = {
    ...rawMetadata,
    githubLink:
      rawMetadata.githubLink && !rawMetadata.githubLink.startsWith('http')
        ? `${GITHUB_PROFILE}/${rawMetadata.githubLink}`
        : rawMetadata.githubLink,
  };
  const detailContent = createElement(DetailMdx, { locale, metadata });

  return (
    <ProjectDetailPage slug={slug} locale={locale} metadata={metadata}>
      {detailContent}
    </ProjectDetailPage>
  );
}
