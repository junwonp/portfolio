import { SKILL } from '@/lib/data/skills';

import { defineProject } from '../types';

export const kftcPlatformProject = defineProject({
  id: 'kftc_platform',
  slug: 'kftc-platform',
  section: 'other',
  dateFrom: '2026-04',
  dateTo: '2026-05',
  detailPath: '/projects/kftc-platform',
  featuredSkills: [
    SKILL.languages.typescript,
    SKILL.frameworks.react,
    SKILL.state.tanstackQuery,
    SKILL.state.reactHookForm,
    SKILL.state.zod,
    SKILL.devops.vitest,
  ],
  skills: [
    SKILL.languages.typescript,
    SKILL.frameworks.react,
    SKILL.ui.tailwindCss,
    SKILL.state.tanstackQuery,
    SKILL.state.reactHookForm,
    SKILL.state.zod,
    SKILL.devops.vitest,
  ],
  content: {
    en: {
      title: 'KFTC FinCert Marketing Platform',
      titleBadge: 'Freelance Frontend',
      description:
        'Frontend contract project for a FinCert-based promotion platform covering signup, consent, events, challenges, rewards, notifications, and account flows.',
      summaryDetails: [
        '**[FinCert User Flow]** Implemented signup, consent maintenance, profile edit, withdrawal, and user-facing error handling around the FinCert integration.',
        '**[Promotion Domain]** Built event, challenge, attendance, ticket, point, voucher, FAQ, notice, and notification screens with reusable promotion detail flows.',
        '**[Data Reliability]** Used **TanStack Query** with query-key contracts, focused invalidation, persisted cache, and regression tests for high-change campaign data.',
        '**[Form & Validation]** Applied **React Hook Form** and **Zod** to keep profile and campaign participation forms type-safe and user-friendly.',
      ],
      detailMetadata: {
        title: 'KFTC FinCert Marketing Platform',
        description:
          'Frontend freelance contract for a FinCert-based promotion platform covering signup, consent, events, challenges, rewards, notifications, and account flows.',
        date: '2026-04 ~ 2026-05',
        role: 'Frontend Engineer (Freelance)',
        platforms: ['Web'],
        metrics: [
          { value: '1 Mon', label: 'Duration' },
          { value: 'React 19', label: 'Version' },
        ],
        techStack: [
          'TypeScript',
          'React',
          'Vite',
          'TailwindCSS v4',
          'TanStack Query',
          'React Hook Form',
          'Zod',
          'idb-keyval',
          'Express (Mock)',
          'Storybook',
          'Vitest',
        ],
      },
    },
    ko: {
      title: '금융결제원 금융인증서 마케팅 플랫폼',
      titleBadge: '프론트엔드 외주',
      description:
        '금융인증서 기반 프로모션 플랫폼의 회원가입, 동의, 이벤트, 챌린지, 리워드, 알림, 마이페이지 흐름을 구현한 프론트엔드 외주 프로젝트',
      summaryDetails: [
        '**[금융인증서 사용자 플로우]** FinCert 연동을 중심으로 회원가입, 동의 유지, 프로필 수정, 탈퇴, 사용자 오류 처리 흐름을 구현했습니다.',
        '**[프로모션 도메인]** 이벤트, 챌린지, 출석, 행운권, 포인트, 쿠폰, FAQ, 공지, 알림 화면을 재사용 가능한 프로모션 상세 플로우로 구성했습니다.',
        '**[데이터 신뢰성]** **TanStack Query** 기반 query key 계약, 선택적 무효화, 영속 캐시, 회귀 테스트로 변경이 잦은 캠페인 데이터를 안정적으로 다뤘습니다.',
        '**[폼과 검증]** **React Hook Form**과 **Zod**를 적용해 프로필·참여 폼을 Type-Safe하고 사용자 친화적으로 구성했습니다.',
      ],
      detailMetadata: {
        title: '금융결제원 금융인증서 마케팅 플랫폼',
        description:
          '금융인증서 기반 프로모션 플랫폼의 회원가입, 동의, 이벤트, 챌린지, 리워드, 알림, 마이페이지 흐름을 구현한 프론트엔드 외주 프로젝트',
        date: '2026-04 ~ 2026-05',
        role: '프론트엔드 개발자 (외주)',
        platforms: ['Web'],
        metrics: [
          { value: '1개월', label: '개발 기간' },
          { value: 'React 19', label: '버전' },
        ],
        techStack: [
          'TypeScript',
          'React',
          'Vite',
          'TailwindCSS v4',
          'TanStack Query',
          'React Hook Form',
          'Zod',
          'idb-keyval',
          'Express (Mock)',
          'Storybook',
          'Vitest',
        ],
      },
    },
  },
});
