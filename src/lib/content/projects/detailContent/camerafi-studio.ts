import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

export const camerafiStudioDetailContent: Record<Language, ProjectDetailBlock[]> = {
  en: [
    {
      id: 'camerafi-studio-en-01',
      type: 'markdown',
      markdown:
        '## Project overview\n\n**"From Solo Project to Core Business Model"**\n\nCameraFi Studio is a production web SaaS that lets users apply overlays — scoreboards, subtitles, and more — to sports matches or broadcast feeds. Starting as a **solo developer, I designed the frontend architecture from scratch** and grew the project into the company\'s second main revenue stream.\n\nThe product covered the full web-service surface area: overlay editing, authenticated dashboards, global **Internationalization (i18n)**, subscription checkout, webhook-based renewal handling, and cookie consent flows. I also improved web application performance through **Webpack configuration optimization**.\n\nThe live link is provided for reference, and the current UI may differ from the version I developed. Instead of outdated screenshots, this page captures the specific features and Webpack optimization metrics from the time of the implementation.',
    },
    {
      id: 'camerafi-studio-en-02',
      type: 'techStack',
    },
    {
      id: 'camerafi-studio-en-03',
      type: 'markdown',
      markdown: '## Key work',
    },
    {
      id: 'camerafi-studio-en-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'SaaS',
          accent: true,
          title: 'Production SaaS surface from editor to subscription operations',
          detail:
            'Built the frontend for the actual product flow, not a demo: authenticated account pages, overlay editing screens, global language handling, Paddle subscription checkout, webhook-aware subscription state, and GDPR-oriented cookie consent. This made the project presentable as a revenue-generating web SaaS rather than a one-off internal tool.',
        },
        {
          tag: 'Performance',
          title: '15% bundle size reduction via Webpack config optimization (324KB → 277KB)',
          detail:
            "Audited the production bundle with **webpack-bundle-analyzer** to identify size bottlenecks, then applied targeted Webpack configuration changes:\n- **Tree Shaking (lodash):** Replaced whole-library `import _ from 'lodash'` calls with per-method imports (`import debounce from 'lodash/debounce'`), eliminating ~200+ unused utility functions from the build.\n- **Dynamic Import (code splitting):** Wrapped heavy UI panels — charts, overlay editors, modal-heavy screens — in `React.lazy()` with `next/dynamic`, moving them out of the initial chunk.\n- **Vendor chunk tuning:** Configured `splitChunks.cacheGroups` to group stable third-party libraries into a separate vendor bundle, improving long-term cache reuse across deployments.\nResult: main entry bundle dropped from **324KB → 277KB (~15%, 47KB saved)**, with a measurable reduction in TTI (Time to Interactive) on first load.\n![Bundle size reduction chart](/images/camerafi-studio/optimization_chart.webp)",
        },
        {
          tag: 'Auth',
          accent: true,
          title: 'Secure integrated authentication system',
          detail:
            'Rather than relying solely on libraries, designed a secure login process combining **Firebase Custom Tokens** and **Cookies**. Authentication state is synchronized between client and server via cookies. Built a separate **Integrated Login Page** as a foundation for Single Sign-On (SSO) across future services.',
        },
        {
          tag: 'Architecture',
          title: 'Scalable global architecture',
          detail:
            'Adopted an **i18n** system from the early stages to support global users. Combined **MUI** and **Styled-components** to build a **Global Theme System** — a flexible UI structure that adapts to design changes like brand color updates or Dark Mode without structural refactoring.',
        },
        {
          tag: 'Compliance',
          title: 'Custom Cookie Consent implementation',
          detail:
            'To comply with GDPR and other global standards without relying on third-party tools, **developed the Cookie Consent banner and control logic from scratch**. Avoiding external scripts prevented page speed degradation from unnecessary script loading.',
        },
      ],
    },
    {
      id: 'camerafi-studio-en-05',
      type: 'markdown',
      markdown:
        '## Retrospective\n\n**Scalable initial design:** In a solo project, a poor initial structure compounds into unmanageable technical debt. I held firm on **Next.js** folder conventions and strong **TypeScript** typing — building a codebase that could scale to a team without rearchitecting.\n\n**Monetization:** Integrating **Paddle** gave me hands-on understanding of the full payment lifecycle: subscription state management, Webhook-based renewal, and the operational side of a revenue-generating service.',
    },
  ],
  ko: [
    {
      id: 'camerafi-studio-ko-01',
      type: 'markdown',
      markdown:
        '## 프로젝트 소개\n\n**"1인 프로젝트에서 사내 핵심 비즈니스 모델로"**\n\nCameraFi Studio는 스포츠 경기나 방송 송출 화면에 점수판, 자막 등의 오버레이를 입힐 수 있는 프로덕션 웹 SaaS입니다. 초기 기획 단계부터 **1인 개발로 시작하여 프론트엔드 아키텍처를 직접 설계**하고, 이후 사내 두 번째 메인 수익 모델로 성장시킨 프로젝트입니다.\n\n제품 범위는 오버레이 에디터, 인증 대시보드, 글로벌 **국제화(i18n)**, 구독 결제, 웹훅 기반 갱신 처리, 쿠키 동의 플로우까지 포함했습니다. 또한 **Webpack 설정 최적화**를 통해 웹 애플리케이션의 성능을 개선했습니다.\n\n현재 서비스 링크는 참고용으로 제공되며, 운영 상황에 따라 최신 UI는 변경되었을 수 있습니다. 이에 따라 상세 페이지에는 프로젝트 진행 당시 구현한 기능 범위와 Webpack 번들 최적화 지표를 기록해 두었습니다.',
    },
    {
      id: 'camerafi-studio-ko-02',
      type: 'techStack',
    },
    {
      id: 'camerafi-studio-ko-03',
      type: 'markdown',
      markdown: '## 주요 작업',
    },
    {
      id: 'camerafi-studio-ko-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'SaaS',
          accent: true,
          title: '에디터부터 구독 운영까지 이어지는 프로덕션 SaaS 화면',
          detail:
            '데모가 아니라 실제 제품 흐름에 필요한 프론트엔드를 구축했습니다. 인증 기반 계정 화면, 오버레이 편집 화면, 글로벌 언어 처리, Paddle 구독 결제, 웹훅을 고려한 구독 상태, GDPR 기준의 쿠키 동의까지 연결했습니다. 이를 통해 일회성 내부 도구가 아니라 매출을 만드는 웹 SaaS로 운영 가능한 구조를 만들었습니다.',
        },
        {
          tag: 'Performance',
          title: 'Webpack 설정 최적화로 번들 사이즈 15% 감량 (324KB → 277KB)',
          detail:
            "**webpack-bundle-analyzer**로 프로덕션 번들을 분석해 사이즈 병목을 파악한 후, Webpack 설정을 직접 수정하여 개선했습니다.\n- **Tree Shaking (lodash):** `import _ from 'lodash'` 방식의 전체 임포트를 `import debounce from 'lodash/debounce'`처럼 개별 메서드 임포트로 전환 — 사용하지 않는 200개 이상의 유틸 함수를 빌드에서 제거했습니다.\n- **Dynamic Import (코드 스플리팅):** 차트, 오버레이 에디터, 모달 등 초기 로딩 시 불필요한 무거운 UI 패널을 `React.lazy()`와 `next/dynamic`으로 감싸 초기 청크에서 분리했습니다.\n- **Vendor 청크 분리:** `splitChunks.cacheGroups`를 설정해 변경이 드문 서드파티 라이브러리를 별도 vendor 번들로 분리 — 배포 간 장기 캐시 재사용률을 높였습니다.\n결과: 메인 엔트리 번들이 **324KB → 277KB (약 15%, 47KB 절감)**으로 줄어 첫 로드 시 TTI(Time to Interactive)가 체감 가능한 수준으로 단축됐습니다.\n![번들 사이즈 감소 차트](/images/camerafi-studio/optimization_chart.webp)",
        },
        {
          tag: 'Auth',
          accent: true,
          title: '보안 강화된 통합 인증 시스템',
          detail:
            '라이브러리에만 의존하지 않고, **Firebase Custom Token**과 **Cookie**를 결합한 보안 로그인 프로세스를 직접 설계했습니다. 클라이언트와 서버 간의 인증 상태를 쿠키로 동기화하여 보안성을 높이고, 별도의 **통합 로그인 페이지**를 구축하여 향후 여러 서비스 간의 계정 연동(SSO)이 가능한 기반을 마련했습니다.',
        },
        {
          tag: 'Architecture',
          title: '확장 가능한 글로벌 아키텍처',
          detail:
            '전 세계 사용자를 대상으로 하는 서비스 특성에 맞춰 **국제화(i18n)** 시스템을 초기부터 도입했습니다. **MUI**와 **Styled-components**를 결합하여 **전역 테마 시스템(Global Theme)**을 구축해, 브랜드 컬러 변경이나 다크 모드 도입 등 디자인 요구사항 변화에 유연하게 대응할 수 있는 UI 구조를 완성했습니다.',
        },
        {
          tag: 'Compliance',
          title: '자체 구현한 규정 준수 (Cookie Consent)',
          detail:
            'GDPR 등 글로벌 웹 표준 규정을 준수하기 위해 서드파티 도구 없이 **쿠키 동의(Cookie Consent) 배너와 제어 로직을 직접 개발**했습니다. 외부 스크립트에 의존하지 않고 직접 구현함으로써, 불필요한 스크립트 로딩으로 인한 페이지 속도 저하를 방지했습니다.',
        },
      ],
    },
    {
      id: 'camerafi-studio-ko-05',
      type: 'markdown',
      markdown:
        "## 회고\n\n**확장성을 고려한 초기 설계:** 혼자 시작하는 프로젝트일수록 초기 구조가 무너지면 나중에 기술 부채가 감당할 수 없이 커진다는 점을 경계했습니다. **Next.js** 폴더 구조 원칙을 엄격히 지키고, **TypeScript** 타입을 강하게 적용하여 팀 단위 개발로 확장되더라도 문제없는 **견고한 코드베이스**를 만드는 데 집중했습니다.\n\n**수익화 모델(Paddle) 도입 경험:** 단순한 기능 개발을 넘어 **'매출을 만드는 서비스'**를 구축하는 경험을 했습니다. **Paddle** 결제 모듈을 연동하며 구독 상태 관리, Webhook을 통한 결제 갱신 처리 등 결제 시스템의 전반적인 라이프사이클을 깊이 이해하게 되었습니다.",
    },
  ],
};
