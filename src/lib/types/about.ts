export interface IntroductionProps {
  name: string;
  role: string;
  tagline: string;
  briefing: string[];
  githubLink: string;
  linkedinLink: string;
}

interface ProjectProps {
  project: {
    dateFrom: string;
    dateTo?: string;
    description: string;
    detail: string[];
    detailLink?: string;
    githubLink?: string;
    productLink?: string;
    skills?: string[];
    title: string;
  }[];
}

export interface WorkExperienceProps extends ProjectProps {
  additional?: {
    label: string;
    link: string;
  };
  companyName: string;
  dateFrom: string;
  dateTo?: string;
  role: string;
}

export interface OtherExperienceProps extends ProjectProps {
  additional?: {
    label: string;
    link: string;
  };
  companyName?: string;
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
  list: string[];
  title: string;
};
