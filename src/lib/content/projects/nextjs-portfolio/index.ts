import { SKILL } from '@/lib/data/skills';

import { defineProject } from '../types';

export const nextjsPortfolioProject = defineProject({
  id: 'nextjs_portfolio',
  slug: 'nextjs-portfolio',
  section: 'other',
  dateFrom: '2021-02',
  detailPath: '/projects/nextjs-portfolio',
  paradigm: 'agentic',
  featuredSkills: [
    SKILL.languages.typescript,
    SKILL.frameworks.nextJs,
    SKILL.frameworks.react,
    SKILL.devops.cloudflareWorkers,
    SKILL.devops.vitest,
  ],
  skills: [
    SKILL.languages.typescript,
    SKILL.frameworks.nextJs,
    SKILL.frameworks.react,
    SKILL.devops.cloudflareWorkers,
    SKILL.devops.vitest,
  ],
  content: {
    en: {
      title: 'Next.js & Cloudflare Portfolio',
      description:
        'A high-performance portfolio website built with Next.js App Router on Cloudflare Workers.',
      metrics: [
        { value: '192ms', label: 'First Contentful Paint' },
        { value: '-80%', label: 'Bundle Size' },
        { value: '97', label: 'Lighthouse Performance' },
        { value: '< 0.5s', label: 'CMS Reflection' },
      ],
      summaryDetails: [
        '**[Next.js App Router on Edge]** Achieved an ultra-fast First Contentful Paint (FCP) of **192ms** by executing Next.js App Router directly on Cloudflare Workers edge nodes.',
        '**[Bundle Optimization]** Reduced the initial JS bundle size by **~80% (approx. 860KB)** by dynamic-importing heavy client-side visualization dependencies (e.g., Mermaid.js) only when needed.',
        '**[Security & CMS]** Integrated Cloudflare D1 database and KV cache to create a real-time admin editor, reducing content update times from a **2-minute build/deploy process to under 0.5 seconds**.',
      ],
      detailMetadata: {
        title: 'Next.js & Cloudflare Portfolio',
        description:
          'Edge-enhanced portfolio built with Cloudflare Workers and Next.js App Router — server-side language detection, hybrid Resume + Portfolio UX, and Lighthouse 97 performance.',
        date: '2021-02 ~',
        image: '/images/nextjs-portfolio/1.webp',
        productLink: 'https://junwon.pages.dev',
        githubLink: 'portfolio',
        role: 'Solo developer',
        platforms: ['Web'],
        techStack: ['Next.js', 'React', 'TypeScript', 'Cloudflare Workers', 'Vitest', 'Claude Code'],
        metrics: [
          { value: '192ms', label: 'FCP (Edge-rendered)' },
          { value: '-80%', label: 'JS Bundle Reduced' },
          { value: '97', label: 'Lighthouse Performance' },
          { value: '< 0.5s', label: 'CMS Sync Time' },
        ],
      },
    },
    ko: {
      title: 'Next.js & Cloudflare 포트폴리오',
      description: 'Next.js App Router와 Cloudflare Workers를 사용하여 개발한 고성능 에지 기반 포트폴리오 사이트.',
      metrics: [
        { value: '192ms', label: '초기 렌더링 속도 (FCP)' },
        { value: '-80%', label: 'JS 번들 크기 감소' },
        { value: '97점', label: 'Lighthouse 성능 점수' },
        { value: '< 0.5초', label: '실시간 CMS 반영' },
      ],
      summaryDetails: [
        '**[Next.js App Router와 에지]** Next.js App Router를 Cloudflare Workers 에지 단에서 직접 실행하여 **192ms**의 초고속 FCP(First Contentful Paint)와 **161ms**의 전체 페이지 로드 성능을 달성했습니다.',
        '**[번들 최적화]** Mermaid.js 등 대용량 클라이언트 의존성 라이브러리를 동적 임포트(Dynamic Import)로 지연 로딩하여, 초기 클라이언트 번들 크기를 **약 80%(~860KB)** 경량화하고 초기 로딩 병목을 해결했습니다.',
        '**[보안 및 CMS 개발]** Cloudflare Access와 D1 데이터베이스를 연동한 실시간 에디터를 구축하여, 기존 마크다운 수정 후 빌드/배포(약 2분 소요) 흐름을 **0.5초 이내 즉시 반영**되도록 개선했습니다.',
      ],
      detailMetadata: {
        title: 'Next.js & Cloudflare 포트폴리오',
        description:
          'Cloudflare Workers와 Next.js App Router로 구축한 에지 기반 포트폴리오 — 서버 사이드 언어 감지, 이력서+포트폴리오 하이브리드 UX, Lighthouse 97점 성능.',
        date: '2021-02 ~',
        image: '/images/nextjs-portfolio/1.webp',
        productLink: 'https://junwon.pages.dev',
        githubLink: 'portfolio',
        role: '1인 개발',
        platforms: ['Web'],
        techStack: ['Next.js', 'React', 'TypeScript', 'Cloudflare Workers', 'Vitest', 'Claude Code'],
        metrics: [
          { value: '192ms', label: '초기 렌더링 속도 (FCP)' },
          { value: '-80%', label: 'JS 번들 크기 감소' },
          { value: '97점', label: 'Lighthouse 성능 점수' },
          { value: '< 0.5초', label: '실시간 CMS 반영' },
        ],
      },
    },
  },
});
