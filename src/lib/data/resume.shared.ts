import { GITHUB_PROFILE, LINKEDIN_PROFILE } from '$lib/data/constants';

export const sharedIntroduction = {
  githubLink: GITHUB_PROFILE,
  linkedinLink: LINKEDIN_PROFILE,
  role: 'Frontend Engineer' as const,
};

export interface SharedProject {
  id: string;
  dateFrom: string;
  dateTo?: string;
  detailLink?: string;
  githubLink?: string;
  productLink?: string;
  skills?: string[];
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
        dateFrom: '2024-01',
        productLink: 'https://aira.gg',
        detailLink: '/projects/aira',
        skills: [
          'React Native',
          'TypeScript',
          'Expo',
          'FlashList',
          'Reanimated',
          'TanStack Query',
          'Zod',
          'Firebase',
          'Sentry',
          'MMKV',
          'Unistyles',
          'typesafe-i18n',
        ],
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
        productLink: 'https://studio.camerafi.com',
        detailLink: '/projects/camerafi-studio',
        skills: ['Next.js', 'TypeScript', 'MUI', 'PWA', 'Webpack', 'Firebase', 'Paddle'],
      },
      {
        id: 'admin_dashboard',
        dateFrom: '2022-03',
        dateTo: '2023-06',
        skills: ['React', 'TypeScript', 'MUI', 'Chart.js', 'TanStack Query', 'Firebase Hosting'],
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
        skills: ['React', 'TypeScript', 'React Table', 'Redux-Saga', 'Atomic Design'],
      },
      {
        id: 'mnd_dashboard',
        dateFrom: '2019-06',
        dateTo: '2019-09',
        skills: ['React', 'JavaScript', 'Ant Design', 'styled-components', 'Redux'],
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
  githubLink?: string;
  skills?: string[];
}

export const otherExperiencesShared = [
  {
    id: 'onelinebank_rebuild',
    dateFrom: '2026-02',
    dateTo: '2026-03',
    githubLink: `${GITHUB_PROFILE}/OnelineBank`,
    skills: [
      'React Native',
      'TypeScript',
      'Expo Router',
      'TanStack Query',
      'TanStack Form',
      'Zustand',
      'NativeWind (Tailwind CSS)',
      'Zod',
      'MMKV',
      'Firebase',
      'Reanimated',
    ],
  },
  {
    id: 'campus_town',
    dateFrom: '2024',
  },
  {
    id: 'sveltekit_portfolio',
    dateFrom: '2021-02',
    detailLink: '/projects/sveltekit-portfolio',
    githubLink: `${GITHUB_PROFILE}/junuuon.github.io`,
    skills: ['Svelte', 'SvelteKit', 'TypeScript', 'mdsvex', 'Cloudflare Pages'],
  },
] satisfies SharedOtherExp[];

export type OtherExpId = (typeof otherExperiencesShared)[number]['id'];

export interface SharedArchive {
  id: string;
  dateFrom: string;
  dateTo?: string;
  detailLink?: string;
  githubLink?: string;
  skills?: string[];
}

export const archivesShared = [
  {
    id: 'election_aggregator',
    dateFrom: '2021-11',
    dateTo: '2021-12',
    detailLink: '/projects/election-aggregator',
    githubLink: `${GITHUB_PROFILE}/ITE3068_team8`,
    skills: ['React', 'JavaScript', 'AWS Amplify', 'GraphQL', 'styled-components'],
  },
  {
    id: 'onelinebank_legacy',
    dateFrom: '2021-04',
    dateTo: '2021-05',
    detailLink: '/projects/oneline-bank-legacy',
    githubLink: `${GITHUB_PROFILE}/OnelineBank-legacy`,
    skills: ['React Native', 'JavaScript', 'Firebase', 'Expo'],
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

export const skillsShared = [
  {
    title: 'Languages',
    list: ['TypeScript', 'JavaScript (ES6+)'],
  },
  {
    title: 'Frontend',
    list: ['React', 'React Native', 'Expo (Router, EAS)', 'Next.js', 'Svelte / SvelteKit'],
  },
  {
    title: 'Engineering',
    list: [
      'TanStack Query',
      'FlashList',
      'Reanimated',
      'React Compiler',
      'Zustand',
      'MMKV',
      'Zod',
      'React Hook Form',
      'TanStack Form',
      'Webpack',
    ],
  },
  {
    title: 'DevOps & Tools',
    list: [
      'GitHub Actions',
      'Firebase',
      'Cloudflare Pages',
      'Sentry',
      'Figma',
      'Vim',
      'Claude Code',
      'Cursor IDE',
    ],
  },
];
