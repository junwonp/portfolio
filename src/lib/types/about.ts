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
  name: string;
  role: string;
  tagline: string;
  briefing: string[];
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
  skills?: string[];
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
  titleBadge?: string;
  dateFrom: string;
  dateTo?: string;
  highlights?: string[];
  role: string;
}

export interface OtherExperienceProps extends ProjectProps {
  additional?: {
    label: string;
    link: string;
  };
  companyName?: string;
  titleBadge?: string;
  dateFrom?: string;
  dateTo?: string;
  role?: string;
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
  id: string;
  list: string[];
  title: string;
};
