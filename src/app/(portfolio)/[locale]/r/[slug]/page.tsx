import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import HomePage from '@/components/portfolio/home/HomePage';
import { createHomePageData, resolveHomeTailoredViewFromOverride } from '@/lib/portfolio/homePage';
import { getShortUrlMetadata } from '@/lib/portfolio/metadata';
import { getActiveApplicationLinkBySlug } from '@/lib/server/application-links/store';
import { getDb } from '@/lib/server/infrastructure/database';
import { isValidLanguage } from '@/lib/utils/language';

interface ShortUrlPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Short links resolve against the live D1 table on every request; never prerender.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: ShortUrlPageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isValidLanguage(locale)) {
    notFound();
  }

  return getShortUrlMetadata(locale);
}

export default async function ShortUrlPage({ params }: ShortUrlPageProps) {
  const { locale, slug } = await params;

  if (!isValidLanguage(locale)) {
    notFound();
  }

  const db = await getDb();
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
  const data = createHomePageData({ locale, tailoredView });

  return <HomePage data={data} />;
}
