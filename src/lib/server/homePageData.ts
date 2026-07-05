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
import { type Language, SUPPORTED_LANGUAGES } from '@/lib/utils/language';

export type PageSearchParamsRecord = Record<string, string | string[] | undefined>;

interface ResolvedHomeTailoredView {
  projectIds: string[];
  summaryPreset: SummaryPresetId;
}

interface CreateHomePageDataInput {
  homeContentOverride: HomeContentOverride | null;
  homeContentOverrideByLocale?: Partial<Record<Language, HomeContentOverride | null>>;
  isAdminEditor: boolean;
  locale: Language;
  tailoredView: ResolvedHomeTailoredView;
}

interface GetHomePageDataInput {
  db: D1Database | undefined;
  locale: Language;
  tailoredView: ResolvedHomeTailoredView;
}

const defaultSelectedProjectIds = ['aira', 'today_weather', 'nextjs_portfolio', 'kftc_platform'];

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
  homeContentOverrideByLocale,
  isAdminEditor,
  locale,
  tailoredView,
}: CreateHomePageDataInput): HomePageData => {
  const labels = getLabels(locale);
  const resumeDataByLocale = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((targetLocale) => [
      targetLocale,
      applyHomeContentOverride(
        getResumeData(targetLocale),
        homeContentOverrideByLocale?.[targetLocale] ??
          (targetLocale === locale ? homeContentOverride : null),
      ),
    ]),
  ) as Record<Language, ReturnType<typeof getResumeData>>;
  const resumeData = resumeDataByLocale[locale];
  const featuredProjectsMode = tailoredView.projectIds.length > 0 ? 'role-fit' : 'selected';
  const featuredProjectIds =
    featuredProjectsMode === 'role-fit' ? tailoredView.projectIds : defaultSelectedProjectIds;
  const featuredWebProjects = getFeaturedWebProjects(locale, featuredProjectIds);
  const summaryIntroductionByLocale = Object.fromEntries(
    SUPPORTED_LANGUAGES.map((targetLocale) => [
      targetLocale,
      {
        ...getSummaryIntroduction(targetLocale, tailoredView.summaryPreset),
        ...homeContentOverrideByLocale?.[targetLocale]?.introduction,
        ...(targetLocale === locale ? homeContentOverride?.introduction : undefined),
      },
    ]),
  ) as Record<Language, ReturnType<typeof getSummaryIntroduction>>;
  const summaryIntroduction = summaryIntroductionByLocale[locale];
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
    homeContentOverride,
    isAdminEditor,
    labels,
    locale,
    navSections,
    resumeData,
    resumeDataByLocale,
    summaryIntroduction,
    summaryIntroductionByLocale,
  };
};

export const getHomePageData = async ({
  db,
  locale,
  tailoredView,
}: GetHomePageDataInput): Promise<HomePageData> => {
  const [homeContentOverrideByLocaleEntries, isAdminEditor] = await Promise.all([
    Promise.all(
      SUPPORTED_LANGUAGES.map(async (targetLocale) => [
        targetLocale,
        await getPublishedHomeOverride(db, targetLocale),
      ] as const),
    ),
    canCurrentRequestWriteAdminContent(),
  ]);
  const homeContentOverrideByLocale = Object.fromEntries(
    homeContentOverrideByLocaleEntries,
  ) as Record<Language, HomeContentOverride | null>;
  const homeContentOverride = homeContentOverrideByLocale[locale];

  return createHomePageData({
    homeContentOverride,
    homeContentOverrideByLocale,
    isAdminEditor,
    locale,
    tailoredView,
  });
};
