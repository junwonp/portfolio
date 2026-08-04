import type { Metadata } from 'next';

import PrintablePortfolio from '@/components/print/PrintablePortfolio';
import { PORTFOLIO_URL } from '@/config/site';
import {
  applicationProjectCatalog,
  normalizeApplicationProjectIdentifiers,
} from '@/lib/portfolio/catalog';
import { defaultSelectedProjectIds } from '@/lib/portfolio/homePage';
import { type RolePresetId, rolePresets } from '@/lib/portfolio/resume';
import { getActiveApplicationLinkBySlug } from '@/lib/server/application-links/store';
import { getDb } from '@/lib/server/infrastructure/database';

export const metadata: Metadata = {
  title: '박준원 포트폴리오',
  description: '박준원 포트폴리오 PDF 안내 문서입니다.',
  robots: {
    index: false,
    follow: false,
  },
};

interface PrintPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function PrintPage({ searchParams }: PrintPageProps) {
  const resolvedSearchParams = await searchParams;
  const slug = typeof resolvedSearchParams.slug === 'string' ? resolvedSearchParams.slug : undefined;

  let projectIds: readonly string[] = defaultSelectedProjectIds;
  let companyName: string | undefined;
  let role: string | undefined;

  if (slug) {
    const db = getDb();
    if (db) {
      const link = await getActiveApplicationLinkBySlug(db, slug);
      if (link) {
        companyName = link.companyName;
        role = link.role ?? undefined;

        if (link.projectIds.length > 0) {
          projectIds = link.projectIds;
        } else if (link.role && link.role in rolePresets) {
          projectIds = rolePresets[link.role as RolePresetId].projectIds;
        }
      }
    }
  }

  const resolvedIds = normalizeApplicationProjectIdentifiers(projectIds);
  const projects = resolvedIds.flatMap((id) => {
    const entry = applicationProjectCatalog.find((p) => p.id === id);
    if (!entry) return [];

    const { title, description } = entry.content.ko;

    return [
      {
        title,
        description,
        skills: (entry.featuredSkills ?? entry.skills ?? []) as string[],
      },
    ];
  });

  const portfolioUrl = slug ? `${PORTFOLIO_URL}/${slug}` : PORTFOLIO_URL;

  return (
    <PrintablePortfolio
      projects={projects}
      companyName={companyName}
      role={role}
      portfolioUrl={portfolioUrl}
    />
  );
}
