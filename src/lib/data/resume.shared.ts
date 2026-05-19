import { GITHUB_PROFILE, LINKEDIN_PROFILE } from '$lib/data/constants';
import { SKILL, type SkillName } from '$lib/data/skills';

export type { SkillId } from '$lib/data/skills';
export { skillsShared } from '$lib/data/skills';

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
        featuredSkills: [
          SKILL.languages.typescript,
          SKILL.frameworks.reactNative,
          SKILL.frameworks.expo,
          SKILL.state.tanstackQuery,
          SKILL.performance.flashList,
          SKILL.devops.eas,
        ],
        skills: [
          SKILL.languages.typescript,
          SKILL.frameworks.reactNative,
          SKILL.frameworks.expo,
          SKILL.frameworks.expoRouter,
          SKILL.ui.unistyles,
          SKILL.ui.lottie,
          SKILL.state.tanstackQuery,
          SKILL.state.reactHookForm,
          SKILL.state.zod,
          SKILL.state.reactNativeMmkv,
          SKILL.performance.flashList,
          SKILL.performance.reactNativeReanimated,
          SKILL.performance.reactCompiler,
          SKILL.backend.firebase,
          SKILL.devops.githubActions,
          SKILL.devops.eas,
          SKILL.devops.sentry,
          SKILL.aiWorkflow.agenticWorkflow,
          SKILL.aiWorkflow.claudeCode,
          SKILL.aiWorkflow.cursor,
          SKILL.aiWorkflow.gemini,
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
        featuredSkills: [
          SKILL.languages.typescript,
          SKILL.frameworks.nextJs,
          SKILL.state.tanstackQuery,
          SKILL.state.reactHookForm,
          SKILL.backend.paddle,
          SKILL.devops.webpack,
        ],
        skills: [
          SKILL.languages.typescript,
          SKILL.frameworks.nextJs,
          SKILL.ui.styledComponents,
          SKILL.ui.mui,
          SKILL.ui.atomicDesign,
          SKILL.ui.storybook,
          SKILL.ui.lottie,
          SKILL.state.tanstackQuery,
          SKILL.state.reactHookForm,
          SKILL.backend.firebase,
          SKILL.backend.paddle,
          SKILL.backend.nodeJs,
          SKILL.devops.githubActions,
          SKILL.devops.crashlytics,
          SKILL.devops.webpack,
          SKILL.aiWorkflow.githubCopilot,
        ],
      },
      {
        id: 'admin_dashboard',
        dateFrom: '2022-03',
        dateTo: '2023-06',
        paradigm: 'assisted',
        featuredSkills: [
          SKILL.languages.typescript,
          SKILL.frameworks.react,
          SKILL.ui.reactTable,
          SKILL.ui.chartJs,
          SKILL.state.tanstackQuery,
          SKILL.ui.mui,
        ],
        skills: [
          SKILL.languages.typescript,
          SKILL.frameworks.react,
          SKILL.ui.styledComponents,
          SKILL.ui.mui,
          SKILL.ui.atomicDesign,
          SKILL.ui.reactTable,
          SKILL.ui.chartJs,
          SKILL.state.tanstackQuery,
          SKILL.devops.firebaseHosting,
          SKILL.devops.githubActions,
          SKILL.aiWorkflow.githubCopilot,
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
        featuredSkills: [
          SKILL.languages.typescript,
          SKILL.frameworks.react,
          SKILL.ui.reactTable,
          SKILL.performance.reactWindow,
          SKILL.performance.reactVirtualized,
          SKILL.backend.socketIo,
        ],
        skills: [
          SKILL.languages.typescript,
          SKILL.frameworks.react,
          SKILL.ui.styledComponents,
          SKILL.ui.atomicDesign,
          SKILL.ui.reactTable,
          SKILL.state.redux,
          SKILL.state.reduxSaga,
          SKILL.performance.reactWindow,
          SKILL.performance.reactVirtualized,
          SKILL.backend.socketIo,
        ],
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
    detailLink: '/projects/day-planner',
    paradigm: 'agentic',
    featuredSkills: [SKILL.languages.swift, SKILL.frameworks.swiftUi, SKILL.backend.cloudKit],
    skills: [
      SKILL.languages.swift,
      SKILL.frameworks.swiftUi,
      SKILL.backend.cloudKit,
      SKILL.aiWorkflow.agenticWorkflow,
      SKILL.aiWorkflow.claudeCode,
    ],
  },
  {
    id: 'today_weather',
    dateFrom: '2026-04',
    detailLink: '/projects/today-weather',
    paradigm: 'agentic',
    featuredSkills: [
      SKILL.languages.typescript,
      SKILL.frameworks.nextJs,
      SKILL.frameworks.react,
      SKILL.state.tanstackQuery,
      SKILL.backend.upstashRedis,
      SKILL.devops.vitest,
    ],
    skills: [
      SKILL.languages.typescript,
      SKILL.frameworks.nextJs,
      SKILL.frameworks.react,
      SKILL.frameworks.reactNative,
      SKILL.frameworks.expo,
      SKILL.frameworks.expoRouter,
      SKILL.ui.tailwindCss,
      SKILL.ui.shadcnUi,
      SKILL.ui.cva,
      SKILL.state.tanstackQuery,
      SKILL.performance.reactNativeReanimated,
      SKILL.performance.reactCompiler,
      SKILL.backend.supabase,
      SKILL.backend.upstashRedis,
      SKILL.backend.nodeJs,
      SKILL.frameworks.nativeModules,
      SKILL.languages.swift,
      SKILL.languages.kotlin,
      SKILL.devops.vitest,
      SKILL.aiWorkflow.agenticWorkflow,
      SKILL.aiWorkflow.claudeCode,
    ],
  },
  {
    id: 'onelinebank_rebuild',
    dateFrom: '2021-04',
    dateTo: '2021-04',
    detailLink: '/projects/oneline-bank',
    featuredSkills: [
      SKILL.languages.typescript,
      SKILL.frameworks.expo,
      SKILL.state.tanstackForm,
      SKILL.state.zod,
      SKILL.devops.eas,
      SKILL.devops.crashlytics,
    ],
    skills: [
      SKILL.languages.typescript,
      SKILL.frameworks.reactNative,
      SKILL.frameworks.expo,
      SKILL.frameworks.expoRouter,
      SKILL.ui.tailwindCss,
      SKILL.ui.cva,
      SKILL.state.tanstackQuery,
      SKILL.state.tanstackForm,
      SKILL.state.zod,
      SKILL.state.zustand,
      SKILL.state.reactNativeMmkv,
      SKILL.performance.reactNativeReanimated,
      SKILL.backend.firebase,
      SKILL.devops.eas,
      SKILL.devops.crashlytics,
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
    featuredSkills: [
      SKILL.languages.typescript,
      SKILL.frameworks.svelte,
      SKILL.frameworks.svelteKit,
      SKILL.devops.cloudflarePages,
      SKILL.devops.vitest,
    ],
    skills: [
      SKILL.languages.typescript,
      SKILL.frameworks.svelte,
      SKILL.frameworks.svelteKit,
      SKILL.devops.cloudflarePages,
      SKILL.devops.githubActions,
      SKILL.devops.vitest,
      SKILL.aiWorkflow.agenticWorkflow,
      SKILL.aiWorkflow.claudeCode,
    ],
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
      SKILL.backend.awsAmplify,
    ],
    skills: [
      SKILL.languages.javascript,
      SKILL.frameworks.react,
      SKILL.ui.styledComponents,
      SKILL.state.graphql,
      SKILL.backend.awsAmplify,
    ],
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
