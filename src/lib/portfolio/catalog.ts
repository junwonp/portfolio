import type { CareerCatalogEntry, CareerLocaleContent } from '@/content/home';
import { careerCatalog } from '@/content/home';
import AdminDashboardEn, {
  frontmatter as adminDashboardEnMetadata,
} from '@/content/projects/admin-dashboard/detail.en.mdx';
import AdminDashboardKo, {
  frontmatter as adminDashboardKoMetadata,
} from '@/content/projects/admin-dashboard/detail.ko.mdx';
import AgenticWorkflowEn, {
  frontmatter as agenticWorkflowEnMetadata,
} from '@/content/projects/agentic-workflow/detail.en.mdx';
import AgenticWorkflowKo, {
  frontmatter as agenticWorkflowKoMetadata,
} from '@/content/projects/agentic-workflow/detail.ko.mdx';
import AiraEn, { frontmatter as airaEnMetadata } from '@/content/projects/aira/detail.en.mdx';
import AiraKo, { frontmatter as airaKoMetadata } from '@/content/projects/aira/detail.ko.mdx';
import CamerafiStudioEn, {
  frontmatter as camerafiStudioEnMetadata,
} from '@/content/projects/camerafi-studio/detail.en.mdx';
import CamerafiStudioKo, {
  frontmatter as camerafiStudioKoMetadata,
} from '@/content/projects/camerafi-studio/detail.ko.mdx';
import CampusTownEn, {
  frontmatter as campusTownEnMetadata,
} from '@/content/projects/campus-town/detail.en.mdx';
import CampusTownKo, {
  frontmatter as campusTownKoMetadata,
} from '@/content/projects/campus-town/detail.ko.mdx';
import DayPlannerEn, {
  frontmatter as dayPlannerEnMetadata,
} from '@/content/projects/day-planner/detail.en.mdx';
import DayPlannerKo, {
  frontmatter as dayPlannerKoMetadata,
} from '@/content/projects/day-planner/detail.ko.mdx';
import ElectionAggregatorEn, {
  frontmatter as electionAggregatorEnMetadata,
} from '@/content/projects/election-aggregator/detail.en.mdx';
import ElectionAggregatorKo, {
  frontmatter as electionAggregatorKoMetadata,
} from '@/content/projects/election-aggregator/detail.ko.mdx';
import KftcPlatformEn, {
  frontmatter as kftcPlatformEnMetadata,
} from '@/content/projects/kftc-platform/detail.en.mdx';
import KftcPlatformKo, {
  frontmatter as kftcPlatformKoMetadata,
} from '@/content/projects/kftc-platform/detail.ko.mdx';
import MndDashboardEn, {
  frontmatter as mndDashboardEnMetadata,
} from '@/content/projects/mnd-dashboard/detail.en.mdx';
import MndDashboardKo, {
  frontmatter as mndDashboardKoMetadata,
} from '@/content/projects/mnd-dashboard/detail.ko.mdx';
import MndExcelViewerEn, {
  frontmatter as mndExcelViewerEnMetadata,
} from '@/content/projects/mnd-excel-viewer/detail.en.mdx';
import MndExcelViewerKo, {
  frontmatter as mndExcelViewerKoMetadata,
} from '@/content/projects/mnd-excel-viewer/detail.ko.mdx';
import NextjsPortfolioEn, {
  frontmatter as nextjsPortfolioEnMetadata,
} from '@/content/projects/nextjs-portfolio/detail.en.mdx';
import NextjsPortfolioKo, {
  frontmatter as nextjsPortfolioKoMetadata,
} from '@/content/projects/nextjs-portfolio/detail.ko.mdx';
import OnelineBankEn, {
  frontmatter as onelineBankEnMetadata,
} from '@/content/projects/oneline-bank/detail.en.mdx';
import OnelineBankKo, {
  frontmatter as onelineBankKoMetadata,
} from '@/content/projects/oneline-bank/detail.ko.mdx';
import TodayWeatherEn, {
  frontmatter as todayWeatherEnMetadata,
} from '@/content/projects/today-weather/detail.en.mdx';
import TodayWeatherKo, {
  frontmatter as todayWeatherKoMetadata,
} from '@/content/projects/today-weather/detail.ko.mdx';
import type { ProjectDetailMdxComponent } from '@/lib/portfolio/projectDetailMdx';
import type { PostMetadata } from '@/lib/portfolio/projectTypes';
import { isRegisteredSkillName } from '@/lib/portfolio/skills';
import type {
  CareerId,
  ProjectContentEntry,
  ProjectContentSection,
  ProjectId,
  ProjectLocaleContent,
} from '@/lib/portfolio/types';
import { CAREER_ID, PROJECT_ID } from '@/lib/portfolio/types';
import type { Language } from '@/lib/utils/language';

