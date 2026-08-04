import type { ProfileData } from '@/content/home';
import { credentials } from '@/content/home';
import { defaultProfile, profilePresets } from '@/content/home';
import {
  careerCatalog,
  getProjectsByCareerId,
  getProjectsBySection,
  normalizeProjectIdentifiers,
  PROJECT_ID,
  projectCatalog,
} from '@/lib/portfolio/catalog';
import type {
  ArchiveProps,
  CertificateProps,
  EducationProps,
  IntroductionProps,
  OtherExperienceProps,
  ProjectItem,
  SkillProps,
  WorkExperienceProps,
} from '@/lib/portfolio/homeTypes';
import { skillGroupTitles } from '@/lib/portfolio/skills';
import { skillsShared } from '@/lib/portfolio/skills';
import type { ProjectContentEntry, ProjectId } from '@/lib/portfolio/types';
import { getLocalizedPathname, type Language } from '@/lib/utils/language';

export const summaryPresetIds = ['default', 'ops-data', 'web', 'rn', 'web-rn', 'ai'] as const;

export type SummaryPresetId = (typeof summaryPresetIds)[number];

type SummaryPresetSource = Pick<ProfileData, 'metrics' | 'pillars' | 'tagline'>;
type SummaryPillar = NonNullable<IntroductionProps['pillars']>[number];
type NonEmptySummaryPillars = [SummaryPillar, ...SummaryPillar[]];

export type SummaryPresetMetadata = {
  metrics?: IntroductionProps['metrics'];
  pillars: NonEmptySummaryPillars;
  tagline: string;
};

export const rolePresetIds = ['web', 'mobile', 'ai'] as const;

export type RolePresetId = (typeof rolePresetIds)[number];

const summaryPresetAliases: Partial<Record<string, SummaryPresetId>> = {
  opsData: 'ops-data',
  webRn: 'web-rn',
};

const rolePresetAliases: Partial<Record<string, RolePresetId>> = {
  aiFrontend: 'ai',
  frontend: 'web',
  mobileFrontend: 'mobile',
  reactNative: 'mobile',
  rn: 'mobile',
  webFrontend: 'web',
};

export const rolePresets: Record<
  RolePresetId,
  { projectIds: readonly ProjectId[]; summary: SummaryPresetId }
> = {
  web: {
    summary: 'web',
    projectIds: [
      PROJECT_ID.camerafiStudio,
      PROJECT_ID.todayWeather,
      PROJECT_ID.webViewer,
      PROJECT_ID.adminDashboard,
    ],
  },
  mobile: {
    summary: 'rn',
    projectIds: [
      PROJECT_ID.aira,
      PROJECT_ID.onelineBank,
      PROJECT_ID.todayWeather,
      PROJECT_ID.dayPlanner,
    ],
  },
  ai: {
    summary: 'ai',
    projectIds: [
      PROJECT_ID.aira,
      PROJECT_ID.nextjsPortfolio,
      PROJECT_ID.agenticWorkflow,
      PROJECT_ID.todayWeather,
    ],
  },
};

const hasNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const isSummaryPillar = (value: unknown): value is SummaryPillar => {
  if (typeof value !== 'object' || value === null) return false;

  const pillar = value as Partial<SummaryPillar>;

  return (
    hasNonEmptyString(pillar.description) &&
    hasNonEmptyString(pillar.index) &&
    hasNonEmptyString(pillar.title)
  );
};

export const normalizeSummaryPresetMetadata = (
  source: SummaryPresetSource,
  locale: Language,
  preset: SummaryPresetId,
): SummaryPresetMetadata => {
  const sourceLabel = `${locale}/${preset}`;

  if (!hasNonEmptyString(source.tagline)) {
    throw new Error(`Invalid summary preset ${sourceLabel}: tagline must be a non-empty string.`);
  }

  if (!Array.isArray(source.pillars) || source.pillars.length === 0) {
    throw new Error(`Invalid summary preset ${sourceLabel}: pillars must be a non-empty array.`);
  }

  if (!source.pillars.every(isSummaryPillar)) {
    throw new Error(
      `Invalid summary preset ${sourceLabel}: every pillar needs a non-empty index, title, and description.`,
    );
  }

  return {
    ...source,
    pillars: source.pillars as NonEmptySummaryPillars,
    tagline: source.tagline,
  };
};

