import type {
  ArchiveId,
  CertificateId,
  EducationId,
  OtherExpId,
  WorkExpId,
} from '$lib/data/resume.shared';
import type { MetricItem, PillarItem } from '$lib/types/about';
import type { Language } from '$lib/utils/language';

interface I18nProject {
  title: string;
  description: string;
  metrics?: { label: string; value: string }[];
  detail: string[];
}

interface I18nWorkExp {
  additional?: {
    label: string;
    link: string;
  };
  companyName: string;
  titleBadge?: string;
  highlights?: string[];
  projects: Record<string, I18nProject>;
  role: string;
}

interface I18nOtherExp {
  description: string;
  detail: string[];
  title: string;
  titleBadge?: string;
}

interface I18nArchive {
  description: string;
  detail: string[];
  title: string;
}

export interface I18nData {
  archives: Record<ArchiveId, I18nArchive>;
  certificates: Record<CertificateId, { label: string }>;
  education: Record<EducationId, { major?: string; school: string }>;
  introduction: {
    metrics?: MetricItem[];
    name: string;
    pillars?: PillarItem[];
    tagline: string;
  };
  otherExperiences: Record<OtherExpId, I18nOtherExp>;
  skills: Record<import('$lib/data/resume.shared').SkillId, string>;
  skillDetailsLabel?: Partial<Record<import('$lib/data/resume.shared').SkillId, string>>;
  skillDescriptions?: Partial<Record<import('$lib/data/resume.shared').SkillId, string>>;
  workExperiences: Record<WorkExpId, I18nWorkExp>;
}

