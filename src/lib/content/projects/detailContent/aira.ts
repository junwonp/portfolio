import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

export const airaDetailContent: Record<Language, ProjectDetailBlock[]> = {
  en: [
    {
      id: 'aira-en-01',
      type: 'markdown',
      markdown:
        '## Project overview\n\n**"AI Character Chat Service used by 23k people"**\n\naira is a chat application that allows users to converse freely with various AI characters.\nAs a Co-Founder and Frontend Lead, I led the **entire process from planning to product launch and achieving 23k MAU (Monthly Active Users).**\n\nI focused on designing a **combined Local-Server architecture** to prevent data loss and **meticulously optimizing rendering performance** to provide a seamless chat experience even on low-end devices.\n\nMy ownership covered product planning, frontend architecture, streaming chat UX, server-state/cache design, EAS/TestFlight release operations, Sentry monitoring, and monetization UI.',
    },
    {
      id: 'aira-en-02',
      type: 'techStack',
    },
    {
      id: 'aira-en-03',
      type: 'markdown',
      markdown: '## Key work',
    },
    {
      id: 'aira-en-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Streaming',
          accent: true,
          title: 'Real-time streaming UI with live InfiniteQuery cache patching',
          detail:
            'As AI chunks stream in, patches the **TanStack Query InfiniteQuery cache directly per chunk** — same `message-{index}` replaces content (typing effect), new index inserts a record. Manages `InfiniteData` immutable updates without Immer. A Zod `z.union` schema distinguishes content / final event types; `safeParse` silently skips malformed chunks. Optimistic updates pre-insert user messages and update session previews simultaneously; rollback on error.',
        },
        {
          tag: 'Performance',
          accent: true,
          title: 'Smooth 60fps chat on low-end devices via FlashList + worklet keyboard',
          detail:
            'Replaced `FlatList` with **FlashList** (view recycling) to eliminate frame drops and white-screen flickering in large chat logs. Keyboard scroll handler runs in a **Reanimated worklet on the UI thread** — never dropped even under heavy JS load. Delegated `scrollToEnd` to the RN thread via `scheduleOnRN` to respect thread boundaries. Cursor-based pagination via `useInfiniteQuery` keeps retrieval speed stable as history grows.',
        },
        {
          tag: 'Caching',
          accent: true,
          title: 'Instant app launch: MMKV-backed TanStack Query persistence',
          detail:
            'Integrated **TanStack Query** persistence (`PersistQueryClientProvider`) with **MMKV** to display cached data immediately on launch — zero network wait. Separated MMKV into `document` / `cache` / `settings` instances for independent invalidation. Using `buster: uid` auto-isolates per-user caches on login, eliminating manual `queryClient.clear()` calls and timing-related bugs.',
        },
        {
          tag: 'Architecture',
          title: 'Cross-platform: single codebase for Android, iOS, and Web',
          detail:
            "Built on **Expo Router**, sharing all business logic while using `*.ios.ts` / `*.web.ts` extensions for platform-specific UI. Applied a `.web.tsx` Context separation pattern so native-only packages (`expo-iap`, `google-mobile-ads`) are excluded from the web bundle via Metro's file extension resolution — blocking both bundle bloat and runtime errors at the build level.",
        },
        {
          tag: 'Migration',
          title: 'Zero-loss data migration: Realm → Firestore',
          detail:
            "When a privacy policy change forced a shift from local-first to server storage, built a **Retry Logic + Transaction Flag** mechanism: even if the app is killed or loses network mid-migration, it resumes from the exact checkpoint on the next launch. Transferred tens of thousands of users' conversation records without data loss.",
        },
        {
          tag: 'Dx',
          title: 'Type-safe query cache facade (queryData)',
          detail:
            'All `QueryClient` access funneled through a domain-organized `queryData` facade. Hierarchical key factories (`keys.message.list(sessionId)`) enable safe bulk invalidation. `update.message.list(sessionId)(updater)` infers updater types via `Updater` generics — cache type mismatches are caught at compile time.',
        },
        {
          tag: 'Dx',
          title: 'Adopted React Compiler — removed all manual memoization',
          detail:
            'Removed `useMemo` / `useCallback` scattered across the complex chat UI by introducing **React Compiler**. The compiler handles most optimizations automatically; manual overrides are applied only where fine-grained control is genuinely needed. Result: noticeably cleaner code with no performance regression.',
        },
        {
          tag: 'Dx',
          title: 'Design token system: Unistyles numeric-scale palette + zero theme flicker',
          detail:
            "Numeric-scale color palette via **Unistyles**; light/dark themes select different steps from the same palette. MMKV's synchronous read applies the theme before the first render, **eliminating the AsyncStorage flicker**. Typography scales with device accessibility settings (`UnistylesRuntime.fontScale`), clamped to 1–1.2 to prevent layout breakage.",
        },
        {
          tag: 'Ux',
          title: 'Non-intrusive monetization: custom Native Ads format',
          detail:
            "Designed a **Native Ads** format showing only the 'AD' tag and title in a thin bar at the top of the chat screen — minimal footprint, zero disruption to conversation flow. Continuously monitored post-launch **drop-off rate data** to quantitatively track the revenue/UX trade-off.",
        },
        {
          tag: 'I18n',
          title: 'Compile-time i18n safety with typesafe-i18n',
          detail:
            '`typesafe-i18n` auto-generates TypeScript types from translation files — invalid keys and missing parameters caught at **compile time**. Children render only after locale files fully load, preventing garbled display names on first screen. Language switches sync OS locale, save to MMKV, async-load translation files, then update the i18n context in sequence.',
        },
        {
          tag: 'R&D',
          accent: true,
          title: 'Next-Gen Shorts UI & iOS 26 Liquid Glass Native Acceleration Experiment',
          detail:
            'Designed and prototyped a **full-screen Shorts-style swipe UI** to maximize user immersion, allowing users to transition from browsing to chatting seamlessly. To optimize runtime graphic overhead, bypassed Javascript calculation bottlenecks by integrating native iOS rendering APIs via **UIGlassView**, implementing fluid Liquid Glass visual effect while maximizing battery efficiency.',
        },
      ],
    },
    {
      id: 'aira-en-05',
      type: 'markdown',
      markdown: '## Screenshots',
    },
    {
      id: 'aira-en-06',
      type: 'lightbox',
      images: [
        {
          src: '/images/aira/desktop_main.webp',
          mobileSrc: '/images/aira/desktop_main_mobile.jpg',
          alt: 'aira Desktop Main Screen',
          caption: 'Desktop/Web main interface (responsive)',
        },
        {
          src: '/images/aira/desktop_chat.webp',
          mobileSrc: '/images/aira/desktop_chat_mobile.jpg',
          alt: 'aira Desktop Chat Screen',
          caption: 'Chat experience optimized for desktop',
        },
        {
          src: '/images/aira/home_ads.webp',
          alt: 'aira Home Ads',
          caption: 'Home feed ads designed to not disrupt flow',
        },
        {
          src: '/images/aira/chat_ads.webp',
          alt: 'aira Chat Ads',
          caption: 'Slim-bar native ads at the top of chat',
        },
        {
          src: '/images/aira/reward_ads.webp',
          alt: 'aira Reward Ads',
          caption: 'Reward ad screen for point recharge',
        },
      ],
    },
    {
      id: 'aira-en-07',
      type: 'markdown',
      markdown:
        '### Real-Device Interactions & Performance Demos\n\nRecorded videos verifying runtime usability, performance improvements, and interface experiments.\n\n* **60fps Scroll Performance (FlashList):** Implemented view recycling mechanism to avoid memory bottlenecks and frame drops even under long scroll logs. Integrated Reanimated worklets running on the UI thread to dynamically adjust scrolling behavior according to the keyboard height, ensuring smooth 60fps scrolling experience even when JS thread is highly occupied.\n* **Shorts-style Character Swiping & iOS 26 Liquid Glass R&D:** Designed a unified layout mimicking mobile short-form video feeds where users can navigate character profiles by swiping up/down, instantly beginning conversation on the spot. Leveraged iOS native rendering APIs (`UIGlassView`) to bypass heavy Javascript CPU/GPU bottlenecks, achieving the fluid Liquid Glass effect with extreme battery efficiency.',
    },
    {
      id: 'aira-en-08',
      type: 'mediaGallery',
      images: [
        {
          src: '/images/aira/chat_flashlist.mp4',
          alt: 'aira Chat FlashList Demo',
        },
        {
          src: '/images/aira/home_flashlist.mp4',
          alt: 'aira Home FlashList Demo',
        },
      ],
    },
    {
      id: 'aira-en-09',
      type: 'mediaGallery',
      images: [
        {
          src: '/images/aira/v2_home.mp4',
          alt: 'aira V2 Shorts UI and Liquid Glass demo',
        },
      ],
    },
    {
      id: 'aira-en-10',
      type: 'markdown',
      markdown:
        "## Retrospective\n\n**\"The essence of engineering learned in a startup\"**\n\n### 1. Streaming and Cache Synchronization are More Complex Than Expected\n\nInitially, I tried accumulating stream chunks in local `useState` and refetching the Query upon completion. The problem was the screen briefly going blank during refetch. After switching to the current approach (directly patching InfiniteQuery cache per chunk), typing animations became smooth and flickering disappeared. The trade-off is that `InfiniteData` immutable update code is long and harder to read, but I chose to write it directly without Immer considering bundle size.\n\n### 2. Platform-Specific Bundle Separation Should Be Designed Early\n\nWhen adding web support later, native-only packages (`expo-in-app-purchases`, `react-native-google-mobile-ads`) leaked into the web bundle causing runtime errors. I resolved this with platform-specific Context separation using Metro's file extension resolution rules (`.web.tsx` priority), but knowing this pattern from the project's inception would have eliminated refactoring costs entirely.\n\n### 3. The MMKV + PersistQueryClientProvider `buster` Combination\n\nInitially, I manually called `queryClient.clear()` on logout. Then I discovered cases where the cache wasn't fully cleared due to component unmount timing issues. Using `buster: uid` means `PersistQueryClientProvider` automatically invalidates the cache when it mounts with a different buster, enabling safe per-user cache isolation without timing dependencies.\n\n### 4. Reanimated Worklet Boundaries Must Be Strictly Observed\n\nDirectly calling `FlashList.scrollToEnd()` inside a `useAnimatedReaction` callback caused crashes. Worklets run on the UI thread, and `scrollToEnd` is a JS/RN thread API — crossing thread boundaries is not allowed. After delegating to the RN thread via `scheduleOnRN`, it worked stably. This was a firsthand lesson in React Native's multi-thread model.\n\n### 5. The Boundary of Over-Engineering\n\nIdeally, I thought writing perfect code was always best. However, running a startup taught me that **\"excessive technical investment in unverified features can be a business risk.\"**\nI acquired a **flexible engineering mindset**, not giving up on code quality, but **strategically deciding the allowable range of technical debt according to the service's growth stage (MVP vs. Scale-up)** and focusing on verifying core values.\n\n### 6. Understanding Business Models and Cost Structures\n\nAI services have high cost structures (GPU/API costs). On the other hand, ad-based B2C models had limitations in increasing revenue per user (ARPU).\nI realized that even technically superior services are hard to sustain without a **solid Business Model** to cover high operating costs. Through this, I deeply understood that developers must **consider cost efficiency and revenue structure beyond just technical implementation.**",
    },
  ],
  ko: [
    {
      id: 'aira-ko-01',
      type: 'markdown',
      markdown:
        '## 프로젝트 소개\n\n**"2.3만 명이 사용한 AI 캐릭터 채팅 서비스"**\n\n아이라는 사용자가 다양한 AI 캐릭터와 자유롭게 대화할 수 있는 채팅 앱입니다.\n공동 창업자 겸 프론트엔드 리드로서 **기획부터 제품 출시, 그리고 2.3만 MAU를 달성하기까지의 전 과정**을 주도했습니다.\n\n**데이터 유실 없는 서버 마이그레이션**을 수행했고, **렌더링 성능을 꼼꼼하게 최적화**하여 저사양 기기에서도 끊김 없는 채팅 경험을 제공하는 데 집중했습니다.\n\n담당 범위는 제품 기획, 프론트엔드 아키텍처, 스트리밍 채팅 UX, 서버 상태·캐시 설계, EAS/TestFlight 배포 운영, Sentry 모니터링, 수익화 UI까지 포함했습니다.',
    },
    {
      id: 'aira-ko-02',
      type: 'techStack',
    },
    {
      id: 'aira-ko-03',
      type: 'markdown',
      markdown: '## 주요 작업',
    },
    {
      id: 'aira-ko-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Streaming',
          accent: true,
          title: 'InfiniteQuery 캐시 실시간 패치로 구현한 스트리밍 UI',
          detail:
            'AI 청크가 스트리밍되는 동안 **TanStack Query InfiniteQuery 캐시를 청크 단위로 직접 패치** — 같은 `message-{index}`면 콘텐츠를 교체(타이핑 효과), 새 인덱스면 레코드를 삽입합니다. Immer 없이 `InfiniteData` 불변 업데이트를 직접 관리합니다. Zod `z.union` 스키마로 콘텐츠/최종 이벤트를 구분하고, `safeParse`로 깨진 청크는 조용히 스킵합니다. Optimistic Update로 사용자 메시지를 즉시 삽입·미리보기 갱신, 오류 시 롤백합니다.',
        },
        {
          tag: 'Performance',
          accent: true,
          title: '저사양 기기에서 60fps 채팅: FlashList + 워크렛 키보드 스크롤',
          detail:
            '`FlatList`를 뷰 재사용 방식의 **FlashList**로 교체하여 대량 채팅 로그의 프레임 드랍과 화이트 스크린을 제거했습니다. 키보드 스크롤 핸들러는 **Reanimated 워크렛(UI 스레드)**에서 실행 — JS 스레드가 바빠도 키보드 진행 상태를 놓치지 않습니다. `scrollToEnd`는 `scheduleOnRN`으로 RN 스레드에 위임하여 스레드 경계를 준수합니다. `useInfiniteQuery` + 커서 기반 페이지네이션으로 데이터가 늘어나도 조회 속도를 안정적으로 유지합니다.',
        },
        {
          tag: 'Caching',
          accent: true,
          title: '즉시 실행 경험: MMKV 기반 TanStack Query 영속 캐시',
          detail:
            '**TanStack Query** 영속 캐시(`PersistQueryClientProvider`)와 **MMKV**를 연동하여, 앱 실행 시 네트워크 요청 없이 즉시 캐시 데이터를 표시합니다. MMKV를 `document` / `cache` / `settings` 인스턴스로 분리해 독립 무효화를 지원합니다. `buster: uid` 사용으로 로그인 전환 시 이전 사용자 캐시가 자동 격리 — 수동 `queryClient.clear()`와 타이밍 버그를 근본적으로 제거했습니다.',
        },
        {
          tag: 'Architecture',
          title: '단일 코드베이스로 Android, iOS, Web 동시 지원',
          detail:
            '**Expo Router** 기반으로 비즈니스 로직을 완전히 공유하며, `*.ios.ts` / `*.web.ts` 확장자로 플랫폼별 UI만 분리했습니다. `.web.tsx` Context 분리 패턴을 적용해 네이티브 전용 패키지(`expo-iap`, `google-mobile-ads`)가 웹 번들에 포함되지 않도록 Metro 빌드 단계에서 차단 — 번들 크기 증가와 런타임 오류를 동시에 방지합니다.',
        },
        {
          tag: 'Migration',
          title: '데이터 유실 없는 마이그레이션: Realm → Firestore',
          detail:
            '프라이버시 정책 변화로 로컬 우선 방식에서 서버 저장 방식으로 전환할 때, **재시도 로직(Retry Logic) + 트랜잭션 플래그(Transaction Flag)**를 설계했습니다. 이관 도중 앱이 종료되거나 네트워크가 끊겨도 다음 실행 시 중단된 지점부터 재개되도록 구현, 수만 명의 대화 데이터를 유실 없이 안전하게 이전했습니다.',
        },
        {
          tag: 'Dx',
          title: 'Type-Safe한 쿼리 캐시 파사드 (queryData)',
          detail:
            '모든 `QueryClient` 접근을 도메인별로 구조화된 `queryData` 파사드로 일원화했습니다. 계층적 키 팩토리(`keys.message.list(sessionId)`)로 안전한 일괄 무효화를 지원합니다. `update.message.list(sessionId)(updater)` 호출 시 `Updater` 제네릭으로 업데이터 타입이 자동 추론 — 캐시 타입 불일치가 컴파일 타임에 잡힙니다.',
        },
        {
          tag: 'Dx',
          title: 'React Compiler 도입 — 수동 메모이제이션 전면 제거',
          detail:
            '복잡한 채팅 UI에 흩어져 있던 `useMemo` / `useCallback`을 **React Compiler** 도입으로 제거했습니다. 대부분의 최적화는 컴파일러에게 위임하고, 세밀한 제어가 반드시 필요한 부분에만 수동 최적화를 적용합니다. 결과: 성능 저하 없이 코드 가독성이 크게 향상됩니다.',
        },
        {
          tag: 'Dx',
          title: '디자인 토큰 시스템: Unistyles 숫자 스케일 팔레트 + 테마 깜빡임 제거',
          detail:
            '**Unistyles**로 숫자 스케일 색상 팔레트를 구축하고, 라이트/다크 테마는 같은 팔레트에서 다른 스텝을 사용합니다. MMKV의 동기 읽기로 첫 렌더 전에 테마를 적용하여 **AsyncStorage 깜빡임을 완전히 제거**했습니다. `UnistylesRuntime.fontScale`로 접근성 폰트 크기를 반영하되, 1~1.2 범위로 클램핑하여 레이아웃 깨짐을 방지합니다.',
        },
        {
          tag: 'Ux',
          title: '사용자 경험을 해치지 않는 수익화: 커스텀 네이티브 광고',
          detail:
            "채팅 화면 상단에 'AD' 태그와 제목만 얇게 한 줄로 노출하는 **네이티브 광고(Native Ads)** 형식을 직접 디자인했습니다. 화면 점유 최소화, 대화 흐름 방해 없음. 도입 후 **이탈률(Drop-off Rate)**을 지속 모니터링하여 수익/UX 균형을 데이터 기반으로 관리했습니다.",
        },
        {
          tag: 'I18n',
          title: 'typesafe-i18n으로 컴파일 타임 i18n Type Safety 확보',
          detail:
            '`typesafe-i18n`이 번역 파일에서 TypeScript 타입을 자동 생성 — 잘못된 키와 누락된 파라미터가 **컴파일 타임에** 잡힙니다. 로케일 파일 로드 완료 후에만 자식을 렌더링하여 첫 화면의 언어 표시 오류를 방지합니다. 언어 전환 시 OS 로케일 동기화 → MMKV 저장 → 번역 파일 비동기 로드 → i18n 컨텍스트 업데이트를 순차 처리합니다.',
        },
        {
          tag: 'R&D',
          accent: true,
          title: '차세대 숏폼 UI 및 iOS 26 Liquid Glass 네이티브 가속 실험',
          detail:
            '정형화된 채팅 앱의 틀을 깨고 사용자의 몰입감을 극대화하기 위해 **풀스크린 숏폼(Shorts) 스와이프 UI**를 자체 설계 및 연구 개발했습니다. 캐릭터 카드를 쓸어넘겨 즉각적으로 대화를 시작하는 자연스러운 UX를 지원합니다. 또한 그래픽 연산 부하를 최소화하고자 JS 스레드를 거치지 않고 시스템 네이티브 API인 **iOS Liquid Glass(UIGlassView)**를 연동해 배터리 효율과 부드러운 렌더링을 동시에 잡는 하드웨어 가속 기법을 적용 및 검증했습니다.',
        },
      ],
    },
    {
      id: 'aira-ko-05',
      type: 'markdown',
      markdown: '## 스크린샷',
    },
    {
      id: 'aira-ko-06',
      type: 'lightbox',
      images: [
        {
          src: '/images/aira/desktop_main.webp',
          mobileSrc: '/images/aira/desktop_main_mobile.jpg',
          alt: '아이라 데스크탑 메인 화면',
          caption: '데스크탑/웹 메인 인터페이스 (반응형)',
        },
        {
          src: '/images/aira/desktop_chat.webp',
          mobileSrc: '/images/aira/desktop_chat_mobile.jpg',
          alt: '아이라 데스크탑 채팅 화면',
          caption: '데스크탑 환경에 최적화된 채팅 경험',
        },
        {
          src: '/images/aira/home_ads.webp',
          alt: '아이라 홈 네이티브 광고',
          caption: '사용자 흐름을 방해하지 않는 홈 피드 광고',
        },
        {
          src: '/images/aira/chat_ads.webp',
          alt: '아이라 채팅 광고',
          caption: '채팅 상단 슬림 바 네이티브 광고',
        },
        {
          src: '/images/aira/reward_ads.webp',
          alt: '아이라 리워드 광고',
          caption: '포인트 충전을 위한 보상형 광고 화면',
        },
      ],
    },
    {
      id: 'aira-ko-07',
      type: 'markdown',
      markdown:
        '### 실기기 인터랙션 및 성능 데모\n\n서비스의 실사용 성능과 차세대 UI 실험 결과를 직접 검증한 화면 녹화본입니다.\n\n* **60fps 채팅 스크롤 성능 검증 (FlashList):** 대량의 대화 로그가 누적되더라도 끊김이 없도록 메모리를 효율적으로 재사용하는 뷰 리사이클링 아키텍처를 도입했습니다. JS 스레드 부하가 큰 상황에서도 UI 스레드 상에서 실시간 키보드 높이에 맞추어 부드럽게 스크롤되도록 Reanimated 워크렛을 적용하여 60fps 수준의 끊김 없는 사용자 흐름을 구현했습니다.\n* **숏폼 스타일의 캐릭터 탐색 UX 및 iOS 26 Liquid Glass R&D:** 사용자가 캐릭터 카드를 숏폼 피드처럼 가로/세로 스와이프로 빠르고 즐겁게 탐색하다가 마음에 들면 별도 화면 전환 없이 그 자리에서 즉시 대화를 이어나가는 몰입형 레이아웃입니다. 또한 무거운 자바스크립트 그래픽 연산 병목 없이 최신 애플의 렌더링 스타일을 재현하기 위해 iOS 네이티브 하드웨어 가속 API(`UIGlassView`)를 연동하여 배터리 효율과 독창적인 비주얼을 실현했습니다.',
    },
    {
      id: 'aira-ko-08',
      type: 'mediaGallery',
      images: [
        {
          src: '/images/aira/chat_flashlist.mp4',
          alt: 'aira Chat FlashList Demo',
        },
        {
          src: '/images/aira/home_flashlist.mp4',
          alt: 'aira Home FlashList Demo',
        },
      ],
    },
    {
      id: 'aira-ko-09',
      type: 'mediaGallery',
      images: [
        {
          src: '/images/aira/v2_home.mp4',
          alt: 'aira V2 Shorts UI and Liquid Glass demo',
        },
      ],
    },
    {
      id: 'aira-ko-10',
      type: 'markdown',
      markdown:
        '## 회고\n\n**"스타트업에서 배운 엔지니어링의 본질"**\n\n### 1. 스트리밍과 캐시 동기화는 생각보다 복잡하다\n\n처음에는 스트림 청크를 로컬 `useState`에 쌓고, 완료되면 Query를 refetch하는 방식을 시도했습니다. 문제는 refetch 중 화면이 잠깐 빈 상태로 돌아가는 것이었습니다. 현재 방식(청크마다 InfiniteQuery 캐시 직접 패치)으로 바꾼 후 타이핑 애니메이션이 자연스러워지고 깜빡임이 사라졌습니다. 트레이드오프는 `InfiniteData` 불변 업데이트 코드가 길고 읽기 어렵다는 점이지만, 번들 크기를 고려해 Immer 없이 직접 작성했습니다.\n\n### 2. 플랫폼별 번들 분리는 초기에 설계해야 한다\n\n웹을 나중에 추가하면서 네이티브 전용 패키지(`expo-in-app-purchases`, `react-native-google-mobile-ads`)가 웹 번들에 포함되어 런타임 에러가 발생했습니다. Metro의 파일 확장자 해석 규칙(`.web.tsx` 우선)을 활용한 플랫폼별 Context 분리로 해결했는데, 이 패턴을 프로젝트 초기부터 알았다면 리팩터링 비용이 없었을 것입니다.\n\n### 3. MMKV + PersistQueryClientProvider `buster`의 조합\n\n처음에는 로그아웃 시 `queryClient.clear()`를 수동으로 호출했습니다. 그러다 컴포넌트 언마운트 타이밍 문제로 캐시가 완전히 지워지지 않는 경우를 발견했습니다. `buster: uid`를 사용하면 `PersistQueryClientProvider`가 마운트될 때 buster가 다르면 자동으로 캐시를 무효화해서, 타이밍 의존 없이 안전하게 사용자별 캐시를 격리할 수 있었습니다.\n\n### 4. Reanimated worklet 경계를 명확히 지켜야 한다\n\n`useAnimatedReaction` 콜백에서 `FlashList.scrollToEnd()`를 직접 호출했더니 크래시가 발생했습니다. worklet은 UI 스레드에서 실행되고, `scrollToEnd`는 JS/RN 스레드 API라 스레드 경계를 넘어 호출하면 안 됩니다. `scheduleOnRN`으로 RN 스레드에 위임하는 방식을 적용한 후 안정적으로 동작했습니다.\n\n### 5. 오버 엔지니어링의 경계\n\n과거에는 모든 코드를 완벽하게 짜는 것이 최선이라 생각했습니다. 하지만 스타트업을 운영하며 **"검증되지 않은 기능에 대한 과도한 기술 투자는 비즈니스 리스크"**가 될 수 있음을 배웠습니다.\n코드 퀄리티를 포기하는 것이 아니라, **서비스의 성장 단계(MVP vs Scale-up)에 맞춰 기술 부채의 허용 범위를 전략적으로 결정**하고, 핵심 가치 검증에 집중하는 **유연한 엔지니어링 사고방식**을 갖게 되었습니다.\n\n### 6. 비즈니스 모델과 비용 구조의 이해\n\nAI 서비스는 GPU/API 등 원가 비중이 매우 높은 사업입니다. 반면, 광고 기반의 B2C 모델은 사용자당 매출(ARPU)을 높이는 데 한계가 있었습니다.\n기술적으로 뛰어난 서비스라도 **높은 운영 비용을 감당할 수 있는 확실한 수익 모델**이 뒷받침되지 않으면 지속 가능하기 어렵다는 것을 체감했습니다. 이를 통해 개발자도 **기술적 구현을 넘어, 서비스의 비용 효율성과 수익 구조를 함께 고민해야 함**을 깊이 이해했습니다.',
    },
  ],
};
