import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

export const onelineBankDetailContent: Record<Language, ProjectDetailBlock[]> = {
  en: [
    {
      id: 'oneline-bank-en-01',
      type: 'markdown',
      markdown:
        '## Project overview\n\n**"Simplifying money transfers into a single line of chat."**\n\nOnelineBank is a **conversational banking demo**: the user describes a transfer in natural language, the app parses intent, runs a short confirmation dialog, and finishes with biometric verification. Started as a **2021 Woori Bank Hackathon finalist** built under time pressure in JavaScript — then fully rewritten in TypeScript with modern architecture after gaining deeper React Native experience.',
    },
    {
      id: 'oneline-bank-en-02',
      type: 'techStack',
    },
    {
      id: 'oneline-bank-en-03',
      type: 'markdown',
      markdown: '## Key work',
    },
    {
      id: 'oneline-bank-en-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Core',
          accent: true,
          title: 'Conversational transfer: natural language → verified payment',
          detail:
            "Chat messages are parsed with regex for **bank, account, amount, and recipient**. A confirmation step and **positive/negative reply sets** drive the dialog before execution. `expo-local-authentication` gates the final action — even in a demo context, the security UX matches real banking flows. Parsing and bank-code mapping live under `features/remittance/utils`; `app/api/transfer+api.ts` implements an **open-banking-shaped mock** so the client calls `fetch('/api/transfer')` and secrets are never bundled in the app.",
        },
        {
          tag: 'Architecture',
          accent: true,
          title: 'Feature-module structure with TanStack Query server state',
          detail:
            'Under `features/`, the app groups **auth, accounts, messages, profile, and remittance** with hooks and helpers per domain. Screens under `app/` focus on routing and layout only — all reads and writes go through `useQuery` / `useMutation`.\n- **Query key factories** (`accountKeys`, `messagesKeys`) keep invalidation and prefetch targets explicit.\n- **Prefetch helpers** (`prefetchAccounts`, `prefetchMessages`) support faster first paint.\n- **PersistQueryClientProvider** + **MMKV persister** restores cache after cold start.\n- **NetInfo → `onlineManager`** and **AppState → `focusManager`** align refetch behavior with connectivity and foreground/background.',
        },
        {
          tag: 'Auth',
          title: 'Declarative auth routing with Expo Router + Zustand',
          detail:
            'Firebase `onAuthStateChanged` is wrapped and synced to a small **Zustand** store. **Expo Router `Stack.Protected`** splits `(tabs)` vs `(auth)` by session so guards stay declarative in the tree — no imperative redirects scattered through screens. **TanStack Form + Zod** handle login flows: schema validation, `isSubmitting`, and consistent disabled states / snackbars.',
        },
        {
          tag: 'Ux',
          title: 'Utility-first UI with NativeWind + CVA typed variants',
          detail:
            '**NativeWind** keeps layout and spacing utility-first across the app. **class-variance-authority (CVA)** defines **typed variants** for components like `Button` — styles stay consistent and easy to extend without runtime style merging logic.',
        },
        {
          tag: 'Dx',
          title: 'Full release pipeline: EAS, Crashlytics, localized display names',
          detail:
            'TypeScript, ESLint (Expo + TanStack Query rules), Prettier. **EAS**, `expo-dev-client`, `expo-build-properties`, **Crashlytics**, and localized display names (e.g., Korean **한줄은행**) follow a production-minded setup throughout.',
        },
        {
          tag: 'History',
          title: 'Hackathon (2021) vs rebuild: a before/after comparison',
          detail:
            'The two repos sit side by side as a concrete before/after — same product idea, fundamentally different engineering decisions.\n| Area | Hackathon (legacy) | Rebuild |\n| --- | --- | --- |\n| Language | JavaScript | TypeScript |\n| Navigation | Stack + Tab (React Navigation 5) | Expo Router, file-based routes |\n| Global state | Context (User, Progress) | Zustand + Firebase for auth; Query for server state |\n| Data / API | Direct HTTP calls from client | TanStack Query, cache, persistence, online/focus hooks |\n| UI | styled-components, Gifted Chat | NativeWind, custom message UI |\n| Firebase | Web-compat style SDK | @react-native-firebase/* modules |',
        },
      ],
    },
    {
      id: 'oneline-bank-en-05',
      type: 'markdown',
      markdown: '## Screenshots',
    },
    {
      id: 'oneline-bank-en-06',
      type: 'lightbox',
      images: [
        {
          src: '/images/oneline-bank/1.webp',
          alt: 'Splash page',
          caption: 'App identity — logo and intro screen',
        },
        {
          src: '/images/oneline-bank/2.webp',
          alt: 'Login page',
          caption: 'Firebase Auth–based login',
        },
        {
          src: '/images/oneline-bank/3.webp',
          alt: 'Chat transfer flow',
          caption: 'Regex parsing → bot confirmation → biometrics → Woori Bank Open API transfer',
        },
        {
          src: '/images/oneline-bank/4.webp',
          alt: 'Contact shortcuts',
          caption: 'Aliases (e.g. "Mom") for frequent recipients',
        },
        {
          src: '/images/oneline-bank/5.webp',
          alt: 'Add account',
          caption: 'Account registration flow',
        },
        {
          src: '/images/oneline-bank/6.webp',
          alt: 'Account list',
          caption: 'Firestore for accounts and transfer history in real time',
        },
      ],
    },
    {
      id: 'oneline-bank-en-07',
      type: 'markdown',
      markdown:
        "## Retrospective\n\n**Hackathon speed:** I leaned on existing React web experience to pick up React Native and native modules quickly and **ship a working demo**, not a polished architecture.\n\n**Fintech:** Wiring a real bank API made **transaction flow, step-up auth, and data integrity** concrete — especially turning unstructured chat into safe structured payment data.\n\n**Rewrite:** Later, the lack of types, loose file layout, and dated patterns in the legacy repo were obvious. The rebuild is **new product decisions** (feature slices, Query, router guards, API route for transfers), not a shallow library upgrade. The two repos sit side by side as a before/after I'm comfortable standing behind.",
    },
  ],
  ko: [
    {
      id: 'oneline-bank-ko-01',
      type: 'markdown',
      markdown:
        '## 프로젝트 소개\n\n**"복잡한 송금을 한 줄의 채팅으로."**\n\n한줄은행은 **대화형 뱅킹 데모**입니다. 사용자가 자연어로 송금 의사를 말하면 앱이 파싱하고, 짧은 확인 대화를 거친 뒤 생체 인증으로 마무리합니다. **2021년 우리은행 해커톤 본선 출품작**으로 시작해 JavaScript로 빠르게 구현했고, 이후 React Native 경험을 쌓은 뒤 TypeScript와 현대적인 아키텍처로 전면 재작성했습니다.',
    },
    {
      id: 'oneline-bank-ko-02',
      type: 'techStack',
    },
    {
      id: 'oneline-bank-ko-03',
      type: 'markdown',
      markdown: '## 주요 작업',
    },
    {
      id: 'oneline-bank-ko-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Core',
          accent: true,
          title: '대화형 이체: 자연어 → 인증 결제',
          detail:
            "채팅 메시지에서 **은행·계좌·금액·수취인**을 정규식으로 추출하고, 확인 단계와 **긍정/부정 응답 집합**으로 대화를 이어 갑니다. `expo-local-authentication`으로 최종 단계를 막아 데모임에도 실제 뱅킹과 같은 보안 UX를 구현했습니다. 파싱·은행 코드 매핑은 `features/remittance/utils`에 두고, `app/api/transfer+api.ts`에서 오픈뱅킹 형태의 **목 API**를 구현해 클라이언트는 `fetch('/api/transfer')`만 호출하므로 **번들에 비밀 키를 넣지 않습니다.**",
        },
        {
          tag: 'Architecture',
          accent: true,
          title: '기능 모듈 구조와 TanStack Query 서버 상태',
          detail:
            '`features/`에 **auth, accounts, messages, profile, remittance**를 두고 영역별 훅·헬퍼를 모았습니다. `app/` 화면은 라우팅·레이아웃에만 집중하고, 데이터는 `useQuery` / `useMutation`으로만 다룹니다.\n- **쿼리 키 팩토리**(`accountKeys`, `messagesKeys` 등)로 무효화·프리페치 대상을 명확히 함.\n- **프리페치 헬퍼**(`prefetchAccounts`, `prefetchMessages`)로 첫 화면 체감 속도 개선.\n- **PersistQueryClientProvider** + **MMKV persister**로 콜드 스타트 후 캐시 복원.\n- **NetInfo → `onlineManager`**, **AppState → `focusManager`**로 네트워크·전경/백그라운드와 재요청 정책을 맞춤.',
        },
        {
          tag: 'Auth',
          title: 'Expo Router + Zustand를 이용한 선언적 인증 라우팅',
          detail:
            'Firebase `onAuthStateChanged`를 훅으로 감싸 **Zustand** 스토어와 동기화합니다. **Expo Router `Stack.Protected`**로 `(tabs)` / `(auth)`를 세션 기준으로 분리해 가드를 트리에 선언적으로 두었습니다. **TanStack Form + Zod**로 로그인 등: 스키마 검증, `isSubmitting`, 버튼 비활성·스낵바를 일관되게 처리합니다.',
        },
        {
          tag: 'Ux',
          title: 'NativeWind + CVA 타입 variant로 UI 일관성 유지',
          detail:
            '**NativeWind**로 유틸리티 기반 레이아웃·간격을 맞추고, **class-variance-authority(CVA)**로 `Button` 등의 컴포넌트에 **타입과 함께 variant를 정의**해 스타일 확장을 단순하게 유지했습니다.',
        },
        {
          tag: 'Dx',
          title: '완전한 배포 파이프라인: EAS, Crashlytics, 로케일별 표시명',
          detail:
            'TypeScript, ESLint(Expo·TanStack Query 규칙), Prettier. **EAS**, `expo-dev-client`, `expo-build-properties`, **Crashlytics**, 로케일별 표시명(**한줄은행** 등)까지 일반적인 출시 준비에 맞춰 구성했습니다.',
        },
        {
          tag: 'History',
          title: '해커톤(2021) vs 리빌드: 전과 후 비교',
          detail:
            '두 저장소를 나란히 두고 **같은 제품 아이디어, 다른 엔지니어링 결정**을 구체적으로 비교할 수 있습니다.\n| 영역 | 해커톤(Legacy) | 리빌드 |\n| --- | --- | --- |\n| 언어 | JavaScript | TypeScript |\n| 내비게이션 | Stack + Tab (React Navigation 5) | Expo Router, 파일 기반 라우팅 |\n| 전역 상태 | Context (User, Progress) | 인증은 Zustand + Firebase, 서버 상태는 Query |\n| 데이터/API | 클라이언트에서 직접 HTTP 호출 | TanStack Query, 캐시·영속화·온라인·포커스 연동 |\n| UI | styled-components, Gifted Chat | NativeWind, 자체 메시지 UI |\n| Firebase | 웹 compat 스타일 SDK | @react-native-firebase/* 모듈형 |',
        },
      ],
    },
    {
      id: 'oneline-bank-ko-05',
      type: 'markdown',
      markdown: '## 스크린샷',
    },
    {
      id: 'oneline-bank-ko-06',
      type: 'lightbox',
      images: [
        {
          src: '/images/oneline-bank/1.webp',
          alt: '스플래시 화면',
          caption: '앱의 정체성을 보여주는 로고와 인트로 화면',
        },
        {
          src: '/images/oneline-bank/2.webp',
          alt: '로그인 화면',
          caption: 'Firebase Auth 연동 로그인',
        },
        {
          src: '/images/oneline-bank/3.webp',
          alt: '채팅 송금 화면',
          caption: '정규식 파싱 → 봇 확인 → 생체 인증 → 우리은행 오픈 API 송금',
        },
        {
          src: '/images/oneline-bank/4.webp',
          alt: '연락처·별칭 화면',
          caption: '자주 쓰는 계좌를 별칭(엄마, 친구 등)으로 등록',
        },
        {
          src: '/images/oneline-bank/5.webp',
          alt: '계좌 추가 화면',
          caption: '계좌 등록 플로우',
        },
        {
          src: '/images/oneline-bank/6.webp',
          alt: '계좌 목록 화면',
          caption: 'Firestore로 계좌·송금 내역을 실시간 관리',
        },
      ],
    },
    {
      id: 'oneline-bank-ko-07',
      type: 'markdown',
      markdown:
        '## 회고\n\n**해커톤:** 웹 React 경험을 바탕으로 React Native와 네이티브 모듈을 빠르게 익히고 **동작하는 데모**를 만드는 데 집중했습니다.\n\n**핀테크:** 실제 은행 API를 붙이며 **트랜잭션 흐름·단계별 인증·데이터 정합성**을 몸으로 이해했고, 비정형 채팅을 결제 데이터로 바꿀 때의 예외 처리의 중요성을 배웠습니다.\n\n**리빌드:** 이후 돌아보니 타입 부재·파일 구조·옛 패턴의 한계가 분명했습니다. 리빌드는 라이브러리만 바꾼 수준이 아니라 **기능 단위 쪼개기, Query, 라우터 가드, 이체용 API 라우트**처럼 설계를 다시 잡은 작업입니다. 두 저장소를 나란히 두고 **전과 후**를 비교할 수 있는 상태로 정리했습니다.',
    },
  ],
};
