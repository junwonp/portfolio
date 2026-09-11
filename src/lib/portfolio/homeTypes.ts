import type { Labels } from '@/lib/portfolio/labels';
import type { ResumeData } from '@/lib/portfolio/resume';
import type { Language } from '@/lib/utils/language';

export interface MetricItem {
  label: string;
  value: string;
}

export interface PillarItem {
  description: string;
  index: string;
  title: string;
}

export interface IntroductionProps {
  focusKeywords?: string[];
  name: string;
  role: string;
  tagline: string;
  githubLink: string;
  linkedinLink: string;
  metrics?: MetricItem[];
  pillars?: PillarItem[];
}

export interface ProjectItem {
  dateFrom: string;
  dateTo?: string;
  description: string;
  detail: string[];
  detailLink?: string;
  featuredSkills?: string[];
  id: string;
  skills?: string[];
  thumbnail?: {
    alt: string;
    kind: 'icon' | 'screenshot';
    src: string;
  };
  title: string;
  metrics?: MetricItem[];
}

interface ProjectProps {
  project: ProjectItem[];
}

export interface WorkExperienceProps extends ProjectProps {
  additional?: {
    label: string;
    link: string;
  };
  companyName: string;
  id: string;
  titleBadge?: string;
  dateFrom: string;
  dateTo?: string;
  highlights?: string[];
  role: string;
}

export interface OtherExperienceProps extends ProjectProps {
  titleBadge?: string;
}

export type ArchiveProps = ProjectProps;

export type CertificateProps = {
  label: string;
  link: string;
};

export type EducationProps = {
  school: string;
  dateFrom: string;
  dateTo?: string;
  major?: string;
};

export type SkillProps = {
  description?: string;
  detailLink?: string;
  detailLabel?: string;
  id: string;
  list: string[];
  title: string;
};

export interface NavSection {
  id: string;
  label: string;
}

export interface HomePageData {
  featuredWebProjects: OtherExperienceProps[];
  featuredProjectsMode: 'role-fit' | 'selected';
  labels: Labels;
  locale: Language;
  navSections: NavSection[];
  resumeData: ResumeData;
  summaryIntroduction: IntroductionProps;
}
