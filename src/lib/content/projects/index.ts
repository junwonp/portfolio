import type { Language } from '@/lib/utils/language';

import { adminDashboardProject } from './admin-dashboard';
import { agenticWorkflowProject } from './agentic-workflow';
import { airaProject } from './aira';
import { camerafiStudioProject } from './camerafi-studio';
import { campusTownProject } from './campus-town';
import { dayPlannerProject } from './day-planner';
import { electionAggregatorProject } from './election-aggregator';
import { kftcPlatformProject } from './kftc-platform';
import { mndDashboardProject } from './mnd-dashboard';
import { mndExcelViewerProject } from './mnd-excel-viewer';
import { nextjsPortfolioProject } from './nextjs-portfolio';
import { onelineBankProject } from './oneline-bank';
import { todayWeatherProject } from './today-weather';
import type { ProjectContentEntry, ProjectContentSection } from './types';

export type { ProjectContentEntry, ProjectContentSection } from './types';
export { defineProject } from './types';

export const projectCatalog: ProjectContentEntry[] = [
  airaProject,
  camerafiStudioProject,
  adminDashboardProject,
  mndExcelViewerProject,
  mndDashboardProject,
  dayPlannerProject,
  todayWeatherProject,
  kftcPlatformProject,
  nextjsPortfolioProject,
  campusTownProject,
  electionAggregatorProject,
  onelineBankProject,
  agenticWorkflowProject,
];

export const resumeProjectCatalog = projectCatalog.filter(
  (project) => project.section !== 'standalone',
);

export const applicationProjectCatalog = resumeProjectCatalog;

export const detailProjectCatalog = projectCatalog.filter((project) => project.detailPath);

export const projectSlugs = projectCatalog.map((project) => project.slug);

export const detailProjectSlugs = detailProjectCatalog.map((project) => project.slug);

const toProjectIdentifierMap = (projects: ProjectContentEntry[]): Map<string, string> =>
  new Map(
    projects.flatMap((project) => [
      [project.id, project.id],
      [project.slug, project.id],
    ]),
  );

const projectIdentifierToId = toProjectIdentifierMap(projectCatalog);

const applicationProjectIdentifierToId = toProjectIdentifierMap(applicationProjectCatalog);

const normalizeProjectIdentifiersWithMap = (
  identifiers: readonly string[],
  identifierToId: ReadonlyMap<string, string>,
): string[] =>
  Array.from(
    new Set(
      identifiers.flatMap((identifier) => {
        const projectId = identifierToId.get(identifier);

        return projectId ? [projectId] : [];
      }),
    ),
  );

export const resolveProjectIdentifier = (identifier: string): string | null =>
  projectIdentifierToId.get(identifier) ?? null;

export const normalizeProjectIdentifiers = (identifiers: readonly string[]): string[] =>
  normalizeProjectIdentifiersWithMap(identifiers, projectIdentifierToId);

export const resolveApplicationProjectIdentifier = (identifier: string): string | null =>
  applicationProjectIdentifierToId.get(identifier) ?? null;

export const normalizeApplicationProjectIdentifiers = (identifiers: readonly string[]): string[] =>
  normalizeProjectIdentifiersWithMap(identifiers, applicationProjectIdentifierToId);

export const getProjectBySlug = (slug: string): ProjectContentEntry | undefined => {
  return projectCatalog.find((project) => project.slug === slug);
};

export const getProjectMetadata = (slug: string, locale: Language) => {
  const project = getProjectBySlug(slug);

  if (!project?.detailPath) {
    return undefined;
  }

  return project.content[locale].detailMetadata;
};

export const getProjectsBySection = (
  section: ProjectContentSection,
  parentId?: string,
): ProjectContentEntry[] => {
  return resumeProjectCatalog.filter(
    (project) => project.section === section && (!parentId || project.parentId === parentId),
  );
};
