import type {
  ArchiveId,
  CertificateId,
  EducationId,
  OtherExpId,
  WorkExpId,
} from '$lib/data/resume.shared';
import type { Language } from '$lib/utils/language';

interface I18nProject {
  title: string;
  description: string;
  detail: string[];
}

interface I18nWorkExp {
  additional?: {
    label: string;
    link: string;
  };
  companyName: string;
  projects: Record<string, I18nProject>;
  role: string;
}

interface I18nOtherExp {
  description: string;
  detail: string[];
  title: string;
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
    briefing: string[];
    name: string;
    tagline: string;
  };
  otherExperiences: Record<OtherExpId, I18nOtherExp>;
  workExperiences: Record<WorkExpId, I18nWorkExp>;
}

export const i18nData: Record<Language, I18nData> = {
  en: {
    introduction: {
      name: 'Junwon Park',
      tagline:
        'Frontend Engineer experienced in the entire product lifecycle from inception to growth',
      briefing: [
        'Grew a service from the idea stage to 23k MAU by leading the full product lifecycle — planning, development, deployment, and operation — gaining firsthand experience in what it takes to build a stable, real-world service.',
        'I minimize reliance on external UI libraries by designing purpose-built components optimized for each requirement, assembling a cohesive UI system from the ground up. By deeply understanding platform internals, I implement precise interactions that raise the bar for UX quality.',
        'Rather than chasing the latest or flashiest technologies, I pursue pragmatic engineering — selecting and applying tools based on current business context and whether they are truly what users need.',
      ],
    },
    workExperiences: {
      orca_ai: {
        companyName: 'Orca AI Inc.',
        role: 'Co-Founder / Frontend Lead',
        projects: {
          aira: {
            title: 'aira',
            description:
              'A global AI character chat platform. As a Co-Founder and Frontend Lead, I led the entire process of planning, development, and operation.',
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
        projects: {
          camerafi_studio: {
            title: 'CameraFi Studio',
            description:
              'A web overlay scoreboard service. Started as a solo developer, I built the frontend architecture and grew it into a core company project.',
            detail: [
              '**[Bundle Size Optimization]** Reduced main bundle size by 15% (324KB → 277KB) and improved TTI by establishing Webpack Tree Shaking & Code Splitting strategies and applying Dynamic Import.',
              '**[Security & Auth]** Removed external dependencies and enhanced security by directly implementing Cookie Consent and token-based authentication logic instead of relying on libraries.',
              '**[Global Architecture]** Designed a flexible structure for design changes by building an i18n system and a **Global Theme System** combining MUI and Styled-components.',
              '**[Service Enhancement]** Implemented app-like installation (A2HS) by introducing Next-PWA and established a subscription lifecycle management process by integrating Paddle payment solution.',
            ],
          },
          admin_dashboard: {
            title: 'Internal Admin Dashboard',
            description: 'An internal service management and statistics dashboard.',
            detail: [
              '**[Large List Optimization]** Implemented Intersection Observer-based Infinite Scroll to enable seamless navigation of hundreds of thousands of video lists, benchmarking YouTube UI.',
              '**[Productivity Improvement]** Abstracted CRUD logic and Chart.js visualization modules into reusable components, accelerating the development speed of repetitive admin pages.',
              '**[Infrastructure]** Built and managed SPA deployment pipelines using Firebase Hosting.',
            ],
          },
        },
      },
      mnd: {
        companyName: 'Ministry of National Defense',
        role: 'Software Developer',
        additional: {
          label: 'Recommendation Letter',
          link: '/certificates/recommendation-letter-en.pdf',
        },
        projects: {
          web_viewer: {
            title: 'Web-based Document Viewer',
            description:
              'A document viewer development project in a closed network environment with restricted external library access.',
            detail: [
              '**[Large-Scale Data Rendering]** Introduced **React Table** and **Virtualization** to prevent rendering delays when processing thousands of rows of Excel data, enabling seamless scrolling.',
              '**[Spreadsheet-Style UX]** Implemented **2D cell range selection** (including multi-range with modifier keys), **Excel-style column labels (A–Z, AA…)** , and **immutable selection state with Immer**.',
              '**[Viewer-Specific Virtualization]** Used **react-window** (InfiniteLoader) for row virtualization on the grid and **react-virtualized CellMeasurerCache** for variable-height lines in the text viewer.',
              '**[Collaboration Boundary]** Integrated **Socket.IO** for highlight lifecycle events and a **mock socket** for demos/tests without a live server.',
              '**[Architecture Design]** Built a scalable shared component system based on **Atomic Design Pattern** and designed reusable **Custom Hooks** to separate business logic from the UI layer.',
            ],
          },
          mnd_dashboard: {
            title: 'MND Dashboard Page',
            description:
              'Maintenance and enhancement project for the dashboard webpage within the Ministry of National Defense intranet.',
            detail: [
              '**[Maintenance]** Customized the **Ant Design** library to build dashboard UI components and secured system stability through legacy code refactoring.',
            ],
          },
        },
      },
    },
    otherExperiences: {
      today_weather: {
        title: "Today's Weather — Personalized Weather & Lifestyle Guide",
        description:
          "A service providing personalized 'action plans' such as what to wear or whether to bring an umbrella, using high-precision data from the Korea Meteorological Administration and Air Korea.",
        detail: [
          '**[Next.js & React Ecosystem]** Adopted the latest framework versions and enabled **React Compiler** for optimal rendering performance without manual memoization.',
          '**[Monorepo Architecture]** Built a **pnpm Workspaces** monorepo to share 100% of business logic and TypeScript types across Web (Next.js) and Mobile (Expo).',
          '**[Edge-Optimized Caching]** Implemented **Upstash Redis** caching in the Seoul region (`icn1`) to bypass IP restrictions on public APIs and reduce upstream load by 80%.',
          '**[Native Integration]** Built Swift-based iOS Home Screen widgets using **@bacons/apple-targets** within an Expo project for real-time data synchronization.',
          '**[Recommendation Engine]** Developed an intelligent logic analyzing temperature, wind speed, POP, PTY, and dust levels to suggest outfits, umbrellas, and masks.',
        ],
      },
      onelinebank_rebuild: {
        title: 'OnelineBank — 2021 Woori Bank Hackathon Rebuild',
        description:
          'A personal project fully rewriting the 2021 Woori Bank Hackathon submission with a modern tech stack. The original JavaScript codebase, written rapidly under time pressure, was rebuilt from scratch in TypeScript with current libraries.',
        detail: [
          '**[Tech Modernization]** Full JavaScript → TypeScript migration and architecture redesign with **Expo Router** file-based routing',
          '**[Core Feature]** Implemented natural language remittance processing logic that auto-parses bank name, account number, and amount from chat text',
          '**[Server State]** Adopted **TanStack Query v5** with a **persisted query client** (async storage) for query caching and offline support',
          '**[Form & Validation]** Type-safe input handling via **TanStack Form v1** + **Zod v4** combination',
          '**[Mock API]** Built a mock server using **Expo API Routes** to replicate the full financial transaction flow, replacing the now-blocked Woori Bank Open API',
          '**[Styling]** Applied a consistent utility-first design system using **NativeWind v5** (Tailwind CSS-based)',
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
          '**[Zero-flash i18n]** Parsed `Accept-Language` header server-side and forwarded the resolved locale via cookie to `locals`, enabling flash-free multilingual switching',
          '**[Performance Optimization]** Achieved 100 points in Lighthouse Performance/Accessibility through Pure CSS design (SEO intentionally blocked for privacy)',
        ],
      },
    },
    archives: {
      election_aggregator: {
        title: 'Election News Aggregator',
        description:
          'A project for Hanyang University Software Studio 2. As a team leader, I led the entire process of planning, design, and development, experiencing Serverless architecture.',
        detail: [
          '**[Serverless Adoption]** Built authentication (Login/Signup) and data management environments using AWS Amplify without a separate backend.',
          '**[Data Visualization]** Rendered card news by parsing metadata (OG Tags) from Naver News API and visualized poll data using **Recharts**.',
          '**[Component Design]** Designed a reusable component hierarchy using React and styled-components.',
        ],
      },
      onelinebank_legacy: {
        title: 'OnelineBank (2021 Woori Bank Hackathon Finalist)',
        description:
          'Advanced to the finals by independently planning and developing a fintech app with remittance and biometric authentication features, learning React Native with a rapid learning curve in 5 days.',
        detail: [
          '**[Conversational Interface]** Implemented natural language remittance processing logic via text parsing.',
          '**[Security & API]** Processed actual financial transactions through Biometrics and Woori Bank Open API integration.',
        ],
      },
    },
    certificates: {
      aws: { label: 'AWS training and certification' },
      topcit: { label: 'TOPCIT' },
      linux_master: { label: 'Linux Master Level 2' },
    },
    education: {
      hanyang: { school: 'Hanyang University', major: 'B.S. in Computer Software Engineering' },
      sejong: { school: 'Sejong Science High School' },
    },
  },
  ko: {
    introduction: {
      name: '박준원',
      tagline: '제품의 시작부터 성장까지 직접 경험한 프론트엔드 엔지니어',
      briefing: [
        '아이디어 단계에서 시작해 MAU 2.3만 명 규모의 서비스로 직접 성장시킨 경험이 있습니다. 기획, 개발, 배포, 운영의 전 과정을 주도하며 실제 서비스를 안정적으로 만드는 법을 익혔습니다.',
        '외부 UI 라이브러리 의존을 최소화하고 요구사항에 최적화된 컴포넌트를 직접 설계해 UI 시스템을 구축합니다. 플랫폼 동작 원리를 깊이 이해하고, 이를 바탕으로 정교한 인터랙션을 구현해 UX 완성도를 높입니다.',
        '무조건 최신 기술이나 화려한 기술을 쫓기보다, 현재 비즈니스 상황과 "사용자에게 진짜 필요한가"를 기준으로 기술을 선택하고 적용하는 합리적인 엔지니어링을 지향합니다.',
      ],
    },
    workExperiences: {
      orca_ai: {
        companyName: '오르카에이아이 주식회사',
        role: 'Co-Founder / Frontend Lead',
        projects: {
          aira: {
            title: '아이라',
            description:
              '글로벌 AI 캐릭터 채팅 플랫폼입니다. 공동 창업자이자 프론트엔드 리드로서 기획, 개발, 운영 전 과정을 주도했습니다.',
            detail: [
              "**[핵심 성과]** MAU 2.3만 명, 월 매출 $3,000 달성 및 평균 체류 시간 46분의 고몰입 서비스 구축 (Google Play 엔터테인먼트 최고 57위 / '25.02 기준)",
              '**[스트리밍 채팅 & 낙관적 UI]** 스트림 청크를 **Zod**로 런타임 타입 검증하고, TanStack Query의 **InfiniteQuery** 캐시를 청크마다 실시간 패치하여 타이핑 애니메이션을 구현했습니다. `onMutate`로 사용자 메시지를 즉시 삽입하고, 실패 시 롤백하는 낙관적 업데이트 패턴을 적용했습니다.',
              '**[타입 안전한 서버 상태 관리]** `QueryClient`를 도메인별로 구조화한 **queryData 파사드**를 설계하여 계층적 쿼리 키 팩토리 기반의 일괄 무효화, 타입 안전한 캐시 조회·수정·삭제를 제공했습니다.',
              '**[데이터 영속화 & 캐시 격리]** 온디바이스(Realm) → 서버(RDB) 마이그레이션에서 재시도 로직과 트랜잭션 플래그로 수만 명의 데이터를 유실 없이 이관했습니다. **MMKV**를 용도별 인스턴스(문서·캐시·설정)로 분리하고, `PersistQueryClientProvider`의 `buster: uid`로 사용자별 캐시를 자동 격리했습니다.',
              '**[렌더링 퍼포먼스 최적화]** **FlashList** View Recycling과 **React Compiler**로 60 FPS를 안정적으로 유지하고, **Reanimated** worklet 기반 `useAnimatedReaction`으로 키보드 열림 시 UI 스레드에서 스크롤을 처리하여 JS 스레드 병목을 해소했습니다.',
              '**[크로스 플랫폼 설계]** **Expo Router** 기반 단일 코드베이스로 Android, iOS, Web을 동시에 지원하고, `.web.tsx` 파일 확장자를 활용한 플랫폼별 Context 분리로 네이티브 전용 패키지의 웹 번들 포함을 방지했습니다. **Unistyles** 토큰을 React Navigation `ThemeProvider`에 자동 바인딩하여 테마 전환 시 일괄 반영했습니다.',
              '**[디자인 토큰 시스템]** **Unistyles**로 숫자 스케일 기반 색상 팔레트와 다크/라이트/자동 테마를 구현하고, MMKV 동기 읽기로 앱 재시작 시 테마 깜빡임을 완전히 제거했습니다. 접근성을 고려한 fontScale 클램핑(1~1.2)으로 레이아웃 깨짐을 방지했습니다.',
              '**[타입 안전한 다국어]** **typesafe-i18n**으로 번역 키를 컴파일 타임에 검증하고, Intl 폴리필 로드 완료 후 렌더링하여 로케일 오작동을 방지했습니다. 언어 전환 시 OS 설정·dayjs를 동기화했습니다.',
              '**[UX 중심 수익화]** **Native Ads** UI를 직접 설계하여 CLS를 방지하고, 이탈률 모니터링을 통해 UX를 해치지 않는 매출 성장을 달성했습니다.',
              '**[서비스 안정성]** Sentry 및 dSYM 연동으로 정밀한 에러 트래킹 환경을 구축하고, 특정 Android 기기 이슈 발생 시 **신속한 롤백** 프로세스로 사용자 이탈을 방어했습니다.',
              '**[운영 효율화]** **EAS** 및 **GitHub Actions** 기반의 CI/CD 파이프라인(Android 비공개 트랙 자동 배포, iOS TestFlight)을 구축하고, **Samsung Test Lab**을 활용한 기기 호환성 테스트 프로세스를 정립했습니다.',
            ],
          },
        },
      },
      vault_micro: {
        companyName: '볼트마이크로',
        role: 'Frontend Developer',
        projects: {
          camerafi_studio: {
            title: 'CameraFi Studio',
            description:
              '웹 오버레이 스코어보드 서비스입니다. 1인 개발로 시작하여 프론트엔드 아키텍처를 구축하고 사내 핵심 프로젝트로 성장시켰습니다.',
            detail: [
              '**[번들 사이즈 최적화]** Webpack 설정 최적화(Tree Shaking, Code Splitting) 및 Dynamic Import 적용으로 메인 번들 사이즈 15% 감량(324KB → 277KB) 및 TTI 단축',
              '**[보안 및 인증]** 라이브러리에 의존하지 않고 Cookie Consent 및 토큰 기반 인증 로직을 직접 구현하여 외부 의존성 제거 및 보안성 강화',
              '**[글로벌 아키텍처]** i18n 시스템 및 MUI와 Styled-components를 결합한 **전역 테마 시스템**을 구축하여 디자인 변경에 유연한 구조 설계',
              '**[서비스 고도화]** Next-PWA를 도입하여 앱 수준의 설치 경험(A2HS)을 제공하고, Paddle 결제 솔루션을 연동하여 정기 구독 라이프사이클 관리',
            ],
          },
          admin_dashboard: {
            title: 'Internal Admin Dashboard',
            description: '사내 서비스 관리 및 통계 대시보드입니다.',
            detail: [
              '**[대용량 리스트 최적화]** 유튜브 UI를 벤치마킹하여 수십만 건의 영상 목록을 끊김 없이 탐색할 수 있도록 Intersection Observer 기반의 무한 스크롤(Infinite Scroll) 구현',
              '**[생산성 향상]** 데이터 조회·수정·삭제(CRUD) 로직과 Chart.js 시각화 모듈을 재사용 가능한 컴포넌트로 추상화하여 반복되는 어드민 페이지 개발 속도 단축',
              '**[인프라]** Firebase Hosting을 활용한 SPA 배포 파이프라인 구축 및 관리',
            ],
          },
        },
      },
      mnd: {
        companyName: '대한민국 국방부',
        role: 'Software Developer (SW개발병)',
        additional: {
          label: '추천서',
          link: '/certificates/recommendation-letter-ko.pdf',
        },
        projects: {
          web_viewer: {
            title: '웹 기반 문서 뷰어',
            description:
              '외부 라이브러리 사용이 제한된 폐쇄망 환경에서의 문서 뷰어 개발 프로젝트입니다.',
            detail: [
              '**[대용량 데이터 렌더링]** **React Table** 및 **Virtualization(가상화)** 기법 도입으로 수천 행의 엑셀 데이터 처리 시 발생하는 렌더링 지연을 방지하고 끊김 없는 스크롤 경험 구현',
              '**[스프레드시트형 UX]** **2D 셀 영역 드래그 선택**(보조키 기반 다중 영역 포함), **엑셀식 열 라벨(A–Z, AA…)** 생성, **Immer 기반 불변 선택 상태**로 복잡한 인터랙션을 안전하게 관리',
              '**[뷰어별 가상화]** 그리드는 **react-window**(InfiniteLoader)로 행 가상 스크롤, 가변 높이 **텍스트 뷰어**는 **react-virtualized CellMeasurerCache**로 줄 높이 측정·캐시하여 뷰 특성에 맞게 최적화',
              '**[협업 경계]** 하이라이트 등 이벤트를 **Socket.IO**로 서버와 계약화하고, **mock 소켓**으로 실서버 없이 데모·테스트가 가능하도록 분리',
              '**[아키텍처 설계]** 서비스 확장성을 고려한 **Atomic Design Pattern** 기반 공용 컴포넌트 시스템 구축 및 재사용 가능한 **Custom Hook** 설계로 비즈니스 로직과 UI 레이어 분리',
            ],
          },
          mnd_dashboard: {
            title: '국방부 대시보드 페이지',
            description: '국방부 망 내 대시보드 웹페이지 유지보수 및 고도화 프로젝트입니다.',
            detail: [
              '**[유지보수]** **Ant Design** 커스터마이징으로 대시보드 UI 컴포넌트 개발 및 레거시 코드 리팩토링을 통한 시스템 안정성 확보',
            ],
          },
        },
      },
    },
    otherExperiences: {
      today_weather: {
        title: '오늘날씨 — 개인화 날씨 및 생활 가이드 서비스',
        description:
          '대한민국 기상청 및 에어코리아의 고정밀 데이터를 활용해 "오늘 어떤 옷을 입을지", "우산을 챙길지" 등 사용자에게 필요한 맞춤형 액션 플랜을 제안하는 서비스입니다.',
        detail: [
          '**[최신 생태계 도입]** **Next.js** 및 **React**를 도입하고 **React Compiler**를 활성화하여 별도의 최적화 선언 없이도 최상의 렌더링 성능을 확보했습니다.',
          '**[모노레포 아키텍처]** **pnpm Workspaces** 기반의 모노레포를 구축하여 웹(Next.js)과 앱(Expo) 간 비즈니스 로직 및 TypeScript 타입을 100% 공유하도록 설계했습니다.',
          '**[에지 최적화 캐싱]** 공공 API의 해외 IP 차단 및 할당량 제한 문제를 해결하기 위해 **서울 리전(icn1)** 에 에지 함수를 배치하고 **Upstash Redis**로 캐싱 전략을 구축했습니다.',
          '**[네이티브 통합]** Expo 프로젝트 내에서 **@bacons/apple-targets**를 활용해 Swift 기반의 **iOS 홈 화면 위젯**을 구현하고 실시간 데이터 동기화를 처리했습니다.',
          '**[데이터 기반 추천 엔진]** 기온, 풍속, 강수 확률, 미세먼지 농도 등을 종합 분석하여 복장(6단계), 우산 지수, 마스크 착용 여부를 제안하는 알고리즘을 구현했습니다.',
        ],
      },
      onelinebank_rebuild: {
        title: '한줄은행 — 2021 우리은행 해커톤 출품작 리빌드',
        description:
          '2021년 우리은행 해커톤 출품작을 최신 기술 스택으로 전면 재작성한 개인 프로젝트입니다. 당시 빠른 러닝커브로 작성했던 JavaScript 코드를 TypeScript와 현대적인 라이브러리로 복각했습니다.',
        detail: [
          '**[기술 현대화]** JavaScript → TypeScript 전면 전환 및 **Expo Router** 기반 파일 시스템 라우팅으로 아키텍처 재설계',
          '**[핵심 기능]** 채팅 텍스트 파싱을 통해 은행명·계좌번호·금액을 자동 인식하는 자연어 송금 처리 로직 구현',
          '**[서버 상태 관리]** **TanStack Query v5**와 **영속 쿼리 클라이언트**(비동기 스토리지)로 쿼리 캐싱 및 오프라인 대응',
          '**[폼 & 검증]** **TanStack Form v1** + **Zod v4** 조합으로 타입 안전한 입력 유효성 처리',
          '**[목업 API]** 현재 차단된 우리은행 오픈 API를 대체하기 위해 **Expo API Route**로 목업 서버를 구현하여 동일한 금융 트랜잭션 플로우 재현',
          '**[스타일링]** **NativeWind v5**(Tailwind CSS 기반)를 도입하여 유틸리티 클래스 기반의 일관된 디자인 시스템 적용',
        ],
      },
      campus_town: {
        title: '서울 캠퍼스 타운 입주 기업 선정 (오르카에이아이)',
        description:
          '사업성과 기술력을 인정받아 서울시 및 대학교로부터 사무 공간 및 사업화 자금 지원 대상에 선정되었습니다.',
        detail: [],
      },
      sveltekit_portfolio: {
        title: 'SvelteKit 포트폴리오 웹사이트',
        description:
          'Svelte 5(Runes) 및 Claude Code를 활용하여 아키텍처 설계 효율과 사용자 경험을 극대화한 웹사이트입니다.',
        detail: [
          '**[Zero-flash i18n]** 서버사이드에서 `Accept-Language` 헤더를 파싱하고 쿠키를 `locals`로 전달하여 클라이언트 깜빡임 없는 다국어 전환 구현',
          '**[성능 최적화]** Pure CSS 기반 설계로 Lighthouse 성능/접근성 100점 달성 (SEO는 의도적 차단)',
        ],
      },
    },
    archives: {
      election_aggregator: {
        title: '대선 뉴스 모아보기 페이지',
        description:
          '한양대학교 소프트웨어스튜디오2 수업 프로젝트입니다. 팀장으로서 기획, 디자인, 개발 전 과정을 주도하며 Serverless 아키텍처를 경험했습니다.',
        detail: [
          '**[Serverless 도입]** AWS Amplify를 활용하여 별도의 백엔드 구축 없이 인증(로그인/회원가입) 및 데이터 관리 환경 구축',
          '**[데이터 시각화]** Naver News API 데이터의 메타데이터(OG Tag)를 파싱하여 카드 뉴스로 렌더링하고, **Recharts**로 여론조사 데이터 시각화',
          '**[컴포넌트 설계]** React 및 styled-components를 활용하여 재사용 가능한 컴포넌트 계층 구조 디자인',
        ],
      },
      onelinebank_legacy: {
        title: '한줄은행 (2021 우리은행 해커톤 본선 진출)',
        description:
          '5일간 React Native를 빠른 러닝 커브로 습득하여 송금 및 생체 인증 기능이 있는 핀테크 앱을 기획부터 개발까지 전담하여 본선에 진출했습니다.',
        detail: [
          '**[대화형 인터페이스]** 텍스트 파싱을 통한 자연어 송금 처리 로직 구현',
          '**[보안 및 API]** 생체 인증(Biometrics) 및 우리은행 오픈 API 연동을 통한 실제 금융 트랜잭션 처리',
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