interface ProjectMdxModule {
  Component: ProjectDetailMdxComponent;
  frontmatter: PostMetadata;
}

export { CAREER_ID, careerCatalog, PROJECT_ID };
export type { CareerCatalogEntry, CareerId, CareerLocaleContent, ProjectId };

interface ProjectDefinition {
  careerId?: CareerId;
  content: Record<Language, ProjectMdxModule>;
  detailPath?: `/projects/${string}`;
  id: ProjectId;
  section: ProjectContentSection;
  slug: string;
}

const toLocaleContent = (module: ProjectMdxModule): ProjectLocaleContent => ({
  description: module.frontmatter.description ?? '',
  detailMetadata: module.frontmatter,
  metrics: module.frontmatter.metrics,
  summaryDetails: module.frontmatter.summaryDetails ?? [],
  title: module.frontmatter.title ?? '',
  titleBadge: module.frontmatter.titleBadge,
});

const projectDefinitions = [
  {
    careerId: CAREER_ID.orcaAi,
    content: {
      en: { Component: AiraEn, frontmatter: airaEnMetadata },
      ko: { Component: AiraKo, frontmatter: airaKoMetadata },
    },
    detailPath: '/projects/aira',
    id: PROJECT_ID.aira,
    section: 'work',
    slug: 'aira',
  },
  {
    careerId: CAREER_ID.vaultMicro,
    content: {
      en: { Component: CamerafiStudioEn, frontmatter: camerafiStudioEnMetadata },
      ko: { Component: CamerafiStudioKo, frontmatter: camerafiStudioKoMetadata },
    },
    detailPath: '/projects/camerafi-studio',
    id: PROJECT_ID.camerafiStudio,
    section: 'work',
    slug: 'camerafi-studio',
  },
  {
    careerId: CAREER_ID.vaultMicro,
    content: {
      en: { Component: AdminDashboardEn, frontmatter: adminDashboardEnMetadata },
      ko: { Component: AdminDashboardKo, frontmatter: adminDashboardKoMetadata },
    },
    detailPath: '/projects/admin-dashboard',
    id: PROJECT_ID.adminDashboard,
    section: 'work',
    slug: 'admin-dashboard',
  },
  {
    careerId: CAREER_ID.mnd,
    content: {
      en: { Component: MndExcelViewerEn, frontmatter: mndExcelViewerEnMetadata },
      ko: { Component: MndExcelViewerKo, frontmatter: mndExcelViewerKoMetadata },
    },
    detailPath: '/projects/mnd-excel-viewer',
    id: PROJECT_ID.webViewer,
    section: 'work',
    slug: 'mnd-excel-viewer',
  },
  {
    careerId: CAREER_ID.mnd,
    content: {
      en: { Component: MndDashboardEn, frontmatter: mndDashboardEnMetadata },
      ko: { Component: MndDashboardKo, frontmatter: mndDashboardKoMetadata },
    },
    id: PROJECT_ID.mndDashboard,
    section: 'work',
    slug: 'mnd-dashboard',
  },
  {
    content: {
      en: { Component: DayPlannerEn, frontmatter: dayPlannerEnMetadata },
      ko: { Component: DayPlannerKo, frontmatter: dayPlannerKoMetadata },
    },
    id: PROJECT_ID.dayPlanner,
    section: 'other',
    slug: 'day-planner',
  },
  {
    content: {
      en: { Component: TodayWeatherEn, frontmatter: todayWeatherEnMetadata },
      ko: { Component: TodayWeatherKo, frontmatter: todayWeatherKoMetadata },
    },
    detailPath: '/projects/today-weather',
    id: PROJECT_ID.todayWeather,
    section: 'other',
    slug: 'today-weather',
  },
  {
    content: {
      en: { Component: KftcPlatformEn, frontmatter: kftcPlatformEnMetadata },
      ko: { Component: KftcPlatformKo, frontmatter: kftcPlatformKoMetadata },
    },
    detailPath: '/projects/kftc-platform',
    id: PROJECT_ID.kftcPlatform,
    section: 'other',
    slug: 'kftc-platform',
  },
  {
    content: {
      en: { Component: NextjsPortfolioEn, frontmatter: nextjsPortfolioEnMetadata },
      ko: { Component: NextjsPortfolioKo, frontmatter: nextjsPortfolioKoMetadata },
    },
    detailPath: '/projects/nextjs-portfolio',
    id: PROJECT_ID.nextjsPortfolio,
    section: 'other',
    slug: 'nextjs-portfolio',
  },
  {
    content: {
      en: { Component: CampusTownEn, frontmatter: campusTownEnMetadata },
      ko: { Component: CampusTownKo, frontmatter: campusTownKoMetadata },
    },
    id: PROJECT_ID.campusTown,
    section: 'other',
    slug: 'campus-town',
  },
  {
    content: {
      en: { Component: ElectionAggregatorEn, frontmatter: electionAggregatorEnMetadata },
      ko: { Component: ElectionAggregatorKo, frontmatter: electionAggregatorKoMetadata },
    },
    detailPath: '/projects/election-aggregator',
    id: PROJECT_ID.electionAggregator,
    section: 'archive',
    slug: 'election-aggregator',
  },
  {
    content: {
      en: { Component: OnelineBankEn, frontmatter: onelineBankEnMetadata },
      ko: { Component: OnelineBankKo, frontmatter: onelineBankKoMetadata },
    },
    detailPath: '/projects/oneline-bank',
    id: PROJECT_ID.onelineBank,
    section: 'archive',
    slug: 'oneline-bank',
  },
  {
    content: {
      en: { Component: AgenticWorkflowEn, frontmatter: agenticWorkflowEnMetadata },
      ko: { Component: AgenticWorkflowKo, frontmatter: agenticWorkflowKoMetadata },
    },
    detailPath: '/projects/agentic-workflow',
    id: PROJECT_ID.agenticWorkflow,
    section: 'other',
    slug: 'agentic-workflow',
  },
] satisfies readonly ProjectDefinition[];

