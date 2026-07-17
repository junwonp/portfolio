import type { Language } from '@/lib/utils/language';

export const SKILL = {
  backend: {
    aws: 'AWS',
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
    reanimated: 'Reanimated',
    reactVirtualized: 'react-virtualized',
    reactWindow: 'react-window',
  },
  state: {
    graphql: 'GraphQL',
    redux: 'Redux',
    tanstackQuery: 'TanStack Query',
    zod: 'Zod',
    zustand: 'Zustand',
  },
  ui: {
    antDesign: 'Ant Design',
    mui: 'MUI',
    shadcnUi: 'shadcn/ui',
    styledComponents: 'styled-components',
    tailwindCss: 'Tailwind CSS',
  },
} as const;

type ValueOf<T> = T extends Record<PropertyKey, infer Value> ? Value : never;

export type SkillId = keyof typeof SKILL;
export type SkillName = ValueOf<ValueOf<typeof SKILL>>;

export interface SkillGroup {
  id: SkillId;
  detailLink?: string;
  list: readonly SkillName[];
}

export const skillGroups = [
  {
    id: 'languages',
    list: [SKILL.languages.typescript, SKILL.languages.javascript, SKILL.languages.swift],
  },
  {
    id: 'frameworks',
    list: [
      SKILL.frameworks.react,
      SKILL.frameworks.nextJs,
      SKILL.frameworks.reactNative,
      SKILL.frameworks.expo,
      SKILL.frameworks.swiftUi,
    ],
  },
  {
    id: 'ui',
    list: [
      SKILL.ui.styledComponents,
      SKILL.ui.mui,
      SKILL.ui.antDesign,
      SKILL.ui.tailwindCss,
      SKILL.ui.shadcnUi,
    ],
  },
  {
    id: 'state',
    list: [
      SKILL.state.tanstackQuery,
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
    ],
  },
  {
    id: 'backend',
    list: [
      SKILL.backend.firebase,
      SKILL.backend.supabase,
      SKILL.backend.upstash,
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
] as const satisfies readonly SkillGroup[];

export const skillGroupTitles = {
  en: {
    languages: 'Languages',
    frameworks: 'Frameworks',
    ui: 'UI & Design System',
    state: 'State & Data',
    performance: 'Animation & Performance',
    backend: 'Backend & Cloud',
    devops: 'DevOps & Infra',
  },
  ko: {
    languages: '언어',
    frameworks: '프레임워크',
    ui: 'UI 및 디자인 시스템',
    state: '상태 및 데이터',
    performance: '애니메이션 및 성능',
    backend: '백엔드 및 클라우드',
    devops: '데브옵스 및 인프라',
  },
} as const satisfies Record<Language, Record<SkillId, string>>;

export const skillsShared = skillGroups;
export const registeredSkillNames = skillGroups.flatMap((group) => group.list);

const registeredSkillNameSet = new Set<string>(registeredSkillNames);
const skillCategoryMap = new Map<string, SkillId>(
  skillGroups.flatMap((group) => group.list.map((skill) => [skill, group.id])),
);

export function getSkillCategory(skill: string): SkillId | 'default' {
  return skillCategoryMap.get(skill) ?? 'default';
}

export function isRegisteredSkillName(skill: string): skill is SkillName {
  return registeredSkillNameSet.has(skill);
}
