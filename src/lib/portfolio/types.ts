import type { MetricItem } from '@/lib/portfolio/homeTypes';
import type { PostMetadata } from '@/lib/portfolio/projectTypes';
import type { SkillName } from '@/lib/portfolio/skills';
import type { Language } from '@/lib/utils/language';

export const CAREER_ID = {
  mnd: 'mnd',
  orcaAi: 'orca_ai',
  vaultMicro: 'vault_micro',
} as const;

export type CareerId = (typeof CAREER_ID)[keyof typeof CAREER_ID];

export const PROJECT_ID = {
  adminDashboard: 'admin_dashboard',
  agenticWorkflow: 'agentic_workflow',
  aira: 'aira',
  camerafiStudio: 'camerafi_studio',
  campusTown: 'campus_town',
  dayPlanner: 'day_planner',
  electionAggregator: 'election_aggregator',
  kftcPlatform: 'kftc_platform',
  mndDashboard: 'mnd_dashboard',
  nextjsPortfolio: 'nextjs_portfolio',
  onelineBank: 'onelinebank_rebuild',
  todayWeather: 'today_weather',
  webViewer: 'web_viewer',
} as const;

export type ProjectId = (typeof PROJECT_ID)[keyof typeof PROJECT_ID];

export type ProjectContentSection = 'archive' | 'other' | 'standalone' | 'work';

export interface ProjectLocaleContent {
  description: string;
  detailMetadata?: PostMetadata;
  metrics?: MetricItem[];
  summaryDetails: string[];
  title: string;
  titleBadge?: string;
}

export interface ProjectContentEntry {
  content: Record<Language, ProjectLocaleContent>;
  dateFrom?: string;
  dateTo?: string;
  detailPath?: `/projects/${string}`;
  featuredSkills?: SkillName[];
  icon?: string;
  id: ProjectId;
  careerId?: CareerId;
  paradigm?: 'agentic' | 'assisted';
  section: ProjectContentSection;
  skills?: SkillName[];
  slug: string;
}

export const defineProject = <Entry extends ProjectContentEntry>(entry: Entry): Entry => entry;
