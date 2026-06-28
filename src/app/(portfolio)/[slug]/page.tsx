import { notFound } from 'next/navigation';

import HomePage from '@/lib/components/HomePage';
import type { ApplicationLinkRow } from '@/lib/server/applicationLinks';
import { RESERVED_APPLICATION_SLUGS, toApplicationLink } from '@/lib/server/applicationLinks';
import { getDb } from '@/lib/server/db';
import { getHomePageData, resolveHomeTailoredViewFromOverride } from '@/lib/server/homePageData';
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
  const tailoredView = resolveHomeTailoredViewFromOverride({
    projectIds: applicationLink.projectIds,
    role: applicationLink.role,
    summaryPreset: applicationLink.summaryPreset,
  });
  const data = await getHomePageData({ db, locale, tailoredView });

  return (
    <HomePage
      data={data}
    />
  );
}