export const i18nData: Record<Language, I18nData> = {
  en: {
    skills: {
      languages: 'Languages',
      frameworks: 'Frameworks',
      ui: 'UI & Design System',
      state: 'State & Data',
      performance: 'Animation & Performance',
      backend: 'Backend & Cloud',
      devops: 'DevOps & Infra',
      ai_workflow: 'AI & Agentic Workflow',
    },
    skillDetailsLabel: {
      ai_workflow: 'View AI Strategy & Methodology',
    },
    introduction: {
      name: 'Junwon Park',
      tagline:
        'Frontend Engineer experienced in the entire product lifecycle from inception to growth',
      metrics: [
        { value: '23,000', label: 'MAU (Peak)' },
        { value: '46 min', label: 'Avg. Session' },
        { value: '#57', label: 'Google Play' },
      ],
      pillars: [
        {
          index: '01',
          title: 'Product Ownership & Growth',
          description:
            'Leading the full service lifecycle from idea to operation, driving growth to 23k MAU.',
        },
        {
          index: '02',
          title: 'Sophisticated UI Systems',
          description:
            'Designing optimized components and high-quality UX with low external dependency based on deep platform understanding.',
        },
        {
          index: '03',
          title: 'Rational Engineering',
          description:
            'Prioritizing business context and user value to select and apply the most effective technologies for the situation.',
        },
      ],
    },
    workExperiences: {
      orca_ai: {
        companyName: 'Orca AI Inc.',
        titleBadge: 'Co-Founder',
        role: 'Frontend Lead',
        highlights: [
          'Led full product lifecycle from 0 → 23k MAU, $3k/mo revenue, Google Play #57',
          'Built streaming chat, optimistic UI, and type-safe cache facade with TanStack Query',
          'Architected cross-platform (Android/iOS/Web) React Native app from a single codebase',
        ],
        projects: {
          aira: {
            title: 'aira',
            description: 'Global AI Character Chat Platform',
            metrics: [
              { value: '23k', label: 'MAU (Peak)' },
              { value: '$3,000', label: 'Monthly Revenue' },
              { value: '46 min', label: 'Avg. Session' },
            ],
            detail: [
              "**[Key Achievements]** Achieved 23k MAU and $3,000 monthly revenue with an average session time of 46 minutes — ranked 57th in Google Play Entertainment (as of Feb '25).",
              '**[Streaming Chat & Optimistic UI]** Validated stream chunks at runtime with **Zod** and patched TanStack Query **InfiniteQuery** cache in real-time per chunk to create typing animations. Applied optimistic update pattern via `onMutate` for instant message insertion with rollback on failure.',
              '**[Type-Safe Server State Management]** Designed a **queryData facade** that structures `QueryClient` access by domain, providing hierarchical query key factories for bulk invalidation and type-safe cache get/update/delete operations.',
              '**[Data Persistence & Cache Isolation]** Migrated on-device (Realm) → server (RDB) data without loss using retry logic and transaction flags. Separated **MMKV** into purpose-specific instances (document, cache, settings) and auto-isolated per-user caches via `PersistQueryClientProvider` `buster: uid`.',
              '**[Rendering Performance Optimization]** Maintained stable 60 FPS with **FlashList** View Recycling and **React Compiler**. Handled keyboard-open scroll on the UI thread via **Reanimated** worklet-based `useAnimatedReaction`, eliminating JS thread bottlenecks.',
              '**[Cross-Platform Architecture]** Supported Android, iOS, and Web simultaneously from a single codebase using **Expo Router**. Separated platform-specific Contexts via `.web.tsx` file extensions to prevent native-only packages from leaking into the web bundle. Auto-bound **Unistyles** tokens to React Navigation `ThemeProvider` for synchronized theme switching.',
              '**[Design Token System]** Implemented numeric-scale color palettes and dark/light/auto themes with **Unistyles**. Eliminated theme flicker on app restart via MMKV synchronous reads. Applied fontScale clamping (1–1.2) for accessibility-safe layouts.',
              '**[Type-Safe i18n]** Enforced compile-time translation key validation with **typesafe-i18n** and deferred rendering until Intl polyfills fully loaded to prevent locale glitches. Synchronized OS settings and dayjs on language switch.',
              '**[UX-Centric Monetization]** Designed **Native Ads** UI to prevent CLS and monitored drop-off rates to achieve revenue growth without compromising the user experience.',
              '**[Service Stability]** Built a precise error tracking environment by integrating Sentry and dSYM, and prevented user churn with a rapid rollback process when Android-specific issues arose.',
              '**[Operational Efficiency]** Built CI/CD pipelines using **EAS** and **GitHub Actions** (automated Android closed-track deployment, iOS TestFlight) and established a device compatibility testing process via **Samsung Test Lab**.',
            ],
          },
        },
      },
      vault_micro: {
        companyName: 'Vault Micro',
        role: 'Frontend Developer',
        highlights: [
          'Reduced main bundle by 15% (324KB → 277KB) via Webpack Tree Shaking & Code Splitting',
          'Shipped PWA + Paddle subscription lifecycle for a B2B SaaS product solo',
          'Built reusable admin CRUD components cutting page development time significantly',
        ],
        projects: {
          camerafi_studio: {
            title: 'CameraFi Studio',
            description: 'Web Overlay Scoreboard Service',
            detail: [
              '**[Bundle Size Optimization]** Reduced main bundle size by 15% (324KB → 277KB) and improved TTI by establishing Webpack Tree Shaking & Code Splitting strategies and applying Dynamic Import.',
              '**[Secure Auth Architecture]** Designed a secure login process combining **Firebase Custom Tokens** and **HTTP-only Cookies** to synchronize auth state between client and server.',
              '**[Global SaaS Infrastructure]** Built the entire payment lifecycle using **Paddle**, handling subscriptions and webhook-based renewal processing for a global B2B user base.',
              '**[Custom Cookie Consent]** Developed a native cookie consent banner and control logic from scratch to comply with GDPR/web standards without relying on external scripts, preventing 3rd-party bloat.',
            ],
          },
          admin_dashboard: {
            title: 'B2B Admin Dashboard',
            description: 'Integrated Management System for SaaS',
            detail: [
              '**[Efficiency]** Developed reusable CRUD components using **MUI**, significantly reducing the time required to build new management pages.',
              '**[Data Visualization]** Implemented real-time usage and revenue monitoring dashboards using **Chart.js**.',
            ],
          },
        },
      },
      mnd: {
        companyName: 'Ministry of National Defense',
        role: 'Software Developer',
        highlights: [
          'Built a virtualized Excel viewer handling thousands of rows with 2D cell selection UX',
          'Designed Atomic Design-based component system in a restricted closed-network environment',
          'Integrated Socket.IO for real-time highlight collaboration with mock socket for offline testing',
        ],
        projects: {
          web_viewer: {
            title: 'Web-based Document Viewer',
            description: 'Large-scale Spreadsheet Viewer for Intranet',
            detail: [
              '**[High-Performance Virtualization]** Built an Excel-style grid capable of handling thousands of rows using **react-window**. Optimized row/column rendering to maintain responsiveness under heavy data load.',
              '**[2D Selection UX]** Implemented complex 2D area selection and drag-to-update logic, using **styled-components** for real-time visual feedback.',
              '**[Real-time Collaboration]** Integrated **Socket.IO** to allow multiple users to highlight and comment on document areas simultaneously. Built a custom mock socket environment for robust offline development in restricted networks.',
              '**[Atomic Design System]** Established a scalable component library from scratch using **Atomic Design** principles, ensuring UI consistency across the intranet platform.',
            ],
          },
          mnd_dashboard: {
            title: 'Defense Resource Dashboard',
            description: 'Resource Monitoring & Statistics System',
            detail: [
              '**[Legacy Modernization]** Successfully migrated a legacy statistics system to **React**, improving system reliability and user navigation speed.',
              '**[Complex State Management]** Managed multi-layered resource data using **Redux**, ensuring consistent state across nested dashboard views.',
            ],
          },
        },
      },
    },
    otherExperiences: {
      day_planner: {
        title: 'Day Planner — Cross-platform Scheduler for Time Management',
        description:
          'A cross-platform (iOS/macOS) scheduler app developed as a first Swift project. Features timetable management, auto-focus mode transition, Mac menu bar integration, and CloudKit-based synchronization.',
        detail: [
          '**[Platform-Native Experience]** Built a native macOS Menu Bar app and iOS widgets using **SwiftUI**, managing real-time countdowns and state synchronization across platforms.',
          '**[Automation Integration]** Integrated with **Apple Shortcuts** via deep links to automate system Focus Modes based on the user’s schedule.',
          '**[Agentic Development]** Designed and executed the entire project through an **Agentic Workflow**, leveraging **Claude Code** and custom directives to maintain high velocity and architectural integrity.',
        ],
      },
      today_weather: {
        title: "Today's Weather — Personalized Weather & Lifestyle Guide",
        description:
          "A service providing personalized 'action plans' such as what to wear or whether to bring an umbrella, using high-precision data from the Korea Meteorological Administration and Air Korea.",
        detail: [
          '**[Edge-Optimized Cache]** Implemented a serverless caching strategy using **Upstash Redis** on Vercel icn1 (Seoul) region, reducing upstream API load by 80%.',
          '**[Advanced Native Integration]** Built iOS native widgets using **Swift** and `@bacons/apple-targets`, synchronizing real-time weather data between the web app and home screen.',
          '**[Modern Tech Stack]** Leveraged **Next.js 16 (App Router)** and **React 19** with the **React Compiler** for optimal performance without manual memoization.',
          '**[Agentic Orchestration]** Developed using an advanced AI workflow, utilizing **MCP** to provide the AI agent with real-time documentation and system context for precise implementation.',
        ],
      },
      onelinebank_rebuild: {
        title: 'OnelineBank',
        titleBadge: '2021 Hackathon Finalist',
        description:
          'Advanced to the 2021 Woori Bank Hackathon finals by independently building a fintech app in 5 days. In 2026, fully rewrote the original JavaScript codebase from scratch in TypeScript with a modern stack.',
        detail: [
          '**[Architecture Evolution]** Rebuilt a legacy JS app into a modular, feature-based architecture using **TypeScript** and **Expo Router**, applying production-grade design patterns.',
          '**[Robust Form Handling]** Integrated **TanStack Form** and **Zod** for type-safe schema validation and consistent error handling across the banking flow.',
          '**[Developer Experience]** Optimized the delivery pipeline using **EAS** and automated crash reporting with **Crashlytics**, ensuring a stable demo environment.',
        ],
      },
      campus_town: {
        title: 'Seoul Campus Town Selection (Orca AI)',
        description:
          'Selected for office space and commercialization funding support from the Seoul Metropolitan Government and universities in recognition of business potential and technical capability.',
        detail: [],
      },
      sveltekit_portfolio: {
        title: 'SvelteKit Portfolio Website',
        description:
          'A website maximizing development efficiency and user experience with Svelte 5 (Runes) and Claude Code.',
        detail: [
          '**[Performance-First Hosting]** Migrated from purely static hosting to **Cloudflare Pages**, using **Edge Functions** for zero-latency server-side language detection.',
          '**[Modern Reactivity]** Fully embraced **Svelte 5 Runes** for fine-grained reactivity, reducing runtime overhead and improving code maintainability.',
          '**[AI Infrastructure]** Managed the entire development lifecycle via **AI-agentic orchestration**, using a centralized **dotfiles** repo and **AGENTS.md** as a single source of truth for multiple AI agents.',
        ],
      },
    },
    archives: {
      election_aggregator: {
        title: 'Election News Aggregator',
        description:
          'A project for Hanyang University Software Studio 2. As a team leader, I led the entire process of planning, design, and development, experiencing Serverless architecture.',
        detail: [
          '**[Serverless Architecture]** Architected a real-time news crawler and aggregator using **AWS Amplify** and **GraphQL**, handling high-concurrency during election periods.',
          '**[Leadership]** Led a team of 4 as a project manager, coordinating between design, frontend, and backend tasks to ensure on-time delivery.',
        ],
      },
    },
    certificates: {
      aws: { label: 'AWS training and certification' },
      topcit: { label: 'TOPCIT' },
      linux_master: { label: 'Linux Master Grade 2' },
    },
    education: {
      hanyang: { school: 'Hanyang University', major: 'B.S. in Computer Software Engineering' },
      sejong: { school: 'Sejong Science High School' },
    },
  },
  ko: {
    skills: {
      languages: '언어',
      frameworks: '프레임워크',
      ui: 'UI 및 디자인 시스템',
      state: '상태 및 데이터',
      performance: '애니메이션 및 성능',
      backend: '백엔드 및 클라우드',
      devops: '데브옵스 및 인프라',
      ai_workflow: 'AI 및 에이전틱 워크플로우',
    },
    skillDetailsLabel: {
      ai_workflow: 'AI 활용 전략 및 방법론 보기',
    },
    introduction: {
      name: '박준원',
      tagline: '제품의 시작부터 성장까지 직접 경험한 프론트엔드 엔지니어',
      metrics: [
        { value: '23,000', label: 'MAU (최대)' },
        { value: '46분', label: '평균 체류시간' },
        { value: '#57', label: '구글 플레이' },
      ],
      pillars: [
        {
          index: '01',
          title: '제품 오너십 및 성장',
          description:
            '아이디어 구상부터 운영까지 제품의 전체 생애 주기를 주도하며, 2.3만 명의 MAU 성장을 이끌어냈습니다.',
        },
        {
          index: '02',
          title: '정교한 UI 시스템',
          description:
            '플랫폼에 대한 깊은 이해를 바탕으로 외부 의존성을 최소화한 최적의 컴포넌트와 고품질의 UX를 설계합니다.',
        },
        {
          index: '03',
          title: '합리적인 엔지니어링',
          description:
            '비즈니스 상황과 사용자 가치를 최우선으로 고려하여 현재에 가장 필요한 기술을 선택하고 적용합니다.',
        },
      ],
    },
    workExperiences: {
      orca_ai: {
        companyName: 'Orca AI Inc.',
        titleBadge: 'Co-Founder',
        role: '프론트엔드 리드',
        highlights: [
          '0 → 2.3만 MAU, 월 매출 $3k, 구글 플레이 엔터테인먼트 57위 달성',
          '스트리밍 채팅, 낙관적 UI, TanStack Query 기반의 타입 안전한 캐시 파사드 구축',
          '단일 코드베이스 기반 안드로이드/iOS/웹 크로스 플랫폼 아키텍처 설계',
        ],
        projects: {
          aira: {
            title: '아이라 (aira)',
            description: '글로벌 AI 캐릭터 채팅 플랫폼',
            metrics: [
              { value: '2.3만', label: '최고 MAU' },
              { value: '$3,000', label: '월 매출' },
              { value: '46분', label: '평균 체류 시간' },
            ],
            detail: [
              '**[주요 성과]** MAU 2.3만 명, 월 매출 $3,000, 평균 체류 시간 46분 달성 — 구글 플레이 엔터테인먼트 부문 최고 57위 기록 (25년 2월 기준).',
              '**[스트리밍 채팅 및 낙관적 UI]** 스트림 청크를 **Zod**로 실시간 검증하고, TanStack Query **InfiniteQuery** 캐시를 직접 패치하여 끊김 없는 타이핑 애니메이션을 구현했습니다. `onMutate`를 통한 낙관적 업데이트로 즉각적인 피드백을 제공했습니다.',
              '**[타입 안전한 캐시 파사드]** QueryClient를 직접 다루는 대신 도메인별로 구조화된 **queryData 파사드**를 설계했습니다. 계층적 쿼리 키 팩토리를 통해 일괄 무효화 및 타입 안전한 CRUD 작업을 수행합니다.',
              '**[데이터 영속화 및 격리]** Realm에서 서버 DB로 대화 데이터를 무유실 마이그레이션했습니다. **MMKV**를 용도별 인스턴스로 분리하고, `PersistQueryClientProvider`의 `buster` 옵션으로 사용자별 캐시를 자동 격리했습니다.',
              '**[렌더링 성능 최적화]** **FlashList**의 뷰 재사용과 **React Compiler** 도입으로 60 FPS의 성능을 유지했습니다. 키보드 오픈 시의 스크롤 처리를 **Reanimated** 워클릿을 통해 UI 스레드에서 직접 처리하여 병목을 제거했습니다.',
              '**[크로스 플랫폼 아키텍처]** **Expo Router**를 기반으로 하나의 코드로 앱과 웹을 동시 지원합니다. `.web.tsx` 확장자를 활용해 플랫폼별 컨텍스트를 분리하고, **Unistyles** 토큰을 테마 시스템에 자동 바인딩했습니다.',
              '**[디자인 토큰 시스템]** **Unistyles**로 숫자 스케일 기반 팔레트와 다크/라이트 테마를 구축했습니다. MMKV 동기 읽기로 앱 재시작 시 테마 깜빡임을 해결하고, 접근성 설정을 고려한 폰트 스케일링 유틸을 적용했습니다.',
              '**[타입 안전한 i18n]** **typesafe-i18n**으로 번역 키를 컴파일 타임에 검증합니다. Intl 폴리필 로드 완료 전까지 렌더링을 차단하여 로케일 오작동을 방지하고, 언어 전환 시 OS 설정을 동기화했습니다.',
              '**[비즈니스 모델 구축]** 레이아웃 시프트를 방지한 **네이티브 광고** UI 설계 및 결제 전환율 모니터링을 통해 사용자 경험을 해치지 않는 수익 성장을 이끌어냈습니다.',
              '**[서비스 안정성]** Sentry와 dSYM 연동으로 정밀한 에러 추적 환경을 구축하고, 안드로이드 특정 기기 이슈 발생 시 신속한 롤백 프로세스를 통해 유저 이탈을 방지했습니다.',
              '**[운영 효율화]** **EAS**와 **GitHub Actions**로 안드로이드 폐쇄 테스트 및 iOS TestFlight 배포 파이프라인을 자동화하고, **삼성 테스트랩**을 통한 기기 호환성 검증 프로세스를 수립했습니다.',
            ],
          },
        },
      },
      vault_micro: {
        companyName: '볼트마이크로 (Vault Micro)',
        role: '프론트엔드 개발자',
        highlights: [
          'Webpack 트리 쉐이킹 및 코드 스플리팅 최적화로 메인 번들 15% 감량 (324KB → 277KB)',
          'B2B SaaS 제품의 PWA 전환 및 Paddle 구독 결제 시스템 1인 전담 구축',
          '재사용 가능한 CRUD 컴포넌트 라이브러리 구축으로 관리자 페이지 개발 공수 획기적 단축',
        ],
        projects: {
          camerafi_studio: {
            title: '카메라파이 스튜디오',
            description: '웹 기반 방송용 오버레이 스코어보드 서비스',
            detail: [
              '**[번들 사이즈 최적화]** Webpack 트리 쉐이킹 및 코드 스플리팅 전략을 수립하고 Dynamic Import를 적용하여 메인 번들 사이즈를 15% 감량, TTI를 단축했습니다.',
              '**[보안 인증 아키텍처]** **Firebase Custom Token**과 **HTTP-only Cookie**를 결합한 인증 프로세스를 설계하여 클라이언트와 서버 간의 인증 상태를 안전하게 동기화했습니다.',
              '**[글로벌 수익화 인프라]** **Paddle** 결제 모듈을 연동하여 글로벌 사용자를 위한 구독 상태 관리 및 웹훅 기반의 결제 갱신 처리 시스템을 구축했습니다.',
              '**[자체 쿠키 동의 시스템]** 서드파티 스크립트 없이 GDPR 규정을 준수하는 쿠키 동의 배너와 제어 로직을 직접 개발하여 불필요한 외부 라이브러리 의존성을 제거했습니다.',
            ],
          },
          admin_dashboard: {
            title: 'B2B 통합 관리자 대시보드',
            description: 'SaaS 관리를 위한 통합 관리 시스템',
            detail: [
              '**[개발 효율성]** **MUI**를 기반으로 재사용 가능한 CRUD 컴포넌트들을 개발하여, 새로운 관리 페이지 구축에 필요한 공수를 크게 줄였습니다.',
              '**[데이터 시각화]** **Chart.js**를 활용하여 서비스 이용량 및 매출 지표를 실시간으로 모니터링할 수 있는 대시보드를 구현했습니다.',
            ],
          },
        },
      },
      mnd: {
        companyName: '대한민국 육군',
        role: '소프트웨어 개발병',
        highlights: [
          '수천 행의 데이터를 처리하는 가상화 엑셀 뷰어 및 2D 영역 선택 UX 구현',
          '폐쇄망 개발 환경에서 Atomic Design 기반의 컴포넌트 시스템 직접 설계 및 도입',
          'Socket.IO를 활용한 실시간 협업 하이라이트 기능 및 오프라인 테스트용 Mock 서버 구축',
        ],
        projects: {
          web_viewer: {
            title: '웹 기반 문서 뷰어',
            description: '인트라넷용 대용량 스프레드시트 뷰어',
            detail: [
              '**[고성능 가상화]** **react-window**를 활용하여 수천 개의 행을 끊김 없이 렌더링하는 엑셀 스타일의 그리드를 구축했습니다. 대량 데이터 로드 시의 응답성을 확보했습니다.',
              '**[2D 영역 선택 UX]** 복잡한 2차원 영역 선택 및 드래그 업데이트 로직을 구현하고, **styled-components**를 사용해 실시간 시각적 피드백을 최적화했습니다.',
              '**[실시간 협업 기능]** **Socket.IO**를 연동하여 여러 사용자가 동시에 문서의 특정 영역을 강조하고 코멘트를 남길 수 있는 기능을 구현했습니다. 오프라인 개발을 위한 커스텀 Mock 소켓 환경을 구축했습니다.',
              '**[Atomic 디자인 시스템]** **Atomic Design** 원칙에 따라 컴포넌트 라이브러리를 바닥부터 설계하여, 인트라넷 플랫폼 전체의 UI 일관성을 확보했습니다.',
            ],
          },
          mnd_dashboard: {
            title: '국방 자원 모니터링 대시보드',
            description: '자원 현황 관리 및 통계 시스템',
            detail: [
              '**[레거시 현대화]** 기존의 노후화된 통계 시스템을 **React** 기반으로 성공적으로 마이그레이션하여 시스템 안정성과 유저 내비게이션 속도를 개선했습니다.',
              '**[복잡한 상태 관리]** **Redux**를 사용하여 다층적인 자원 데이터를 체계적으로 관리하고, 복잡한 대시보드 뷰 간의 데이터 일관성을 유지했습니다.',
            ],
          },
        },
      },
    },
    otherExperiences: {
      day_planner: {
        title: 'Day Planner — 시간 관리를 위한 크로스 플랫폼 스케줄러',
        description:
          '첫 Swift 프로젝트로 개발한 크로스 플랫폼(iOS/macOS) 앱. 타임테이블 관리, 자동 집중모드 전환, Mac 상태바 연동 및 CloudKit 동기화 구현.',
        detail: [
          '**[네이티브 경험]** **SwiftUI**를 사용하여 macOS 상태바 앱과 iOS 위젯을 구축했습니다. 플랫폼 간 실시간 카운트다운 및 상태 동기화를 구현했습니다.',
          '**[시스템 자동화]** **애플 단축어(Shortcuts)** 연동을 통해 사용자의 일정에 맞춰 집중 모드가 자동으로 전환되는 시스템 환경을 설계했습니다.',
          '**[에이전틱 개발]** **Claude Code**와 커스텀 지침을 활용한 **에이전틱 워크플로우**를 설계하여, 직접적인 코드 작성보다 아키텍처 설계와 검증에 집중한 고효율 개발을 수행했습니다.',
        ],
      },
      today_weather: {
        title: '오늘날씨 (Today’s Weather) — 맞춤형 날씨 및 생활 가이드',
        description:
          '기상청 및 에어코리아 데이터를 활용하여 사용자에게 최적의 복장과 준비물을 제안하는 개인화 서비스.',
        detail: [
          '**[엣지 최적화 캐시]** Vercel icn1(서울) 리전과 **Upstash Redis**를 활용한 서버리스 캐싱 전략을 구축하여 업스트림 API 부하를 80% 이상 절감했습니다.',
          '**[고도화된 네이티브 연동]** **Swift**와 `@bacons/apple-targets`를 활용해 iOS 네이티브 위젯을 개발, 웹 앱과 홈 화면 위젯 간의 실시간 데이터 동기화를 구현했습니다.',
          '**[최신 스택 도입]** **Next.js 16 (App Router)** 및 **React 19**를 선제적으로 도입하고 **React Compiler**를 활용하여 수동 메모이제이션 없는 최적의 성능을 확보했습니다.',
          '**[에이전틱 오케스트레이션]** **MCP**를 통해 AI 에이전트에게 실시간 도큐먼트와 시스템 컨텍스트를 제공하여 고도로 정밀한 기능 구현을 주도했습니다.',
        ],
      },
      onelinebank_rebuild: {
        title: '한줄은행 (리빌드)',
        titleBadge: '2021 해커톤 본선 진출작',
        description:
          '2021 우리은행 해커톤 출품작을 최신 기술 스택인 TypeScript, Expo Router 등으로 전면 재구성한 성장 스토리 기반 프로젝트.',
        detail: [
          '**[아키텍처의 진화]** 레거시 JS 앱을 **TypeScript**와 **Expo Router** 기반의 기능 단위(Feature-based) 모듈 아키텍처로 리빌딩하여 생산성을 극대화했습니다.',
          '**[견고한 폼 핸들링]** **TanStack Form**과 **Zod**를 결합하여 타입 안전한 스키마 검증과 일관된 에러 피드백 시스템을 뱅킹 플로우에 적용했습니다.',
          '**[개발자 경험 개선]** **EAS**를 통한 배포 자동화와 **Crashlytics** 연동으로 안정적인 데모 환경과 장애 추적 인프라를 구축했습니다.',
        ],
      },
      campus_town: {
        title: '서울 캠퍼스타운 사업 선정 (Orca AI)',
        description:
          '사업의 시장성과 기술력을 인정받아 서울시 및 대학으로부터 사무 공간 및 사업화 자금을 지원받았습니다.',
        detail: [],
      },
      sveltekit_portfolio: {
        title: 'SvelteKit 포트폴리오',
        description: 'Svelte 5 (Runes)와 AI 에이전트를 활용하여 구축한 고성능 개인 웹사이트.',
        detail: [
          '**[성능 중심 호스팅]** 순수 정적 호스팅에서 **Cloudflare Pages**로 전환하고, **Edge Functions**를 통해 요청 단계에서 언어를 자동 감지하는 무지연 다국어 처리를 구현했습니다.',
          '**[모던 반응성 모델]** **Svelte 5 Runes**를 전면 도입하여 세밀한 반응성 제어를 실현하고, 런타임 오버헤드를 줄여 유지보수 효율을 높였습니다.',
          '**[AI 에이전트 인프라]** 중앙 관리형 **dotfiles**와 **AGENTS.md**를 구축하여 여러 AI 에이전트가 단일 소스를 공유하며 작업을 수행하는 에이전틱 개발 환경을 설계했습니다.',
        ],
      },
    },
    archives: {
      election_aggregator: {
        title: '선거 뉴스 어그리게이터',
        description:
          '한양대학교 소프트웨어 스튜디오 2 프로젝트. 팀장으로서 서버리스 아키텍처 기반의 기획, 디자인, 개발 전 과정을 주도했습니다.',
        detail: [
          '**[서버리스 아키텍처]** **AWS Amplify**와 **GraphQL**을 사용하여 실시간 뉴스 크롤러 및 어그리게이터를 설계, 선거 기간의 고동시성 트래픽을 안정적으로 처리했습니다.',
          '**[리더십]** 팀장으로서 디자인, 프론트엔드, 백엔드 파트 간의 공정을 조율하고 일정을 관리하여 성공적인 산출물을 도출했습니다.',
        ],
      },
    },
    certificates: {
      aws: { label: 'AWS training and certification' },
      topcit: { label: 'TOPCIT' },
      linux_master: { label: '리눅스 마스터 2급' },
    },
    education: {
      hanyang: { school: '한양대학교 ', major: '컴퓨터소프트웨어학부 학사' },
      sejong: { school: '세종과학고등학교' },
    },
  },
};
