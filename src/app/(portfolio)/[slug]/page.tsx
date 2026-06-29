import { notFound } from 'next/navigation';

import HomePage from '@/lib/components/HomePage';
import { RESERVED_APPLICATION_SLUGS } from '@/lib/server/applicationLinks';
import { getActiveApplicationLinkBySlug } from '@/lib/server/applicationLinkStore';
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

  const applicationLink = await getActiveApplicationLinkBySlug(db, slug);

  if (!applicationLink) {
    notFound();
  }

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
