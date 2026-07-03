export const SKILL = {
  aiWorkflow: {
    agenticWorkflow: 'Agentic Workflow',
    claudeCode: 'Claude Code',
    codex: 'Codex',
  },
  backend: {
    aws: 'AWS',
    cloudKit: 'CloudKit',
    firebase: 'Firebase',
    socketIo: 'Socket.IO',
    supabase: 'Supabase',
    upstash: 'Upstash',
  },
  devops: {
    cloudflare: 'Cloudflare',
    eas: 'EAS',
    githubActions: 'GitHub Actions',
    sentry: 'Sentry',
    vitest: 'Vitest',
    webpack: 'Webpack',
  },
  frameworks: {
    expo: 'Expo',
    expoRouter: 'Expo Router',
    nextJs: 'Next.js',
    react: 'React',
    reactNative: 'React Native',
    swiftUi: 'SwiftUI',
  },
  languages: {
    javascript: 'JavaScript',
    swift: 'Swift',
    typescript: 'TypeScript',
  },
  performance: {
    flashList: 'FlashList',
    reactCompiler: 'React Compiler',
    reanimated: 'Reanimated',
    reactVirtualized: 'react-virtualized',
    reactWindow: 'react-window',
  },
  state: {
    graphql: 'GraphQL',
    reactHookForm: 'React Hook Form',
    redux: 'Redux',
    tanstackForm: 'TanStack Form',
    tanstackQuery: 'TanStack Query',
    zod: 'Zod',
    zustand: 'Zustand',
  },
  ui: {
    antDesign: 'Ant Design',
    chartJs: 'Chart.js',
    mui: 'MUI',
    reactTable: 'React Table',
    shadcnUi: 'shadcn/ui',
    styledComponents: 'styled-components',
    tailwindCss: 'Tailwind CSS',
  },
} as const;

export type SkillId =
  | 'ai_workflow'
  | 'backend'
  | 'devops'
  | 'frameworks'
  | 'languages'
  | 'performance'
  | 'state'
  | 'ui';

interface SkillGroupDefinition {
  id: SkillId;
  detailLink?: string;
  list: readonly string[];
}

export const skillsShared = [
  {
    id: 'languages',
    list: [SKILL.languages.typescript, SKILL.languages.javascript, SKILL.languages.swift],
  },
  {
    id: 'ui',
    list: [
      SKILL.ui.styledComponents,
      SKILL.ui.mui,
      SKILL.ui.antDesign,
      SKILL.ui.tailwindCss,
      SKILL.ui.shadcnUi,
      SKILL.ui.reactTable,
      SKILL.ui.chartJs,
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
      SKILL.frameworks.swiftUi,
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
      SKILL.state.graphql,
    ],
  },
  {
    id: 'performance',
    list: [
      SKILL.performance.reanimated,
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
      SKILL.backend.upstash,
      SKILL.backend.cloudKit,
      SKILL.backend.aws,
      SKILL.backend.socketIo,
    ],
  },
  {
    id: 'devops',
    list: [
      SKILL.devops.githubActions,
      SKILL.devops.cloudflare,
      SKILL.devops.sentry,
      SKILL.devops.vitest,
      SKILL.devops.eas,
      SKILL.devops.webpack,
    ],
  },
  {
    id: 'ai_workflow',
    detailLink: '/projects/agentic-workflow',
    list: [SKILL.aiWorkflow.agenticWorkflow, SKILL.aiWorkflow.claudeCode, SKILL.aiWorkflow.codex],
  },
] as const satisfies readonly SkillGroupDefinition[];

export type SkillName = (typeof skillsShared)[number]['list'][number];

export interface SkillGroup {
  id: SkillId;
  detailLink?: string;
  list: readonly SkillName[];
}

export const registeredSkillNames = skillsShared.flatMap((group) => group.list);

const registeredSkillNameSet = new Set<string>(registeredSkillNames);

const skillCategoryMap = new Map<string, SkillId>();

for (const category of skillsShared) {
  for (const skill of category.list) {
    skillCategoryMap.set(skill, category.id);
  }
}

export function getSkillCategory(skill: string): SkillId | 'default' {
  return skillCategoryMap.get(skill) ?? 'default';
}

export function isRegisteredSkillName(skill: string): skill is SkillName {
  return registeredSkillNameSet.has(skill);
}
