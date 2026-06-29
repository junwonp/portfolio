import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

import { agenticWorkflowDetailContent } from './agentic-workflow';
import { airaDetailContent } from './aira';
import { camerafiStudioDetailContent } from './camerafi-studio';
import { electionAggregatorDetailContent } from './election-aggregator';
import { mndExcelViewerDetailContent } from './mnd-excel-viewer';
import { onelineBankDetailContent } from './oneline-bank';
import { sveltekitPortfolioDetailContent } from './sveltekit-portfolio';
import { todayWeatherDetailContent } from './today-weather';

export type ProjectDetailContentMap = Record<string, Record<Language, ProjectDetailBlock[]>>;

export const projectDetailContentMap: ProjectDetailContentMap = {
  'agentic-workflow': agenticWorkflowDetailContent,
  aira: airaDetailContent,
  'camerafi-studio': camerafiStudioDetailContent,
  'election-aggregator': electionAggregatorDetailContent,
  'mnd-excel-viewer': mndExcelViewerDetailContent,
  'oneline-bank': onelineBankDetailContent,
  'sveltekit-portfolio': sveltekitPortfolioDetailContent,
  'today-weather': todayWeatherDetailContent,
};

export const projectDetailContentSlugs = Object.keys(projectDetailContentMap);

export const getProjectDetailBlocks = (
  slug: string,
  locale: Language,
): ProjectDetailBlock[] | undefined => projectDetailContentMap[slug]?.[locale];
