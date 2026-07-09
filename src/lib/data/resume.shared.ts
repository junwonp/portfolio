import { SKILL, type SkillName } from '@/lib/data/skills';

export type { SkillId } from '@/lib/data/skills';
export { skillsShared } from '@/lib/data/skills';

export const sharedIntroduction = {
  githubLink: '/github',
  linkedinLink: '/linkedin',
  role: 'Frontend Engineer' as const,
};

export interface SharedProject {
  id: string;
  dateFrom: string;
  dateTo?: string;
  detailLink?: string;
  featuredSkills?: SkillName[];
  skills?: SkillName[];
  paradigm?: 'assisted' | 'agentic';
}

export interface SharedWorkExp {
  id: string;
  dateFrom: string;
  dateTo?: string;
  projects: SharedProject[];
}

export const workExperiencesShared = [
  {
    id: 'orca_ai',
    dateFrom: '2024-01',
    projects: [
      {
        id: 'aira',
        dateFrom: '2024-07',
        dateTo: '2025-12',
        detailLink: '/projects/aira',
        paradigm: 'assisted',
      },
    ],
  },
  {
    id: 'vault_micro',
    dateFrom: '2022-01',
    dateTo: '2023-06',
    projects: [
      {
        id: 'camerafi_studio',
        dateFrom: '2022-02',
        dateTo: '2023-06',
        detailLink: '/projects/camerafi-studio',
        paradigm: 'assisted',
      },
      {
        id: 'admin_dashboard',
        dateFrom: '2022-03',
        dateTo: '2023-06',
        paradigm: 'assisted',
      },
    ],
  },
  {
    id: 'mnd',
    dateFrom: '2019-05',
    dateTo: '2020-12',
    projects: [
      {
        id: 'web_viewer',
        dateFrom: '2020-08',
        dateTo: '2020-10',
        detailLink: '/projects/mnd-excel-viewer',
      },
      {
        id: 'mnd_dashboard',
        dateFrom: '2019-06',
        dateTo: '2019-09',
        featuredSkills: [
          SKILL.languages.javascript,
          SKILL.frameworks.react,
          SKILL.ui.antDesign,
          SKILL.state.redux,
        ],
        skills: [
          SKILL.languages.javascript,
          SKILL.frameworks.react,
          SKILL.ui.styledComponents,
          SKILL.ui.antDesign,
          SKILL.state.redux,
        ],
      },
    ],
  },
] satisfies SharedWorkExp[];

export type WorkExpId = (typeof workExperiencesShared)[number]['id'];

export interface SharedOtherExp {
  id: string;
  dateFrom?: string;
  dateTo?: string;
  detailLink?: string;
  featuredSkills?: SkillName[];
  skills?: SkillName[];
  paradigm?: 'assisted' | 'agentic';
}

export const otherExperiencesShared = [
  {
    id: 'day_planner',
    dateFrom: '2026-04',
    paradigm: 'agentic',
  },
  {
    id: 'today_weather',
    dateFrom: '2026-04',
    detailLink: '/projects/today-weather',
    paradigm: 'agentic',
  },
  {
    id: 'campus_town',
    dateFrom: '2024',
  },
  {
    id: 'nextjs_portfolio',
    dateFrom: '2026-04',
    detailLink: '/projects/nextjs-portfolio',
    paradigm: 'agentic',
  },
] satisfies SharedOtherExp[];

export type OtherExpId = (typeof otherExperiencesShared)[number]['id'];

export interface SharedArchive {
  id: string;
  dateFrom: string;
  dateTo?: string;
  detailLink?: string;
  featuredSkills?: SkillName[];
  skills?: SkillName[];
}

export const archivesShared = [
  {
    id: 'election_aggregator',
    dateFrom: '2021-11',
    dateTo: '2021-11',
    detailLink: '/projects/election-aggregator',
    featuredSkills: [
      SKILL.languages.javascript,
      SKILL.frameworks.react,
      SKILL.state.graphql,
      SKILL.backend.aws,
    ],
    skills: [
      SKILL.languages.javascript,
      SKILL.frameworks.react,
      SKILL.ui.styledComponents,
      SKILL.state.graphql,
      SKILL.backend.aws,
    ],
  },
  {
    id: 'onelinebank_rebuild',
    dateFrom: '2021-04',
    dateTo: '2021-04',
    detailLink: '/projects/oneline-bank',
  },
] satisfies SharedArchive[];

export type ArchiveId = (typeof archivesShared)[number]['id'];

export const certificateOrder = ['aws', 'topcit', 'linux_master'] as const;

export type CertificateId = (typeof certificateOrder)[number];

export const certificatesShared: Record<CertificateId, { link: string }> = {
  aws: { link: '/certificates/aws-training.pdf' },
  topcit: { link: '/certificates/topcit.pdf' },
  linux_master: { link: '/certificates/linux-master-2.pdf' },
};

export const educationOrder = ['hanyang', 'sejong'] as const;

export type EducationId = (typeof educationOrder)[number];

export const educationShared: Record<EducationId, { dateFrom: string; dateTo?: string }> = {
  hanyang: { dateFrom: '2017-03', dateTo: '2024-02' },
  sejong: { dateFrom: '2014-03', dateTo: '2017-02' },
};
