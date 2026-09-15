import { notFound, permanentRedirect } from 'next/navigation';

import { RESERVED_APPLICATION_SLUGS } from '@/lib/server/application-links/model';
import { getActiveApplicationLinkBySlug } from '@/lib/server/application-links/store';
import { getDb } from '@/lib/server/infrastructure/database';
import { getApplicationLinkPathname } from '@/lib/utils/applicationSlug';
import { getLocalizedPathname, isValidLanguage } from '@/lib/utils/language';

interface LegacyShortUrlPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

// Legacy root-level short links only need to keep resolving for URLs that were
// already submitted; they read the live D1 table, so never prerender.
export const dynamic = 'force-dynamic';

export default async function LegacyShortUrlPage({ params }: LegacyShortUrlPageProps) {
  const { locale, slug } = await params;

  if (!isValidLanguage(locale) || RESERVED_APPLICATION_SLUGS.has(slug.toLowerCase())) {
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

  permanentRedirect(getLocalizedPathname(getApplicationLinkPathname(slug), locale));
}
