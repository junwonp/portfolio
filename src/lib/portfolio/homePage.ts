import type { HomePageData } from '@/components/portfolio/home/HomePage';
import { PROJECT_ID, type ProjectId } from '@/lib/portfolio/catalog';
import { getLabels } from '@/lib/portfolio/labels';
import type { TailoredViewOverride } from '@/lib/portfolio/resume';
import type { SummaryPresetId } from '@/lib/portfolio/resume';
import {
  getFeaturedWebProjects,
  getResumeData,
  getSummaryIntroduction,
  resolveTailoredView,
} from '@/lib/portfolio/resume';
import type { Language } from '@/lib/utils/language';

export type PageSearchParamsRecord = Record<string, string | string[] | undefined>;

interface ResolvedHomeTailoredView {
  projectIds: string[];
  summaryPreset: SummaryPresetId;
}

interface CreateHomePageDataInput {
  locale: Language;
  tailoredView: ResolvedHomeTailoredView;
}

export const defaultSelectedProjectIds: readonly ProjectId[] = [
  PROJECT_ID.aira,
  PROJECT_ID.todayWeather,
  PROJECT_ID.nextjsPortfolio,
  PROJECT_ID.kftcPlatform,
];

const getParamValues = (searchParams: PageSearchParamsRecord, key: string): string[] => {
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

export const toHomeUrlSearchParams = (searchParams: PageSearchParamsRecord): URLSearchParams => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === 'string') {
      params.append(key, value);
    } else if (Array.isArray(value)) {
      appendValues(
        params,
        key,
        value.filter((item): item is string => typeof item === 'string'),
      );
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
  locale,
  tailoredView,
}: CreateHomePageDataInput): HomePageData => {
  const labels = getLabels(locale);
  const resumeData = getResumeData(locale);
  const featuredProjectsMode = tailoredView.projectIds.length > 0 ? 'role-fit' : 'selected';
  const featuredProjectIds =
    featuredProjectsMode === 'role-fit' ? tailoredView.projectIds : defaultSelectedProjectIds;
  const featuredWebProjects = getFeaturedWebProjects(locale, featuredProjectIds);
  const summaryIntroduction = getSummaryIntroduction(locale, tailoredView.summaryPreset);
  const navSections = [
    { id: 'section-intro', label: labels.sectionIntro },
    ...(featuredWebProjects.length > 0
      ? [
          {
            id: 'section-featured',
            label:
              featuredProjectsMode === 'role-fit'
                ? labels.sectionFeaturedProjects
                : labels.sectionSelectedProjects,
          },
        ]
      : []),
    { id: 'section-work', label: labels.sectionWork },
    { id: 'section-skills', label: labels.sectionSkills },
    { id: 'section-projects', label: labels.sectionAwards },
    { id: 'section-education', label: labels.sectionEducation },
  ];

  return {
    featuredProjectsMode,
    featuredWebProjects,
    labels,
    locale,
    navSections,
    resumeData,
    summaryIntroduction,
  };
};
