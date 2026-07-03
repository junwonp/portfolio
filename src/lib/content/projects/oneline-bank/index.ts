import { SKILL } from '@/lib/data/skills';

import { defineProject } from '../types';

export const onelineBankProject = defineProject({
  id: 'onelinebank_rebuild',
  slug: 'oneline-bank',
  icon: '/images/oneline-bank/icon.webp',
  section: 'archive',
  dateFrom: '2021-04',
  dateTo: '2021-04',
  detailPath: '/projects/oneline-bank',
  featuredSkills: [
    SKILL.languages.typescript,
    SKILL.frameworks.expo,
    SKILL.state.tanstackForm,
    SKILL.state.zod,
    SKILL.devops.eas,
  ],
  skills: [
    SKILL.languages.typescript,
    SKILL.frameworks.reactNative,
    SKILL.frameworks.expo,
    SKILL.frameworks.expoRouter,
    SKILL.state.tanstackQuery,
    SKILL.state.tanstackForm,
    SKILL.state.zod,
    SKILL.state.zustand,
    SKILL.performance.reactNativeReanimated,
    SKILL.backend.firebase,
    SKILL.devops.eas,
  ],
  content: {
    en: {
      title: 'OnelineBank',
      description:
        'A before-and-after fintech project: independently built a conversational banking MVP in 5 days for the 2021 Woori Bank Hackathon finals, then rebuilt it in 2026 with TypeScript, Expo Router, and production-minded mobile architecture.',
      summaryDetails: [
        '**[Before and After]** Preserved the original hackathon product idea while replacing the legacy JavaScript codebase with a modular **TypeScript** and **Expo Router** architecture.',
        '**[Architecture Evolution]** Reorganized the banking flow into feature-based modules, route guards, query boundaries, and reusable UI primitives to show concrete engineering growth.',
        '**[Robust Form Handling]** Integrated **TanStack Form** and **Zod** for type-safe schema validation and consistent error handling across the banking flow.',
        '**[Developer Experience]** Optimized the delivery pipeline using **EAS** and kept the rebuilt demo reproducible across local and device builds.',
      ],
      detailMetadata: {
        title: 'OnelineBank',
        description:
          'Conversational mobile banking demo — 2021 Woori Bank hackathon app rebuilt in TypeScript with Expo Router, TanStack Query, and feature-based modules.',
        date: '2021-04',
        image: '/images/oneline-bank/1.webp',
        githubLink: 'OnelineBank',
        role: 'Solo developer',
        platforms: ['Android', 'iOS'],
        techStack: [
          'React Native',
          'TypeScript',
          'Expo',
          'Expo Router',
          'TanStack Query',
          'TanStack Form',
          'Zustand',
          'Zod',
          'Firebase',
          'Reanimated',
          'EAS',
        ],
      },
    },
    ko: {
      title: '한줄은행',
      description:
        '2021 우리은행 해커톤 본선에서 5일 만에 1인으로 구현한 대화형 뱅킹 MVP를, 2026년에 TypeScript·Expo Router·모바일 아키텍처 중심으로 다시 만든 전후 비교형 프로젝트.',
      summaryDetails: [
        '**[Before & After]** 해커톤 당시의 제품 아이디어는 유지하되, 레거시 JavaScript 코드베이스를 **TypeScript와 Expo Router 기반 모듈 구조**로 전면 교체했습니다.',
        '**[아키텍처의 진화]** 뱅킹 플로우를 기능 단위 모듈, 라우터 가드, query boundary, 재사용 UI primitive로 재구성해 엔지니어링 성장 폭이 보이도록 정리했습니다.',
        '**[견고한 폼 핸들링]** **TanStack Form과 Zod를 결합**하여 Type-Safe한 스키마 검증과 일관된 에러 피드백 시스템을 뱅킹 플로우에 적용했습니다.',
        '**[개발자 경험 개선]** **EAS를 통한 빌드 파이프라인**을 정리해 로컬과 실기기 환경에서 리빌드 데모를 재현 가능하게 만들었습니다.',
      ],
      detailMetadata: {
        title: '한줄은행',
        description:
          '대화형 모바일 뱅킹 데모 — 2021 우리은행 해커톤 출품작을 TypeScript·Expo Router·TanStack Query·기능 모듈 구조로 전면 재작성했습니다.',
        date: '2021-04',
        image: '/images/oneline-bank/1.webp',
        githubLink: 'OnelineBank',
        role: '1인 개발',
        platforms: ['Android', 'iOS'],
        techStack: [
          'React Native',
          'TypeScript',
          'Expo',
          'Expo Router',
          'TanStack Query',
          'TanStack Form',
          'Zustand',
          'Zod',
          'Firebase',
          'Reanimated',
          'EAS',
        ],
      },
    },
  },
});
