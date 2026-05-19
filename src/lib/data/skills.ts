export const SKILL = {
  aiWorkflow: {
    agenticWorkflow: 'Agentic Workflow',
    claudeCode: 'Claude Code',
    cursor: 'Cursor',
    gemini: 'Gemini',
    githubCopilot: 'GitHub Copilot',
  },
  backend: {
    awsAmplify: 'AWS Amplify',
    cloudKit: 'CloudKit',
    firebase: 'Firebase',
    nodeJs: 'Node.js',
    paddle: 'Paddle',
    socketIo: 'Socket.IO',
    supabase: 'Supabase',
    upstashRedis: 'Upstash Redis',
  },
  devops: {
    cloudflarePages: 'Cloudflare Pages',
    crashlytics: 'Crashlytics',
    eas: 'EAS',
    firebaseHosting: 'Firebase Hosting',
    githubActions: 'GitHub Actions',
    sentry: 'Sentry',
    vitest: 'Vitest',
    webpack: 'webpack',
  },
  frameworks: {
    expo: 'Expo',
    expoRouter: 'Expo Router',
    nativeModules: 'Native Modules',
    nextJs: 'Next.js',
    react: 'React',
    reactNative: 'React Native',
    svelte: 'Svelte',
    svelteKit: 'SvelteKit',
    swiftUi: 'SwiftUI',
  },
  languages: {
    javascript: 'JavaScript',
    kotlin: 'Kotlin',
    swift: 'Swift',
    typescript: 'TypeScript',
  },
  performance: {
    flashList: 'FlashList',
    reactCompiler: 'React Compiler',
    reactNativeReanimated: 'React Native Reanimated',
    reactVirtualized: 'react-virtualized',
    reactWindow: 'react-window',
  },
  state: {
    graphql: 'GraphQL',
    reactHookForm: 'React Hook Form',
    reactNativeMmkv: 'React Native MMKV',
    redux: 'Redux',
    reduxSaga: 'redux-saga',
    tanstackForm: 'TanStack Form',
    tanstackQuery: 'TanStack Query',
    zod: 'Zod',
    zustand: 'Zustand',
  },
  ui: {
    antDesign: 'Ant Design',
    atomicDesign: 'Atomic Design',
    chartJs: 'Chart.js',
    cva: 'CVA',
    lottie: 'Lottie',
    mui: 'MUI',
    reactTable: 'React Table',
    shadcnUi: 'shadcn/ui',
    storybook: 'Storybook',
    styledComponents: 'styled-components',
    tailwindCss: 'Tailwind CSS',
    unistyles: 'Unistyles',
  },
} as const;

type ValueOf<T> = T[keyof T];

export type SkillName = ValueOf<{
  [Category in keyof typeof SKILL]: ValueOf<(typeof SKILL)[Category]>;
}>;

export type SkillId =
  | 'ai_workflow'
  | 'backend'
  | 'devops'
  | 'frameworks'
  | 'languages'
  | 'performance'
  | 'state'
  | 'ui';

interface SkillGroup {
  id: SkillId;
  detailLink?: string;
  list: SkillName[];
}

export const skillsShared: SkillGroup[] = [
  {
    id: 'languages',
    list: [
      SKILL.languages.typescript,
      SKILL.languages.javascript,
      SKILL.languages.swift,
      SKILL.languages.kotlin,
    ],
  },
  {
    id: 'frameworks',
    list: [
      SKILL.frameworks.react,
      SKILL.frameworks.nextJs,
      SKILL.frameworks.reactNative,
      SKILL.frameworks.expo,
      SKILL.frameworks.expoRouter,
      SKILL.frameworks.svelte,
      SKILL.frameworks.svelteKit,
      SKILL.frameworks.swiftUi,
      SKILL.frameworks.nativeModules,
    ],
  },
  {
    id: 'ui',
    list: [
      SKILL.ui.styledComponents,
      SKILL.ui.mui,
      SKILL.ui.antDesign,
      SKILL.ui.tailwindCss,
      SKILL.ui.unistyles,
      SKILL.ui.shadcnUi,
      SKILL.ui.cva,
      SKILL.ui.storybook,
      SKILL.ui.lottie,
      SKILL.ui.reactTable,
      SKILL.ui.chartJs,
      SKILL.ui.atomicDesign,
    ],
  },
  {
    id: 'state',
    list: [
      SKILL.state.tanstackQuery,
      SKILL.state.reactHookForm,
      SKILL.state.tanstackForm,
      SKILL.state.zod,
      SKILL.state.zustand,
      SKILL.state.redux,
      SKILL.state.reduxSaga,
      SKILL.state.graphql,
      SKILL.state.reactNativeMmkv,
    ],
  },
  {
    id: 'performance',
    list: [
      SKILL.performance.reactNativeReanimated,
      SKILL.performance.flashList,
      SKILL.performance.reactWindow,
      SKILL.performance.reactVirtualized,
      SKILL.performance.reactCompiler,
    ],
  },
  {
    id: 'backend',
    list: [
      SKILL.backend.firebase,
      SKILL.backend.supabase,
      SKILL.backend.upstashRedis,
      SKILL.backend.cloudKit,
      SKILL.backend.awsAmplify,
      SKILL.backend.socketIo,
      SKILL.backend.paddle,
      SKILL.backend.nodeJs,
    ],
  },
  {
    id: 'devops',
    list: [
      SKILL.devops.githubActions,
      SKILL.devops.cloudflarePages,
      SKILL.devops.firebaseHosting,
      SKILL.devops.sentry,
      SKILL.devops.crashlytics,
      SKILL.devops.vitest,
      SKILL.devops.eas,
      SKILL.devops.webpack,
    ],
  },
  {
    id: 'ai_workflow',
    detailLink: '/projects/agentic-workflow',
    list: [
      SKILL.aiWorkflow.agenticWorkflow,
      SKILL.aiWorkflow.claudeCode,
      SKILL.aiWorkflow.cursor,
      SKILL.aiWorkflow.githubCopilot,
      SKILL.aiWorkflow.gemini,
    ],
  },
];
