export type PostMetadata = {
  date?: string;
  description?: string;
  githubLink?: string;
  image?: string;
  metrics?: { value: string; label: string }[];
  name?: string;
  platforms?: string[];
  productLink?: string;
  role?: string;
  status?: string;
  tagline?: string;
  techStack?: string[];
  featuredSkills?: string[];
  title?: string;
  
  id?: string;
  parentId?: string;
  section?: 'work' | 'other' | 'archive' | 'standalone';
  dateFrom?: string;
  dateTo?: string;
  paradigm?: 'assisted' | 'agentic';
  detailPath?: string;
  icon?: string;
  summaryDetails?: string[];
  titleBadge?: string;
};
