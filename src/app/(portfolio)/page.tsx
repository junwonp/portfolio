import { headers } from 'next/headers';

import HomePage from '@/lib/components/HomePage';
import { applyHomeContentOverride } from '@/lib/content/editableContent';
import { getLabels } from '@/lib/data/labels';
import type { TailoredViewOverride } from '@/lib/data/resume';
import { getFeaturedWebProjects, getResumeData, getSummaryIntroduction } from '@/lib/data/resume';
import { resolveRolePreset, resolveSummaryPreset } from '@/lib/data/resume';
import { canCurrentRequestWriteAdminContent } from '@/lib/server/adminRequest';
import { getDb } from '@/lib/server/db';
import { getPublishedHomeOverride } from '@/lib/server/editableContentStore';
import { isValidLanguage } from '@/lib/utils/language';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const headersList = await headers();
  const localeHeader = headersList.get('x-locale');
  const locale = isValidLanguage(localeHeader) ? localeHeader : 'ko';

  const db = getDb();
  const homeContentOverride = await getPublishedHomeOverride(db, locale);
  const isAdminEditor = await canCurrentRequestWriteAdminContent();
  const labels = getLabels(locale);

  const tailoredView: TailoredViewOverride = {};

  const roleParam = resolvedParams.role ?? resolvedParams.v;
  if (typeof roleParam === 'string') {
    tailoredView.role = resolveRolePreset(roleParam);
  }

  const pParam = resolvedParams.p;
  if (typeof pParam === 'string') {
    tailoredView.projectIds = pParam.split(',');
  } else if (Array.isArray(pParam)) {
    tailoredView.projectIds = pParam.filter((item): item is string => typeof item === 'string');
  }

  const presetParam = resolvedParams.preset;
  if (typeof presetParam === 'string') {
    tailoredView.summaryPreset = resolveSummaryPreset(presetParam);
  }

  const resumeData = applyHomeContentOverride(
    getResumeData(locale),
    homeContentOverride,
  );
  const featuredWebProjects = getFeaturedWebProjects(locale, tailoredView.projectIds ?? []);
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
