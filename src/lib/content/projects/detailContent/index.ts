import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

import { adminDashboardDetailContent } from './admin-dashboard';
import { agenticWorkflowDetailContent } from './agentic-workflow';
import { airaDetailContent } from './aira';
import { camerafiStudioDetailContent } from './camerafi-studio';
import { electionAggregatorDetailContent } from './election-aggregator';
import { kftcPlatformDetailContent } from './kftc-platform';
import { mndExcelViewerDetailContent } from './mnd-excel-viewer';
import { nextjsPortfolioDetailContent } from './nextjs-portfolio';
import { onelineBankDetailContent } from './oneline-bank';
import { todayWeatherDetailContent } from './today-weather';

export type ProjectDetailContentMap = Record<string, Record<Language, ProjectDetailBlock[]>>;

export const projectDetailContentMap: ProjectDetailContentMap = {
  'admin-dashboard': adminDashboardDetailContent,
  'agentic-workflow': agenticWorkflowDetailContent,
  aira: airaDetailContent,
  'camerafi-studio': camerafiStudioDetailContent,
  'election-aggregator': electionAggregatorDetailContent,
  'kftc-platform': kftcPlatformDetailContent,
  'mnd-excel-viewer': mndExcelViewerDetailContent,
  'oneline-bank': onelineBankDetailContent,
  'nextjs-portfolio': nextjsPortfolioDetailContent,
  'today-weather': todayWeatherDetailContent,
};

export const projectDetailContentSlugs = Object.keys(projectDetailContentMap);

export const getProjectDetailBlocks = (
  slug: string,
  locale: Language,
): ProjectDetailBlock[] | undefined => projectDetailContentMap[slug]?.[locale];
