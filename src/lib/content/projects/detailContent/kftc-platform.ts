import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

export const kftcPlatformDetailContent: Record<Language, ProjectDetailBlock[]> = {
  en: [
    {
      id: 'kftc-platform-en-01',
      type: 'markdown',
      markdown:
        '## Project overview\n\n**"KFTC FinCert Promotion and Reward Platform"**\n\nThis is a freelance frontend contract project that implemented the signup, consent maintenance, events, challenges, rewards, and account settings flows for a promotional platform integrated with the Korea Financial Telecommunications and Clearings Institute (KFTC) FinCert.\n\nBeing a finance-related service, high reliability and robust data consistency were critical. Within a tight schedule, I separated analysis, design, and implementation work while covering signup, consent, promotion details, account settings, and notification flows. I combined `react-hook-form` and `zod` to share validation rules, and used `@tanstack/react-query` persisted cache with `idb-keyval` while excluding session, points, notifications, and redemption-related query roots from persistence. I also introduced an Express Mock server and Storybook so UI states could be validated in parallel with backend development.',
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
          title:
            'Separation of concerns & type-safe form validation using React 19, Vite, and TailwindCSS v4',
          detail:
            'Achieved fast builds and compiler safety using React 19, TypeScript, and Vite. Organized directories by api, components, and hooks to keep code modular. Handled complex signup and marketing consent forms using react-hook-form combined with zod schema definitions, ensuring declarative and robust validation.',
        },
        {
          tag: 'Performance',
          title: 'IndexedDB cache policy that excludes sensitive data',
          detail:
            'Built an IndexedDB-based client-side cache using @tanstack/react-query-persist-client and idb-keyval. The cache is intentionally selective: session state, point balances, notification counts, redemption records, and other fast-changing or sensitive query roots are excluded from persistence. The default staleTime is 1 minute, gcTime and persist maxAge are 24 hours, while event, challenge, and notification domains use staleTime 0 when freshness matters more than reuse.',
        },
        {
          tag: 'DX',
          title: 'Express Mock server for backend-independent frontend validation',
          detail:
            'Built a custom Express Mock server simulating session cookies, auth state, pagination, and artificial network delay (MOCK_DELAY). This let frontend flows and error states be validated before the backend was complete, and helped catch query-key or UI-state mismatches when API specs changed.',
        },
        {
          tag: 'Quality',
          accent: true,
          title: 'Test, type, and lint gates passed',
          detail:
            '`yarn test` passes **59 test files / 141 tests**, while `yarn typecheck` (tsc -b --noEmit) and `yarn lint` (eslint .) also pass. Coverage includes promotion detail flows, notifications, form fields, image fallback, accessibility attributes, FinCert user-cancel handling, and queryClient policy.',
        },
        {
          tag: 'UX',
          title:
            'Abstracting complex campaign rules into custom hooks and implementing Lottie animations',
          detail:
            'Abstracted intricate campaign rules (consecutive attendance, lucky draw, reward tickets) into clean custom hooks. Verified UI elements in isolation via Storybook, and enriched user feedback using @lottiefiles/dotlottie-react for ticket roulettes and attendance stamps.',
        },
      ],
    },
    {
      id: 'kftc-platform-en-05',
      type: 'markdown',
      markdown:
        '## Retrospective\n\n**Frontend reliability for a finance-adjacent domain:** The public claim here is intentionally scoped to frontend responsibility. Rather than claiming to own full financial security, I focus on the parts I implemented directly: TypeScript contracts, Zod validation, query-key policy, sensitive-data cache exclusions, and user-facing error handling.\n\n**Decoupled Development:** Constructing a local Express Mock server to match predefined API specs allowed the frontend to remain entirely decoupled from backend progress. This strategy proved to be effective for velocity and architectural cleanliness in team collaborations.',
    },
  ],
  ko: [
    {
      id: 'kftc-platform-ko-01',
      type: 'markdown',
      markdown:
        '## 프로젝트 소개\n\n**"금융결제원의 금융인증서 마케팅 프로모션 및 리워드 플랫폼"**\n\n금융결제원 금융인증서 기반 프로모션 플랫폼의 회원가입, 동의 유지, 이벤트, 챌린지, 리워드, 마이페이지 흐름 등을 담당한 프론트엔드 외주 개발 프로젝트입니다.\n\n금융 관련 서비스인 만큼 높은 신뢰도와 안정적인 데이터 일관성이 요구되었습니다. 촉박한 일정 속에서도 분석-설계-구현 단계를 나누고, 회원가입·약관 동의·프로모션 상세·마이페이지·알림 등 사용자 흐름을 독립적으로 구현했습니다. `react-hook-form`과 `zod`를 결합하여 폼 검증 기준을 공유했고, `@tanstack/react-query`의 영속 캐시와 `idb-keyval`을 사용하되 세션·포인트·알림처럼 민감하거나 자주 바뀌는 데이터는 persistence 대상에서 제외했습니다. 또한 Express Mock 서버와 Storybook을 도입해 백엔드 개발과 병렬로 화면 상태를 검증했습니다.',
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
          title: '민감 데이터 제외 IndexedDB 캐시 정책',
          detail:
            '@tanstack/react-query-persist-client와 idb-keyval을 활용해 IndexedDB 기반의 클라이언트 캐싱 구조를 구축했습니다. 단, 모든 데이터를 무조건 저장하지 않고 세션, 포인트 잔액, 알림 카운트, 경품 수령 내역처럼 민감하거나 자주 바뀌는 query key는 persistence 대상에서 제외했습니다. 기본 staleTime은 1분, gcTime과 persist maxAge는 24시간으로 두고, 이벤트·챌린지·알림처럼 최신성이 중요한 도메인은 staleTime 0으로 별도 관리했습니다.',
        },
        {
          tag: 'DX',
          title: 'Express Mock 서버로 백엔드 의존성 분리',
          detail:
            'Express로 세션 쿠키 기반 인증, 상태 유지, 페이지네이션, 그리고 MOCK_DELAY 지연 시간을 포함하는 Mock API 서버를 구축했습니다. 백엔드 구현 속도에 종속되지 않고 프론트엔드 기능과 오류 상태를 먼저 검증할 수 있었고, API 스펙 변경 시 query key와 화면 상태 전이가 함께 깨지는지 확인했습니다.',
        },
        {
          tag: 'Quality',
          accent: true,
          title: '테스트·타입·린트 게이트 통과',
          detail:
            '로컬 프로젝트 기준으로 `yarn test`는 **59개 테스트 파일 / 141개 테스트**를 모두 통과했고, `yarn typecheck`(tsc -b --noEmit)와 `yarn lint`(eslint .)도 통과했습니다. 테스트 범위에는 프로모션 상세 플로우, 알림, 폼 필드, 이미지 fallback, 접근성 속성, FinCert 사용자 취소 처리, queryClient 정책이 포함됩니다.',
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
        '## 회고\n\n**금융 도메인에 맞춘 프론트엔드 안정성:** 이 프로젝트에서 제가 공개적으로 말할 수 있는 범위는 프론트엔드 화면과 상태 관리입니다. 그래서 “금융 보안 전체를 구현했다”가 아니라, 타입 정의, Zod 기반 폼 검증, query key 정책, 민감 데이터 제외 캐싱, 오류 메시지 처리처럼 프론트엔드가 책임지는 안정성에 집중했습니다.\n\n**독립적 병렬 개발의 가치:** Express로 자체 Mock 서버를 구축하여 백엔드 지연과 관계없이 약속된 API 스펙에 맞춰 프론트엔드 비즈니스 로직을 완결성 있게 구현했습니다. 이는 협업 프로세스에서 속도와 유연성을 동시에 높이는 법을 배우는 계기가 되었습니다.',
    },
  ],
};
