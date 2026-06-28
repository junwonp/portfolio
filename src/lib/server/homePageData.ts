import type { HomePageData } from '@/lib/components/HomePage';
import type { HomeContentOverride } from '@/lib/content/editableContent';
import { applyHomeContentOverride } from '@/lib/content/editableContent';
import { getLabels } from '@/lib/data/labels';
import type { TailoredViewOverride } from '@/lib/data/resume';
import type { SummaryPresetId } from '@/lib/data/resume';
import {
  getFeaturedWebProjects,
  getResumeData,
  getSummaryIntroduction,
  resolveTailoredView,
} from '@/lib/data/resume';
import { canCurrentRequestWriteAdminContent } from '@/lib/server/adminRequest';
import { getPublishedHomeOverride } from '@/lib/server/editableContentStore';
import type { Language } from '@/lib/utils/language';

export type PageSearchParamsRecord = Record<string, string | string[] | undefined>;

interface ResolvedHomeTailoredView {
  projectIds: string[];
  summaryPreset: SummaryPresetId;
}

interface CreateHomePageDataInput {
  homeContentOverride: HomeContentOverride | null;
  isAdminEditor: boolean;
  locale: Language;
  tailoredView: ResolvedHomeTailoredView;
}

interface GetHomePageDataInput {
  db: D1Database | undefined;
  locale: Language;
  tailoredView: ResolvedHomeTailoredView;
}

const getParamValues = (
  searchParams: PageSearchParamsRecord,
  key: string,
): string[] => {
  const value = searchParams[key];

  if (typeof value === 'string') {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string');
  }

  return [];
};

const appendValues = (params: URLSearchParams, key: string, values: string[]) => {
  for (const value of values) {
    params.append(key, value);
  }
};

const hasAnyParam = (searchParams: PageSearchParamsRecord, keys: string[]): boolean =>
  keys.some((key) => getParamValues(searchParams, key).length > 0);

export const toHomeUrlSearchParams = (
  searchParams: PageSearchParamsRecord,
): URLSearchParams => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      params.append(key, value);
    } else if (Array.isArray(value)) {
      appendValues(params, key, value.filter((item): item is string => typeof item === 'string'));
    }
  }

  if (!hasAnyParam(searchParams, ['role'])) {
    appendValues(params, 'role', getParamValues(searchParams, 'v'));
  }

  if (!hasAnyParam(searchParams, ['summary'])) {
    appendValues(params, 'summary', getParamValues(searchParams, 'preset'));
  }

  if (!hasAnyParam(searchParams, ['projects', 'projectIds', 'projectId'])) {
    appendValues(params, 'projects', getParamValues(searchParams, 'p'));
  }

  return params;
};

export const resolveHomeTailoredViewFromSearchParams = (
  searchParams: PageSearchParamsRecord,
): ResolvedHomeTailoredView => {
  return resolveTailoredView(toHomeUrlSearchParams(searchParams));
};

export const resolveHomeTailoredViewFromOverride = (
  override: TailoredViewOverride,
): ResolvedHomeTailoredView => {
  return resolveTailoredView(new URLSearchParams(), override);
};

export const createHomePageData = ({
  homeContentOverride,
  isAdminEditor,
  locale,
  tailoredView,
}: CreateHomePageDataInput): HomePageData => {
  const labels = getLabels(locale);
  const resumeData = applyHomeContentOverride(getResumeData(locale), homeContentOverride);
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

  return {
    featuredWebProjects,
    homeContentOverride,
    isAdminEditor,
    labels,
    locale,
    navSections,
    resumeData,
    summaryIntroduction,
  };
};

export const getHomePageData = async ({
  db,
  locale,
  tailoredView,
}: GetHomePageDataInput): Promise<HomePageData> => {
  const [homeContentOverride, isAdminEditor] = await Promise.all([
    getPublishedHomeOverride(db, locale),
    canCurrentRequestWriteAdminContent(),
  ]);

  return createHomePageData({
    homeContentOverride,
    isAdminEditor,
    locale,
    tailoredView,
  });
};
