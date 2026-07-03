import type { SkillName } from '@/lib/data/skills';
import type { MetricItem } from '@/lib/types/about';
import type { PostMetadata } from '@/lib/types/post';
import type { Language } from '@/lib/utils/language';

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
  id: string;
  parentId?: string;
  paradigm?: 'agentic' | 'assisted';
  section: ProjectContentSection;
  skills?: SkillName[];
  slug: string;
}

export const defineProject = <Entry extends ProjectContentEntry>(entry: Entry): Entry => entry;