export const projectCatalog: ProjectContentEntry[] = projectDefinitions.map((definition) => {
  const koreanMetadata = definition.content.ko.frontmatter;

  return {
    careerId: definition.careerId,
    content: {
      en: toLocaleContent(definition.content.en),
      ko: toLocaleContent(definition.content.ko),
    },
    dateFrom: koreanMetadata.dateFrom,
    dateTo: koreanMetadata.dateTo,
    detailPath: definition.detailPath,
    featuredSkills: (koreanMetadata.featuredSkills ?? []).filter(isRegisteredSkillName),
    icon: koreanMetadata.icon,
    id: definition.id,
    paradigm: koreanMetadata.paradigm,
    section: definition.section,
    skills: (koreanMetadata.techStack ?? []).filter(isRegisteredSkillName),
    slug: definition.slug,
  };
});

export const resumeProjectCatalog = projectCatalog.filter(
  (project) => project.section !== 'standalone',
);

export const applicationProjectCatalog = resumeProjectCatalog;

export const detailProjectCatalog = projectCatalog.filter((project) => project.detailPath);

export const projectSlugs = projectCatalog.map((project) => project.slug);

export const detailProjectSlugs = detailProjectCatalog.map((project) => project.slug);

const toProjectIdentifierMap = (projects: ProjectContentEntry[]): Map<string, ProjectId> =>
  new Map<string, ProjectId>(
    projects.flatMap((project): [string, ProjectId][] => [
      [project.id, project.id],
      [project.slug, project.id],
    ]),
  );

const projectIdentifierToId = toProjectIdentifierMap(projectCatalog);

const applicationProjectIdentifierToId = toProjectIdentifierMap(applicationProjectCatalog);

const normalizeProjectIdentifiersWithMap = (
  identifiers: readonly string[],
  identifierToId: ReadonlyMap<string, ProjectId>,
): ProjectId[] =>
  Array.from(
    new Set(
      identifiers.flatMap((identifier) => {
        const projectId = identifierToId.get(identifier);

        return projectId ? [projectId] : [];
      }),
    ),
  );

export const resolveProjectIdentifier = (identifier: string): ProjectId | null =>
  projectIdentifierToId.get(identifier) ?? null;

export const normalizeProjectIdentifiers = (identifiers: readonly string[]): ProjectId[] =>
  normalizeProjectIdentifiersWithMap(identifiers, projectIdentifierToId);

export const normalizeApplicationProjectIdentifiers = (
  identifiers: readonly string[],
): ProjectId[] => normalizeProjectIdentifiersWithMap(identifiers, applicationProjectIdentifierToId);

export const getProjectBySlug = (slug: string): ProjectContentEntry | undefined =>
  projectCatalog.find((project) => project.slug === slug);

export const getProjectMetadata = (slug: string, locale: Language): PostMetadata | undefined => {
  const project = getProjectBySlug(slug);

  return project?.detailPath ? project.content[locale].detailMetadata : undefined;
};

export const getProjectDetailComponent = (
  slug: string,
  locale: Language,
): ProjectDetailMdxComponent | undefined => {
  const project = projectDefinitions.find((candidate) => candidate.slug === slug);

  return project?.detailPath ? project.content[locale].Component : undefined;
};

export const getProjectsBySection = (
  section: ProjectContentSection,
  careerId?: CareerId,
): ProjectContentEntry[] =>
  resumeProjectCatalog.filter(
    (project) => project.section === section && (!careerId || project.careerId === careerId),
  );

export const getProjectsByCareerId = (careerId: CareerId): ProjectContentEntry[] =>
  getProjectsBySection('work', careerId);
