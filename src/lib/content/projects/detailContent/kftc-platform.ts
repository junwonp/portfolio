import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

export const kftcPlatformDetailContent: Record<Language, ProjectDetailBlock[]> = {
  en: [
    {
      id: 'kftc-platform-en-01',
      type: 'markdown',
      markdown:
        '## Project overview\n\n**"KFTC FinCert Promotion and Reward Platform"**\n\nThis is a freelance frontend contract project that implemented the signup, consent maintenance, events, challenges, rewards, and account settings flows for a promotional platform integrated with the Korea Financial Telecommunications and Clearings Institute (KFTC) FinCert.\n\nBeing a finance-related service, high reliability and robust data consistency were critical. Despite a tight schedule, the project was successfully launched by streamlining the analysis, design, and implementation phases. We developed a robust validation system using `react-hook-form` and `zod`, and optimized offline reliability and page loading by combining `@tanstack/react-query` persisted cache with `idb-keyval` (IndexedDB). In addition, custom Mock servers and Storybook were introduced to allow parallel frontend development independent of the backend.',
    },
    {
      id: 'kftc-platform-en-02',
      type: 'techStack',
    },
    {
      id: 'kftc-platform-en-03',
      type: 'markdown',
      markdown: '## Key work',
    },
    {
      id: 'kftc-platform-en-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Architecture',
          accent: true,
          title: 'Separation of concerns & type-safe form validation using React 19, Vite, and TailwindCSS v4',
          detail:
            'Achieved fast builds and compiler safety using React 19, TypeScript, and Vite. Organized directories by api, components, and hooks to keep code modular. Handled complex signup and marketing consent forms using react-hook-form combined with zod schema definitions, ensuring declarative and robust validation.',
        },
        {
          tag: 'Performance',
          title: 'Offline Cache Persistence for offline reliability and FCP optimization',
          detail:
            'Built an IndexedDB-based client-side cache using @tanstack/react-query-persist-client and idb-keyval. Safeguarded campaign state during poor network conditions and significantly reduced First Contentful Paint (FCP) to deliver a seamless user experience.',
        },
        {
          tag: 'DX',
          title: 'Express-based Mock Server for independent, zero-dependency frontend development',
          detail:
            'Built a custom Express Mock server simulating session cookies, auth state, pagination, and artificial network delay (MOCK_DELAY). By decoupling from backend completion, we implemented and validated frontend views in parallel, accelerating the launch timeline.',
        },
        {
          tag: 'UX',
          title: 'Abstracting complex campaign rules into custom hooks and implementing Lottie animations',
          detail:
            'Abstracted intricate campaign rules (consecutive attendance, lucky draw, reward tickets) into clean custom hooks. Verified UI elements in isolation via Storybook, and enriched user feedback using @lottiefiles/dotlottie-react for ticket roulettes and attendance stamps.',
        },
      ],
    },
    {
      id: 'kftc-platform-en-05',
      type: 'markdown',
      markdown:
        '## Retrospective\n\n**Finance-Grade Stability:** Developing for KFTC emphasized the importance of data integrity and error resilience. Designing with strict TypeScript contracts, Zod-driven forms, and offline-persistent query cache gave me first-hand experience in building highly stable web applications.\n\n**Decoupled Development:** Constructing a local Express Mock server to match predefined API specs allowed the frontend to remain entirely decoupled from backend progress. This strategy proved to be highly effective for velocity and architectural cleaness in team collaborations.',
    },
  ],
  ko: [
    {
      id: 'kftc-platform-ko-01',
      type: 'markdown',
      markdown:
        '## 프로젝트 소개\n\n**"금융결제원의 금융인증서 마케팅 프로모션 및 리워드 플랫폼"**\n\n금융결제원 금융인증서 기반 프로모션 플랫폼의 회원가입, 동의 유지, 이벤트, 챌린지, 리워드, 마이페이지 흐름 등을 담당한 프론트엔드 외주 개발 프로젝트입니다.\n\n금융 관련 서비스인 만큼 높은 신뢰도와 안정적인 데이터 일관성이 요구되었습니다. 촉박한 일정 속에서도 분석-설계-구현 단계를 효율적으로 조율하여 무결하게 기능들을 개발했습니다. `react-hook-form`과 `zod`를 결합하여 견고한 폼 검증 시스템을 마련하였으며, `@tanstack/react-query`의 오프라인 지속성 패키지와 `idb-keyval`을 이용해 네트워크 장애 대응과 초기 로딩 성능 최적화를 구축했습니다. 또한, Mock 서버 환경과 Storybook을 도입하여 백엔드 개발과 독립된 병렬 개발을 수행했습니다.',
    },
    {
      id: 'kftc-platform-ko-02',
      type: 'techStack',
    },
    {
      id: 'kftc-platform-ko-03',
      type: 'markdown',
      markdown: '## 주요 작업',
    },
    {
      id: 'kftc-platform-ko-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Architecture',
          accent: true,
          title: 'React 19, Vite, TailwindCSS v4 기반 관심사 분리 및 폼 검증 설계',
          detail:
            'React 19와 TypeScript, Vite를 활용해 높은 빌드 속도와 컴파일 검증을 구축했습니다. api, components, hooks 등으로 디렉토리를 명확히 나누어 비즈니스 로직을 구조화했습니다. 회원가입 및 마케팅 약관 동의 등 복잡한 사용자 폼을 react-hook-form과 zod 스키마 정의로 검증하여 선언적이고 안전하게 구성했습니다.',
        },
        {
          tag: 'Performance',
          title: 'IndexedDB 캐시 영속화를 통한 데이터 안정성 및 로딩 속도 최적화',
          detail:
            '@tanstack/react-query-persist-client와 idb-keyval을 활용해 IndexedDB 기반의 클라이언트 사이드 캐싱 구조를 구축했습니다. 불안정한 네트워크 상황에서도 사용자 데이터를 안전하게 보호하며, 초기 로딩 속도(FCP)를 획기적으로 낮춰 뛰어난 사용자 경험을 제공하도록 설계했습니다.',
        },
        {
          tag: 'DX',
          title: 'Express 기반의 정교한 Mock 서버로 백엔드 의존성 제거 및 독립 개발',
          detail:
            'Express로 세션 쿠키 기반 인증, 상태 유지, 페이지네이션, 그리고 MOCK_DELAY 지연 시간을 포함하는 Mock API 서버를 직접 구축했습니다. 백엔드 구현 속도에 종속되지 않고 프론트엔드 기능을 독립적으로 개발하여 전체 프로젝트 런칭 일정을 획기적으로 단축했습니다.',
        },
        {
          tag: 'UX',
          title: '복합 프로모션 챌린지 로직의 커스텀 훅 추상화 및 Lottie 애니메이션 구현',
          detail:
            '누적/연속 참여 챌린지, 행운권 추첨, 포인트 등 까다로운 조건 검증 로직을 커스텀 훅으로 추상화했습니다. 또한, Storybook을 사용해 컴포넌트 단위로 독립 테스트하고, @lottiefiles/dotlottie-react 기반의 티켓 룰렛, 출석 도장 애니메이션으로 반응형 인터랙션을 강화했습니다.',
        },
      ],
    },
    {
      id: 'kftc-platform-ko-05',
      type: 'markdown',
      markdown:
        '## 회고\n\n**금융 수준의 안정성 확보:** 데이터 무결성과 예외 처리가 매우 중요한 금융결제원 플랫폼에서 철저한 타입 정의와 Zod 기반 폼 검증, 그리고 네트워크 오류를 고려한 캐싱 설계를 적용하며 시스템 안정성을 확보하는 경험을 했습니다.\n\n**독립적 병렬 개발의 가치:** Express로 자체 Mock 서버를 구축하여 백엔드 지연과 관계없이 약속된 API 스펙에 맞춰 프론트엔드 비즈니스 로직을 완결성 있게 구현했습니다. 이는 협업 프로세스에서 속도와 유연성을 동시에 높이는 법을 배우는 계기가 되었습니다.',
    },
  ],
};
