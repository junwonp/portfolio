import { SKILL } from '@/lib/data/skills';

import { defineProject } from '../types';

export const sveltekitPortfolioProject = defineProject({
  id: 'sveltekit_portfolio',
  slug: 'sveltekit-portfolio',
  section: 'other',
  dateFrom: '2021-02',
  detailPath: '/projects/sveltekit-portfolio',
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
    SKILL.devops.vitest,
  ],
  content: {
    en: {
      title: 'SvelteKit Portfolio Website',
      description:
        'A website maximizing development efficiency and user experience with Svelte 5 (Runes) and Claude Code.',
      summaryDetails: [
        '**[Edge-based i18n & Performance]** Implemented zero-delay bilingual support by detecting preferred languages in Edge Functions, eliminating layout shifts and wrong-language flashes.',
        '**[Interviewer-Centric UX]** Provided a custom print-friendly single-page view, one-click technology tag filtering, and scroll restoration to make evaluation frictionless for hiring managers.',
        '**[Svelte 5 & Compiling Compatibility]** Migrated to **Svelte 5 Runes** for modern state management, solving library integration blockers with a custom preprocessor during build.',
        '**[DX & Integrity Testing]** Established a lightweight **Vitest script** that automatically asserts the integrity and symmetry of localized content files, preventing human errors.',
      ],
      detailMetadata: {
        title: 'SvelteKit Portfolio',
        description:
          'Edge-enhanced portfolio built with Cloudflare Pages and Svelte 5 — server-side language detection, hybrid Resume + Portfolio UX, and Lighthouse 97 performance.',
        date: '2021-02 ~',
        image: '/images/sveltekit-portfolio/1.webp',
        productLink: 'https://junwon.pages.dev',
        githubLink: 'portfolio',
        role: 'Solo developer',
        platforms: ['Web'],
        techStack: ['Svelte / SvelteKit', 'TypeScript', 'Cloudflare Pages', 'Vitest'],
      },
    },
    ko: {
      title: 'SvelteKit 포트폴리오',
      description: 'Svelte 5 (Runes)와 AI 에이전트를 활용하여 구축한 고성능 개인 웹사이트.',
      summaryDetails: [
        '**[엣지 기반 다국어 및 최적화]** Edge Functions를 이용해 최초 요청 단계에서 언어를 자동 판별하고, 폰트 헤더 프리로딩 및 캐싱을 활용해 화면 깜빡임이 없는 Lighthouse 97점의 고성능 다국어 사이트를 구축했습니다.',
        '**[면접관 지향적 UX 설계]** 인쇄/PDF 저장용 별도 페이지 뷰 제공, 필요한 기술 스택만 모아보는 다차원 태그 필터링, 상세 회고 탐색 후 돌아올 때 스크롤 위치 보존 등으로 서류 검토 피로도를 획기적으로 줄였습니다.',
        '**[Svelte 5 및 빌드 호환성 해결]** Svelte 5 Runes로 마이그레이션하면서 발생한 구버전 마크다운 모듈 충돌을, 별도의 라이브러리 추가 없이 빌드 단계의 커스텀 전처리기를 통해 컴파일 타임에 독립적으로 해결했습니다.',
        '**[테스트 기반 콘텐츠 무결성 검증]** 포트폴리오 업데이트 시 영어/한국어 번역본 누락이나 오타 등의 휴먼 에러를 방지하기 위해, 초경량 Vitest 검증 체계를 설계하여 다국어 데이터의 정합성을 보장했습니다.',
      ],
      detailMetadata: {
        title: 'SvelteKit 포트폴리오',
        description:
          'Cloudflare Pages와 Svelte 5로 구축한 엣지 기반 포트폴리오 — 서버 사이드 언어 감지, 이력서+포트폴리오 하이브리드 UX, Lighthouse 97점 성능.',
        date: '2021-02 ~',
        image: '/images/sveltekit-portfolio/1.webp',
        productLink: 'https://junwon.pages.dev',
        githubLink: 'portfolio',
        role: '1인 개발',
        platforms: ['Web'],
        techStack: ['Svelte / SvelteKit', 'TypeScript', 'Cloudflare Pages', 'Vitest'],
      },
    },
  },
});
