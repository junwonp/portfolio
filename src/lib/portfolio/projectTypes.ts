import type { MetricItem, PillarItem } from './homeTypes';

export type PostMetadata = {
  additional?: {
    label: string;
    link: string;
  };
  companyName?: string;
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  description?: string;
  detailPath?: string;
  featuredSkills?: string[];
  focusKeywords?: string[];
  githubLink?: string;
  highlights?: string[];
  image?: string;
  icon?: string;
  linkedinLink?: string;
  metrics?: MetricItem[];
  name?: string;
  paradigm?: 'assisted' | 'agentic';
  parentId?: string;
  pillars?: PillarItem[];
  platforms?: string[];
  productLink?: string;
  role?: string;
  section?: 'work' | 'other' | 'archive' | 'standalone';
  status?: string;
  summaryDetails?: string[];
  tagline?: string;
  techStack?: string[];
  title?: string;
  titleBadge?: string;

  id?: string;
};
