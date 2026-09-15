import type { Metadata } from 'next';

import PrintableResume from '@/components/resume/PrintableResume';
import {
  getPrintableResume,
  parseResumeVariant,
  printableResume,
  resolveResumeVariant,
} from '@/content/printableResume';
import { getActiveApplicationLinkBySlug } from '@/lib/server/application-links/store';
import { getApplicationLinkUrl } from '@/lib/server/application-links/url';
import { getDb } from '@/lib/server/infrastructure/database';

const RESUME_URL = 'https://resume.junwon.dev';
const RESUME_TITLE = '박준원 이력서';
const RESUME_DESCRIPTION = '프론트엔드 개발자 박준원의 인쇄용 이력서입니다.';
const RESUME_PREVIEW_IMAGE = '/opengraph-image.png';

export const metadata: Metadata = {
  title: RESUME_TITLE,
  description: RESUME_DESCRIPTION,
  alternates: {
    canonical: RESUME_URL,
  },
  openGraph: {
    title: RESUME_TITLE,
    description: RESUME_DESCRIPTION,
    type: 'profile',
    url: RESUME_URL,
    images: [RESUME_PREVIEW_IMAGE],
  },
};

interface ResumePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ResumePage({ searchParams }: ResumePageProps) {
  const resolvedSearchParams = await searchParams;
  const slug =
    typeof resolvedSearchParams.slug === 'string' ? resolvedSearchParams.slug : undefined;
  const variantParam =
    typeof resolvedSearchParams.variant === 'string'
      ? resolvedSearchParams.variant
      : typeof resolvedSearchParams.type === 'string'
        ? resolvedSearchParams.type
        : undefined;

  // With a slug, render the resume variant matching the link's positioning and
  // embed the short portfolio URL so visits through it are attributed.
  // Alternatively, allow directly previewing variants via ?variant=web | ops-data | web-rn
  let resume = printableResume;

  if (slug) {
    const db = await getDb();
    if (db) {
      const link = await getActiveApplicationLinkBySlug(db, slug);
      if (link) {
        const variant = resolveResumeVariant(link.role, link.summaryPreset);
        resume = getPrintableResume(variant, getApplicationLinkUrl(slug));
      }
    }
  } else if (variantParam) {
    const directVariant = parseResumeVariant(variantParam);
    if (directVariant) {
      resume = getPrintableResume(directVariant);
    }
  }

  return <PrintableResume resume={resume} />;
}
