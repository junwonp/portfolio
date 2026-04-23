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
  skills?: string[];
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
        dateFrom: '2024-01',
        detailLink: '/projects/aira',
        paradigm: 'assisted',
        skills: [
          'React Native',
          'TypeScript',
          'Expo',
          'Expo Router',
          'TanStack Query',
          'FlashList',
          'Reanimated',
          'React Compiler',
          'Zod',
          'MMKV',
          'Unistyles',
          'Firebase',
          'Sentry',
          'React Hook Form',
          'Lottie',
          'GitHub Actions',
          'EAS',
          'Cursor',
          'Gemini',
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
        detailLink: '/projects/camerafi-studio',
        paradigm: 'assisted',
        skills: [
          'Next.js',
          'TypeScript',
          'MUI',
          'Webpack',
          'Firebase',
          'Paddle',
          'TanStack Query',
          'styled-components',
          'Storybook',
          'Node.js',
          'GitHub Copilot',
        ],
      },
      {
        id: 'admin_dashboard',
        dateFrom: '2022-03',
        dateTo: '2023-06',
        paradigm: 'assisted',
        skills: [
          'React',
          'TypeScript',
          'MUI',
          'Chart.js',
          'TanStack Query',
          'Firebase Hosting',
          'styled-components',
          'GitHub Copilot',
        ],
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
        skills: [
          'React',
          'TypeScript',
          'React Table',
          'react-window',
          'react-virtualized',
          'Socket.IO',
          'Redux-Saga',
          'Atomic Design',
          'styled-components',
        ],
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
  skills?: string[];
  paradigm?: 'assisted' | 'agentic';
}

export const otherExperiencesShared = [
  {
    id: 'day_planner',
    dateFrom: '2026-04',
    detailLink: '/projects/day-planner',
    paradigm: 'agentic',
    skills: ['Swift', 'SwiftUI', 'CloudKit', 'Agentic Workflow', 'Claude Code'],
  },
  {
    id: 'today_weather',
    dateFrom: '2026-04',
    detailLink: '/projects/today-weather',
    paradigm: 'agentic',
    skills: [
      'Next.js',
      'React',
      'React Native',
      'Expo',
      'Expo Router',
      'TanStack Query',
      'Tailwind CSS',
      'Supabase',
      'Upstash Redis',
      'React Compiler',
      'Native Modules',
      'Swift',
      'Kotlin',
      'Node.js',
      'Vitest',
      'shadcn/ui',
      'Reanimated',
      'Agentic Workflow',
      'Claude Code',
    ],
  },
  {
    id: 'onelinebank_rebuild',
    dateFrom: '2021-04',
    dateTo: '2026-03',
    detailLink: '/projects/oneline-bank',
    skills: [
      'React Native',
      'TypeScript',
      'Expo',
      'Expo Router',
      'TanStack Query',
      'TanStack Form',
      'Zustand',
      'Tailwind CSS',
      'Zod',
      'MMKV',
      'Firebase',
      'Reanimated',
      'CVA',
      'EAS',
      'Crashlytics',
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
    paradigm: 'agentic',
    skills: [
      'Svelte / SvelteKit',
      'TypeScript',
      'Cloudflare Pages',
      'GitHub Actions',
      'Claude Code',
      'Vitest',
      'Agentic Workflow',
    ],
  },
] satisfies SharedOtherExp[];

export type OtherExpId = (typeof otherExperiencesShared)[number]['id'];

export interface SharedArchive {
  id: string;
  dateFrom: string;
  dateTo?: string;
  detailLink?: string;
  skills?: string[];
}

export const archivesShared = [
  {
    id: 'election_aggregator',
    dateFrom: '2021-11',
    dateTo: '2021-12',
    detailLink: '/projects/election-aggregator',
    skills: ['React', 'JavaScript', 'AWS Amplify', 'GraphQL', 'styled-components'],
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
    id: 'languages',
    list: ['TypeScript', 'JavaScript', 'Swift', 'Kotlin'],
  },
  {
    id: 'frameworks',
    list: [
      'React',
      'Next.js',
      'React Native',
      'Expo',
      'Expo Router',
      'Svelte / SvelteKit',
      'SwiftUI',
      'Native Modules',
    ],
  },
  {
    id: 'ui',
    list: [
      'styled-components',
      'MUI',
      'Ant Design',
      'Tailwind CSS',
      'Unistyles',
      'shadcn/ui',
      'CVA',
      'Storybook',
      'Lottie',
      'React Table',
      'Chart.js',
      'Atomic Design',
    ],
  },
  {
    id: 'state',
    list: [
      'TanStack Query',
      'React Hook Form',
      'TanStack Form',
      'Zod',
      'Zustand',
      'Redux',
      'Redux-Saga',
      'GraphQL',
      'MMKV',
    ],
  },
  {
    id: 'performance',
    list: ['Reanimated', 'FlashList', 'react-window', 'react-virtualized', 'React Compiler'],
  },
  {
    id: 'backend',
    list: [
      'Firebase',
      'Supabase',
      'Upstash Redis',
      'CloudKit',
      'AWS Amplify',
      'Socket.IO',
      'Paddle',
      'Node.js',
    ],
  },
  {
    id: 'devops',
    list: [
      'GitHub Actions',
      'Cloudflare Pages',
      'Firebase Hosting',
      'Sentry',
      'Crashlytics',
      'Vitest',
      'EAS',
      'Webpack',
    ],
  },
  {
    id: 'ai_workflow',
    detailLink: '/projects/agentic-workflow',
    list: ['Agentic Workflow', 'Claude Code', 'Cursor', 'GitHub Copilot', 'Gemini'],
  },
];

export type SkillId = (typeof skillsShared)[number]['id'];