export const summaryPresetMetadata: Record<
  Language,
  Record<SummaryPresetId, SummaryPresetMetadata>
> = {
  en: {
    default: normalizeSummaryPresetMetadata(defaultProfile.en, 'en', 'default'),
    'ops-data': normalizeSummaryPresetMetadata(profilePresets.en['ops-data'], 'en', 'ops-data'),
    web: normalizeSummaryPresetMetadata(profilePresets.en.web, 'en', 'web'),
    rn: normalizeSummaryPresetMetadata(profilePresets.en.rn, 'en', 'rn'),
    'web-rn': normalizeSummaryPresetMetadata(profilePresets.en['web-rn'], 'en', 'web-rn'),
    ai: normalizeSummaryPresetMetadata(profilePresets.en.ai, 'en', 'ai'),
  },
  ko: {
    default: normalizeSummaryPresetMetadata(defaultProfile.ko, 'ko', 'default'),
    'ops-data': normalizeSummaryPresetMetadata(profilePresets.ko['ops-data'], 'ko', 'ops-data'),
    web: normalizeSummaryPresetMetadata(profilePresets.ko.web, 'ko', 'web'),
    rn: normalizeSummaryPresetMetadata(profilePresets.ko.rn, 'ko', 'rn'),
    'web-rn': normalizeSummaryPresetMetadata(profilePresets.ko['web-rn'], 'ko', 'web-rn'),
    ai: normalizeSummaryPresetMetadata(profilePresets.ko.ai, 'ko', 'ai'),
  },
};

export const resolveSummaryPreset = (value: string | null): SummaryPresetId => {
  if (!value) return 'default';
  const normalized = summaryPresetAliases[value] ?? value;

  return summaryPresetIds.includes(normalized as SummaryPresetId)
    ? (normalized as SummaryPresetId)
    : 'default';
};

export const resolveRolePreset = (value: string | null): RolePresetId | null => {
  if (!value) return null;
  const normalized = rolePresetAliases[value] ?? value;

  return rolePresetIds.includes(normalized as RolePresetId) ? (normalized as RolePresetId) : null;
};

export interface TailoredViewOverride {
  projectIds?: string[];
  role?: RolePresetId | null;
  summaryPreset?: SummaryPresetId;
}

export const resolveTailoredView = (
  searchParams: URLSearchParams,
  override?: TailoredViewOverride | null,
): { projectIds: string[]; summaryPreset: SummaryPresetId } => {
  const rolePreset = resolveRolePreset(searchParams.get('role'));
  const overrideRoleConfig = override?.role ? rolePresets[override.role] : null;
  const roleConfig = rolePreset
    ? rolePresets[rolePreset]
    : (overrideRoleConfig ?? (override?.role ? rolePresets[override.role] : null));
  const explicitProjectIds = resolveFeaturedProjectIds(searchParams);
  const hasSummaryParam = searchParams.has('summary');

  return {
    projectIds:
      explicitProjectIds.length > 0
        ? explicitProjectIds
        : [...(override?.projectIds ?? roleConfig?.projectIds ?? [])],
    summaryPreset: hasSummaryParam
      ? resolveSummaryPreset(searchParams.get('summary'))
      : (override?.summaryPreset ?? roleConfig?.summary ?? 'default'),
  };
};

export interface ResumeData {
  archives: ArchiveProps[];
  certificates: CertificateProps[];
  education: EducationProps[];
  introduction: IntroductionProps;
  otherExperiences: OtherExperienceProps[];
  skills: SkillProps[];
  workExperiences: WorkExperienceProps[];
}

const getProjectThumbnailAlt = (
  title: string,
  kind: 'icon' | 'screenshot',
  lang: Language,
): string => {
  if (kind === 'icon') {
    return lang === 'ko' ? `${title} 아이콘` : `${title} icon`;
  }

  return lang === 'ko' ? `${title} 대표 화면` : `${title} preview`;
};

