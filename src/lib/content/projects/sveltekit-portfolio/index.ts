import { SKILL } from '$lib/data/skills';

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
        '**[Performance-First Hosting]** Migrated from purely static hosting to **Cloudflare Pages**, using **Edge Functions** for zero-latency server-side language detection.',
        '**[Modern Reactivity]** Fully embraced **Svelte 5 Runes** for fine-grained reactivity, reducing runtime overhead and improving code maintainability.',
        '**[AI Infrastructure]** Managed the entire development lifecycle via **AI-agentic orchestration**, using a centralized **dotfiles** repo and **AGENTS.md** as a single source of truth for multiple AI agents.',
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
        '**[성능 중심 호스팅]** 순수 정적 호스팅에서 **Cloudflare Pages**로 전환하고, **Edge Functions를 통해 요청 단계에서 언어를 자동 감지하는 무지연 다국어 처리**를 구현했습니다.',
        '**[모던 반응성 모델]** **Svelte 5 Runes를 전면 도입**하여 세밀한 반응성 제어를 실현하고, 런타임 오버헤드를 줄여 유지보수 효율을 높였습니다.',
        '**[AI 에이전트 인프라]** 중앙 관리형 **dotfiles와 AGENTS.md**를 구축하여 여러 AI 에이전트가 단일 소스를 공유하며 작업을 수행하는 에이전틱 개발 환경을 설계했습니다.',
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
