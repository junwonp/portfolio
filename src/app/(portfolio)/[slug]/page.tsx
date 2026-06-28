import { notFound } from 'next/navigation';

import HomePage from '@/lib/components/HomePage';
import { applyHomeContentOverride } from '@/lib/content/editableContent';
import { getLabels } from '@/lib/data/labels';
import { getFeaturedWebProjects, getResumeData, getSummaryIntroduction } from '@/lib/data/resume';
import { canCurrentRequestWriteAdminContent } from '@/lib/server/adminRequest';
import type { ApplicationLinkRow } from '@/lib/server/applicationLinks';
import { RESERVED_APPLICATION_SLUGS, toApplicationLink } from '@/lib/server/applicationLinks';
import { getDb } from '@/lib/server/db';
import { getPublishedHomeOverride } from '@/lib/server/editableContentStore';
import { getPortfolioLocale } from '@/lib/server/portfolioLocale';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ShortUrlPage({ params }: PageProps) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (RESERVED_APPLICATION_SLUGS.has(slug.toLowerCase())) {
    notFound();
  }

  const db = getDb();
  if (!db) {
    notFound();
  }

  const row = await db
    .prepare(
      `SELECT id, slug, label, company_name as company_name, role, summary_preset as summary_preset, project_ids as project_ids, expires_at, created_at
     FROM application_links
     WHERE slug = ? AND expires_at > datetime('now')
     LIMIT 1`,
    )
    .bind(slug)
    .first<ApplicationLinkRow>();

  if (!row) {
    notFound();
  }

  const applicationLink = toApplicationLink(row);

  const locale = await getPortfolioLocale();

  const homeContentOverride = await getPublishedHomeOverride(db, locale);
  const isAdminEditor = await canCurrentRequestWriteAdminContent();
  const labels = getLabels(locale);

  const tailoredView = {
    projectIds: applicationLink.projectIds,
    role: applicationLink.role,
    summaryPreset: applicationLink.summaryPreset,
  };
  const resumeData = applyHomeContentOverride(
    getResumeData(locale),
    homeContentOverride,
  );
  const featuredWebProjects = getFeaturedWebProjects(locale, tailoredView.projectIds);
  const summaryIntroduction = {
    ...getSummaryIntroduction(locale, tailoredView.summaryPreset),
    ...homeContentOverride?.introduction,
  };
  const navSections = [
    { id: 'section-intro', label: labels.sectionIntro },
    ...(featuredWebProjects.length > 0
      ? [{ id: 'section-featured', label: labels.sectionFeaturedProjects }]
      : []),
    { id: 'section-work', label: labels.sectionWork },
    { id: 'section-skills', label: labels.sectionSkills },
    { id: 'section-projects', label: labels.sectionAwards },
    { id: 'section-education', label: labels.sectionEducation },
  ];

  return (
    <HomePage
      data={{
        featuredWebProjects,
        homeContentOverride,
        isAdminEditor,
        labels,
        locale,
        navSections,
        resumeData,
        summaryIntroduction,
      }}
    />
  );
}
