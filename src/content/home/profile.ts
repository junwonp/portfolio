import type { IntroductionProps } from '@/lib/portfolio/homeTypes';
import type { Language } from '@/lib/utils/language';

export type ProfileData = Pick<
  IntroductionProps,
  | 'focusKeywords'
  | 'githubLink'
  | 'linkedinLink'
  | 'metrics'
  | 'name'
  | 'pillars'
  | 'role'
  | 'tagline'
>;

export const defaultProfile: Record<Language, ProfileData> = {
  en: {
    githubLink: '/github',
    linkedinLink: '/linkedin',
    role: 'Frontend Engineer',
    name: 'Junwon Park',
    tagline: 'Frontend Engineer experienced in the entire product lifecycle from inception to growth',
    focusKeywords: ['React', 'TypeScript', 'Next.js', 'React Native', 'TanStack Query', 'Cloudflare'],
    metrics: [
      { value: '23,000', label: 'MAU (Peak)' },
      { value: '46 min', label: 'Avg. Session' },
      { value: '#57', label: 'Google Play' },
    ],
    pillars: [
      {
        index: '01',
        title: 'Production Frontend Systems',
        description: 'Building production UI, server-state, and release workflows for React, React Native, and Svelte products.',
      },
      {
        index: '02',
        title: 'Cross-Platform Delivery',
        description: 'Shipping Android, iOS, Web, and native platform integrations from one coherent product architecture.',
      },
      {
        index: '03',
        title: 'Performance & Verification',
        description: 'Improving web performance and reliability through tests, CI, browser validation, and secure AI-assisted workflows.',
      },
    ],
  },
  ko: {
    githubLink: '/github',
    linkedinLink: '/linkedin',
    role: 'Frontend Engineer',
    name: '박준원',
    tagline: '제품의 시작부터 성장까지 직접 경험한 프론트엔드 엔지니어',
    focusKeywords: ['React', 'TypeScript', 'Next.js', 'React Native', 'TanStack Query', 'Cloudflare'],
    metrics: [
      { value: '23,000', label: 'MAU (최대)' },
      { value: '46분', label: '평균 체류시간' },
      { value: '#57', label: '구글 플레이' },
    ],
    pillars: [
      {
        index: '01',
        title: '프로덕션 프론트엔드 시스템',
        description: 'React, React Native, Svelte 제품에서 UI, 서버 상태, 배포 흐름까지 운영 가능한 구조로 만듭니다.',
      },
      {
        index: '02',
        title: '크로스플랫폼 제품 출시',
        description: 'Android, iOS, Web, 네이티브 연동을 하나의 일관된 제품 아키텍처로 연결해 출시합니다.',
      },
      {
        index: '03',
        title: '성능과 검증',
        description: '테스트, CI, 브라우저 검증과 함께 AI 에이전트를 안정적으로 제어하는 워크플로우로 개발 속도와 품질을 보장합니다.',
      },
    ],
  },
};

export type ProfilePresetData = Pick<IntroductionProps, 'tagline' | 'metrics' | 'pillars'>;