const toResumeProject = (project: ProjectContentEntry, lang: Language): ProjectItem => {
  const content = project.content[lang];
  const getValidImage = (src: string | null | undefined): string | undefined => {
    if (!src || src === 'null' || src === null) return undefined;
    return src;
  };

  const iconSrc = getValidImage(project.icon);
  const imageSrc = getValidImage(content.detailMetadata?.image);
  const thumbnailSrc = iconSrc ?? imageSrc;

  const thumbnailKind: NonNullable<ProjectItem['thumbnail']>['kind'] = iconSrc
    ? 'icon'
    : 'screenshot';

  const thumbnail = thumbnailSrc
    ? {
        src: thumbnailSrc,
        alt: getProjectThumbnailAlt(content.title, thumbnailKind, lang),
        kind: thumbnailKind,
      }
    : undefined;

  return {
    dateFrom: project.dateFrom ?? '',
    dateTo: project.dateTo,
    detailLink: project.detailPath ? getLocalizedPathname(project.detailPath, lang) : undefined,
    featuredSkills: project.featuredSkills,
    id: project.id,
    skills: project.skills,
    description: content.description,
    detail: content.summaryDetails,
    thumbnail,
    title: content.title,
    metrics: content.metrics,
  };
};

const toIntroduction = (metadata: ProfileData): IntroductionProps => ({
  focusKeywords: metadata.focusKeywords ?? [],
  githubLink: metadata.githubLink ?? '',
  linkedinLink: metadata.linkedinLink ?? '',
  metrics: metadata.metrics,
  name: metadata.name ?? '',
  pillars: metadata.pillars,
  role: metadata.role ?? '',
  tagline: metadata.tagline ?? '',
});

const introductions: Record<Language, IntroductionProps> = {
  en: toIntroduction(defaultProfile.en),
  ko: toIntroduction(defaultProfile.ko),
};

export const getResumeData = (lang: Language): ResumeData => {
  const introduction = introductions[lang];

  const workExperiences: WorkExperienceProps[] = careerCatalog.map((career) => {
    const content = career.content[lang];

    return {
      additional: content.additional,
      companyName: content.companyName,
      dateFrom: content.dateFrom,
      dateTo: content.dateTo,
      highlights: content.highlights,
      id: career.id,
      project: getProjectsByCareerId(career.id).map((project) => toResumeProject(project, lang)),
      role: content.role,
      titleBadge: content.titleBadge,
    };
  });

  const otherExperiences: OtherExperienceProps[] = getProjectsBySection('other').map((project) => {
    const content = project.content[lang];

    return {
      titleBadge: content.titleBadge,
      project: [toResumeProject(project, lang)],
    };
  });

  const archives: ArchiveProps[] = getProjectsBySection('archive').map((project) => ({
    project: [toResumeProject(project, lang)],
  }));

  const certificates: CertificateProps[] = credentials.certificates.map((certificate) => ({
    label: certificate.content[lang].label,
    link: certificate.link,
  }));

  const education: EducationProps[] = credentials.education.map((item) => ({
    ...item.content[lang],
    dateFrom: item.dateFrom,
    dateTo: item.dateTo,
  }));

  const skills: SkillProps[] = skillsShared.map((skill) => ({
    id: skill.id,
    title: skillGroupTitles[lang][skill.id],
    detailLink: undefined,
    list: [...skill.list],
  }));

  return {
    introduction,
    workExperiences,
    otherExperiences,
    archives,
    certificates,
    education,
    skills,
  };
};

export const getSummaryIntroduction = (
  lang: Language,
  preset: SummaryPresetId = 'default',
): IntroductionProps => {
  return {
    ...introductions[lang],
    ...summaryPresetMetadata[lang][preset],
  };
};

export const resolveFeaturedProjectIds = (searchParams: URLSearchParams): string[] => {
  const values = [
    ...searchParams.getAll('projects'),
    ...searchParams.getAll('projectIds'),
    ...searchParams.getAll('projectId'),
  ];

  const ids = values.flatMap((value) =>
    value
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean),
  );

  return Array.from(new Set(ids));
};

export const getFeaturedWebProjects = (
  lang: Language,
  projectIds: readonly string[] = [],
): OtherExperienceProps[] => {
  if (projectIds.length === 0) return [];

  const resumeData = getResumeData(lang);
  const projects = [
    ...resumeData.workExperiences.flatMap((exp) => exp.project),
    ...resumeData.otherExperiences.flatMap((exp) => exp.project),
    ...resumeData.archives.flatMap((exp) => exp.project),
    ...projectCatalog.flatMap((project) =>
      project.section === 'standalone' ? [toResumeProject(project, lang)] : []
    ),
  ];

  return normalizeProjectIdentifiers(projectIds).flatMap((id) => {
    const project = projects.find((item) => item.id === id);
    if (!project) return [];

    return [{ project: [project] }];
  });
};
