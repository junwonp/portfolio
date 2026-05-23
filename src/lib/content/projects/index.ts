import type { Language } from '$lib/utils/language';

import { adminDashboardProject } from './admin-dashboard';
import { agenticWorkflowProject } from './agentic-workflow';
import { airaProject } from './aira';
import { camerafiStudioProject } from './camerafi-studio';
import { campusTownProject } from './campus-town';
import { dayPlannerProject } from './day-planner';
import { electionAggregatorProject } from './election-aggregator';
import { mndDashboardProject } from './mnd-dashboard';
import { mndExcelViewerProject } from './mnd-excel-viewer';
import { onelineBankProject } from './oneline-bank';
import { sveltekitPortfolioProject } from './sveltekit-portfolio';
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
  onelineBankProject,
  campusTownProject,
  sveltekitPortfolioProject,
  electionAggregatorProject,
  agenticWorkflowProject,
];

export const resumeProjectCatalog = projectCatalog.filter(
  (project) => project.section !== 'standalone',
);

export const detailProjectCatalog = projectCatalog.filter((project) => project.detailPath);

export const projectSlugs = projectCatalog.map((project) => project.slug);

export const detailProjectSlugs = detailProjectCatalog.map((project) => project.slug);

export const getProjectBySlug = (slug: string): ProjectContentEntry | undefined => {
  return projectCatalog.find((project) => project.slug === slug);
};

export const getProjectMetadata = (slug: string, locale: Language) => {
  return getProjectBySlug(slug)?.content[locale].detailMetadata;
};

export const getProjectsBySection = (
  section: ProjectContentSection,
  parentId?: string,
): ProjectContentEntry[] => {
  return resumeProjectCatalog.filter(
    (project) => project.section === section && (!parentId || project.parentId === parentId),
  );
};