export const profilePresets: Record<Language, Record<string, ProfilePresetData>> = {
  en: {
    'ops-data': {
      tagline: 'Frontend Engineer focused on data-heavy web systems, operational UX, and product reliability',
      metrics: [
        { value: '100k+', label: 'Rows & Logs' },
        { value: '15%', label: 'Bundle Saved' },
        { value: 'TTL', label: 'API Cache' },
      ],
      pillars: [
        {
          index: '01',
          title: 'Operational Web Systems',
          description: 'Building data lookup, table, dashboard, and workflow interfaces for internal users who need speed and accuracy.',
        },
        {
          index: '02',
          title: 'Performance & Reliability',
          description: 'Improving large-data rendering, loading paths, caching, and bundle size so web products stay responsive in real use.',
        },
        {
          index: '03',
          title: 'Platform Delivery Ownership',
          description: 'Owning frontend architecture, release pipelines, monitoring, and cross-platform delivery from zero to operation.',
        },
      ],
    },
    web: {
      tagline: 'Frontend Engineer focused on scalable web products, reusable UI systems, and fast iteration',
      pillars: [
        {
          index: '01',
          title: 'Product UI Systems',
          description: 'Designing reusable interfaces and predictable interactions for customer-facing web products.',
        },
        {
          index: '02',
          title: 'Data-Driven Delivery',
          description: 'Turning complex tables, filters, and dashboards into clear operational workflows.',
        },
        {
          index: '03',
          title: 'Performance Ownership',
          description: 'Keeping bundles, rendering, and interactions responsive as features grow.',
        },
      ],
    },
    rn: {
      tagline: 'Frontend Engineer focused on React Native products, native integration, and mobile performance',
      pillars: [
        {
          index: '01',
          title: 'Cross-Platform Mobile',
          description: 'Shipping shared mobile experiences across iOS and Android with a single React Native codebase.',
        },
        {
          index: '02',
          title: 'Native Integration & Performance',
          description: 'Connecting native modules, animation, and list rendering so mobile screens stay smooth under real use.',
        },
        {
          index: '03',
          title: 'Stable Release Operations',
          description: 'Operating EAS, GitHub Actions, and crash reporting to keep mobile releases predictable and recoverable.',
        },
      ],
    },
    'web-rn': {
      tagline: 'Frontend Engineer focused on shared web/mobile product systems and cross-platform delivery',
      pillars: [
        {
          index: '01',
          title: 'Shared Code Architecture',
          description: 'Keeping product logic, data flow, and UI decisions reusable across web and mobile surfaces.',
        },
        {
          index: '02',
          title: 'Consistent Product Experience',
          description: 'Aligning web and mobile behavior so users see one product, not two separate implementations.',
        },
        {
          index: '03',
          title: 'Operational Delivery',
          description: 'Managing release paths, monitoring, and maintenance so cross-platform systems remain dependable.',
        },
      ],
    },
    ai: {
      tagline: 'Frontend Engineer using verified AI-assisted workflows to ship product UI faster without giving up engineering ownership',
      metrics: [
        { value: '0', label: 'Check Warnings' },
        { value: 'Browser', label: 'UI Verification' },
        { value: 'Review', label: 'Guardrail' },
      ],
      pillars: [
        {
          index: '01',
          title: 'Engineering-Controlled AI',
          description: 'Using AI tools under scoped prompts, code review, type checks, tests, and browser verification.',
        },
        {
          index: '02',
          title: 'Frontend Delivery Speed',
          description: 'Applying automation to repetitive implementation while keeping architecture and product tradeoffs human-owned.',
        },
        {
          index: '03',
          title: 'Verification-First Workflow',
          description: 'Closing each change with lint/check, focused tests, rendered-page inspection, and documented outcomes.',
        },
      ],
    },
  },
  ko: {
    'ops-data': {
      tagline: '데이터 중심 웹 시스템, 운영 UX, 제품 안정성을 설계하는 프론트엔드 엔지니어',
      metrics: [
        { value: '수십만+', label: '행/로그 처리' },
        { value: '15%', label: '번들 절감' },
        { value: 'TTL', label: 'API 캐시' },
      ],
      pillars: [
        {
          index: '01',
          title: '운영 웹 시스템',
          description: '내부 사용자가 빠르고 정확하게 일해야 하는 데이터 조회, 테이블, 대시보드, 워크플로우 UI를 설계합니다.',
        },
        {
          index: '02',
          title: '성능과 안정성',
          description: '대량 데이터 렌더링, 로딩 경로, 캐싱, 번들 사이즈를 개선해 실제 사용 환경에서도 반응성을 유지합니다.',
        },
        {
          index: '03',
          title: '플랫폼 출시 오너십',
          description: '프론트엔드 아키텍처부터 배포 파이프라인, 모니터링, 크로스플랫폼 운영까지 출시 이후를 고려해 책임집니다.',
        },
      ],
    },
    web: {
      tagline: '확장 가능한 웹 제품, 재사용 UI 시스템, 빠른 반복에 집중하는 프론트엔드 엔지니어',
      pillars: [
        {
          index: '01',
          title: '제품형 UI 시스템',
          description: '고객용 웹 제품에 맞는 재사용 가능한 인터페이스와 예측 가능한 상호작용을 설계합니다.',
        },
        {
          index: '02',
          title: '데이터 기반 화면 설계',
          description: '복잡한 테이블, 필터, 대시보드를 운영 흐름으로 읽기 쉬운 구조로 바꿉니다.',
        },
        {
          index: '03',
          title: '성능 오너십',
          description: '기능이 늘어나도 번들, 렌더링, 인터랙션이 느려지지 않도록 관리합니다.',
        },
      ],
    },
    rn: {
      tagline: 'React Native 제품, 네이티브 연동, 모바일 성능에 집중하는 프론트엔드 엔지니어',
      pillars: [
        {
          index: '01',
          title: '크로스플랫폼 모바일',
          description: '하나의 React Native 코드베이스로 iOS와 Android에 공통된 사용자 경험을 제공합니다.',
        },
        {
          index: '02',
          title: '네이티브 연동과 성능',
          description: '네이티브 모듈, 애니메이션, 리스트 렌더링을 연결해 실사용에서도 부드러운 화면을 유지합니다.',
        },
        {
          index: '03',
          title: '안정적인 배포 운영',
          description: 'EAS, GitHub Actions, 크래시 리포팅을 운영해 모바일 릴리즈를 예측 가능하게 관리합니다.',
        },
      ],
    },
    'web-rn': {
      tagline: '웹과 모바일을 함께 설계하고 크로스플랫폼 배송을 책임지는 프론트엔드 엔지니어',
      pillars: [
        {
          index: '01',
          title: '공유 코드 구조',
          description: '제품 로직, 데이터 흐름, UI 결정을 웹과 모바일에서 재사용 가능한 형태로 정리합니다.',
        },
        {
          index: '02',
          title: '일관된 제품 경험',
          description: '웹과 모바일의 동작을 맞춰 사용자가 하나의 제품으로 느끼도록 만듭니다.',
        },
        {
          index: '03',
          title: '운영형 배포',
          description: '배포 경로, 모니터링, 유지보수를 관리해 크로스플랫폼 시스템을 안정적으로 운영합니다.',
        },
      ],
    },
    ai: {
      tagline: '검증 기반 AI 보조 워크플로우로 제품 UI 출시 속도를 높이되 엔지니어링 오너십을 유지하는 프론트엔드 엔지니어',
      metrics: [
        { value: '0', label: 'check 경고' },
        { value: 'Browser', label: 'UI 검증' },
        { value: 'Review', label: '가드레일' },
      ],
      pillars: [
        {
          index: '01',
          title: '엔지니어가 통제하는 AI',
          description: 'AI 도구를 제한된 프롬프트, 코드 리뷰, 타입 체크, 테스트, 브라우저 검증 안에서만 사용합니다.',
        },
        {
          index: '02',
          title: '프론트엔드 출시 속도',
          description: '반복 구현은 자동화하되 아키텍처와 제품 트레이드오프는 엔지니어가 직접 결정합니다.',
        },
        {
          index: '03',
          title: '검증 우선 워크플로우',
          description: '각 변경을 lint/check, 집중 테스트, 실제 렌더링 확인, 결과 문서화로 마무리합니다.',
        },
      ],
    },
  },
};
