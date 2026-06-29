import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

export const todayWeatherDetailContent: Record<Language, ProjectDetailBlock[]> = {
  en: [
    {
      id: 'today-weather-en-01',
      type: 'markdown',
      markdown:
        '## Project overview\n\n**"A guide, not just data"**\n\nExisting weather apps share three frustrations: global data sources that miss Korea\'s local forecasts, information scattered across too many screens, and raw numbers that still make the user do the mental math — "is 15°C a jacket or a coat day?" **Today\'s Weather** uses the most accurate local sources (KMA, Air Korea) and translates the data into immediate action plans: what to wear, whether to take an umbrella, and whether to bring a mask.',
    },
    {
      id: 'today-weather-en-02',
      type: 'techStack',
    },
    {
      id: 'today-weather-en-03',
      type: 'markdown',
      markdown: '## Key work',
    },
    {
      id: 'today-weather-en-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Architecture',
          accent: true,
          title: 'pnpm Monorepo — 100% shared business logic',
          detail:
            'Designed a monorepo with three workspaces: `apps/web` (Next.js 16 App Router), `apps/mobile` (Expo / React Native), and `packages/shared` (common logic and TypeScript types). The weather recommendation algorithm, outfit-calculation logic, and all TypeScript type definitions live in `packages/shared` and are consumed identically by both apps and by iOS widgets — zero duplication across platforms. Enabled the **React Compiler** in the Next.js app to eliminate manual `useMemo` / `useCallback` declarations.',
        },
        {
          tag: 'Performance',
          accent: true,
          title: 'Edge-optimized backend + Upstash Redis caching (80%+ load reduction)',
          detail:
            'Korean public APIs (KMA, Air Korea) block requests from non-Korean IP addresses. Fixed the Vercel serverless execution region to **icn1 (Seoul)** to resolve this at the infrastructure level. Layered **Upstash Redis** in front of both APIs with a 30-minute TTL, batching rapid user requests into a single upstream call per window. This reduced upstream API load by over 80% and cut p99 response latency significantly.',
        },
        {
          tag: 'Platform',
          title: 'iOS Home Screen widget via @bacons/apple-targets',
          detail:
            'Implemented a **Swift-based iOS Home Screen widget** inside the Expo project using `@bacons/apple-targets`. The widget reads weather data from the same Supabase backend as the app, keeping the widget display synchronized in real time without a separate data pipeline. Combined **Anonymous Auth** with Supabase Edge Functions to deliver personalized weather alerts as push notifications in a fully serverless environment.',
        },
        {
          tag: 'Data',
          title: 'Multi-factor recommendation engine',
          detail:
            "The recommendation engine synthesizes temperature, wind speed, precipitation probability (POP), precipitation type (PTY), and fine dust concentrations into three daily verdicts:\n- **Outfit:** 6-level clothing recommendation based on apparent temperature, with a wind-chill correction that adjusts the category when wind speed is high.\n- **Umbrella:** Triggered when POP ≥ 60% or when active precipitation is detected (PTY ≠ 0).\n- **Mask:** Graded against the worse of PM2.5 or PM10 — so a good PM2.5 reading doesn't mask a bad PM10 day.",
        },
      ],
    },
    {
      id: 'today-weather-en-05',
      type: 'markdown',
      markdown:
        "### Cache and data flow\n\nToday's Weather is not just a public API client. It is a data pipeline designed around the latency, regional blocking, and rate-limit constraints of Korean public APIs.\n\n1. The app normalizes the user's GPS or IP-based location into coordinates.\n2. Next.js Route Handlers run in Vercel's `icn1` region so Korean public APIs can be called from a Korean IP region.\n3. Each API route checks Upstash Redis first and returns `fromCache: true` immediately on a cache hit.\n4. Only cache misses call KMA, Air Korea, or Kakao, then store the result in Redis with a route-specific TTL.\n5. The web and Expo apps consume the same `packages/shared` API client and TanStack Query key factory.\n6. The iOS widget calls the same `/api/weather` and `/api/dust` endpoints using the persisted `apiBaseUrl`, `lat`, and `lon`, and skips network refreshes when data was updated within the last 5 minutes.\n\n| Data | Cache key basis | TTL | Why |\n| --- | --- | --- | --- |\n| Weather forecast | KMA grid `nx`, `ny` | 30 minutes | Short-term weather changes often, but this still batches rapid user requests |\n| Fine dust | Coordinates rounded to 0.1° | 30 minutes | Users in the same area share the same regional air-quality reading |\n| Weather alerts | Coordinates rounded to 0.1° | 10 minutes | Alerts can change quickly, so the TTL is shorter |\n| UV index | Coordinates rounded to 0.1° | 1 hour | UV changes more slowly than current weather |\n| Pollen | Coordinates rounded to 0.1° | 6 hours | Published on a slower daily cadence |\n| Address label | Coordinates rounded to 0.01° | 24 hours | Administrative address labels rarely change |\n\nOn the client, TanStack Query uses a 5-minute default `staleTime`, and only successful queries are persisted for up to 24 hours in IndexedDB on web and AsyncStorage on Expo. Returning users see the last successful data immediately while the app revalidates only the queries that need fresh data.\n\n### Current product status\n\n- The web app is running on Next.js App Router and reads live KMA and Air Korea data.\n- The Expo app uses the same shared package and revalidates forecast queries when the app returns to the foreground.\n- The iOS Home Screen widget is implemented as a Swift target inside the Expo project via `@bacons/apple-targets`.\n- Outfit, umbrella, and mask recommendations are calculated by the same shared logic across surfaces.\n- Remaining evidence to add: real-device mobile/widget screenshots and deployment-status proof.\n\n## Screenshots",
    },
    {
      id: 'today-weather-en-06',
      type: 'lightbox',
      variant: 'phone',
      images: [
        {
          src: '/images/today-weather/web-home.png',
          alt: "Today's Weather web app home screen",
          caption:
            'Mobile web home screen showing current weather, lifestyle alerts, and outfit, umbrella, and mask decisions from KMA and Air Korea data',
        },
      ],
    },
    {
      id: 'today-weather-en-07',
      type: 'markdown',
      markdown:
        '## Retrospective\n\n**Latest tech in production:** Navigating the breaking changes in Next.js 16 and React 19 gave me a hands-on understanding of the modern React ecosystem — including where the React Compiler genuinely reduces boilerplate and where it still requires manual guidance.\n\n**Infrastructure constraints:** IP blocking and rate limiting are real problems that documentation rarely prepares you for. Region-pinning serverless functions and Redis caching were the right fixes, and working through them sharpened my instinct for solving infra problems at the right layer.\n\n**Cross-platform abstraction:** Sharing business logic across a web app, a mobile app, and an iOS widget without duplication validated the monorepo design. The shared package pattern is now a default in how I structure multi-platform projects.',
    },
  ],
  ko: [
    {
      id: 'today-weather-ko-01',
      type: 'markdown',
      markdown:
        '## 프로젝트 소개\n\n**"데이터가 아닌 가이드를 원했습니다"**\n\n기존 날씨 앱들의 공통적인 불편함은 세 가지입니다: 국내 로컬 예보를 빗나가는 해외 데이터 소스, 여러 화면에 흩어진 정보, 그리고 결국 사용자가 직접 해석해야 하는 숫자들 — "15도면 자켓인가, 코트인가?" **오늘날씨**는 가장 정확한 국산 데이터(기상청, 에어코리아)를 활용해 즉시 실행 가능한 답변을 제공합니다: 오늘 어떻게 입을지, 우산을 챙길지, 마스크가 필요한지.',
    },
    {
      id: 'today-weather-ko-02',
      type: 'techStack',
    },
    {
      id: 'today-weather-ko-03',
      type: 'markdown',
      markdown: '## 주요 작업',
    },
    {
      id: 'today-weather-ko-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Architecture',
          accent: true,
          title: 'pnpm 모노레포 — 비즈니스 로직 100% 공유',
          detail:
            '세 개의 워크스페이스로 모노레포를 설계했습니다: `apps/web`(Next.js 16 App Router), `apps/mobile`(Expo / React Native), `packages/shared`(공통 로직 및 TypeScript 타입). 날씨 추천 알고리즘, 복장 계산 로직, 모든 TypeScript 타입 정의가 `packages/shared`에 있으며 두 앱과 iOS 위젯에서 동일하게 소비됩니다 — 플랫폼 간 코드 중복이 없습니다. Next.js 앱에서 **React Compiler**를 활성화하여 수동 `useMemo` / `useCallback` 선언을 제거했습니다.',
        },
        {
          tag: 'Performance',
          accent: true,
          title: '엣지 최적화 백엔드 + Upstash Redis 캐싱 (API 부하 80%+ 절감)',
          detail:
            '한국 공공 API(기상청, 에어코리아)는 비한국 IP의 요청을 차단합니다. Vercel 서버리스 실행 환경을 **icn1(서울)**로 고정하여 인프라 레벨에서 해결했습니다. 두 API 앞단에 30분 TTL의 **Upstash Redis**를 레이어로 추가해 빠른 사용자 요청들을 윈도우당 하나의 업스트림 호출로 배칭했습니다. 이를 통해 업스트림 API 부하를 80% 이상 절감하고 p99 응답 지연 시간을 크게 줄였습니다.',
        },
        {
          tag: 'Platform',
          title: '@bacons/apple-targets를 통한 iOS 홈 화면 위젯',
          detail:
            '`@bacons/apple-targets`를 사용하여 Expo 프로젝트 내에서 **Swift 기반 iOS 홈 화면 위젯**을 구현했습니다. 위젯은 앱과 동일한 Supabase 백엔드에서 날씨 데이터를 읽어, 별도의 데이터 파이프라인 없이 실시간으로 동기화됩니다. **익명 인증(Anonymous Auth)**과 Supabase Edge Functions를 결합하여 완전한 서버리스 환경에서 맞춤형 날씨 알림을 푸시로 전달하는 아키텍처를 구축했습니다.',
        },
        {
          tag: 'Data',
          title: '다중 요소 추천 엔진 (복장 / 우산 / 마스크)',
          detail:
            '추천 엔진은 기온, 풍속, 강수 확률(POP), 강수 형태(PTY), 미세먼지 농도를 종합하여 하루 세 가지 판단을 내립니다:\n- **복장:** 체감 온도 기반 6단계 복장 추천, 풍속이 강할 때 카테고리를 조정하는 풍속 체감 보정 로직 적용.\n- **우산:** POP ≥ 60% 또는 현재 강수 형태 감지 시(PTY ≠ 0) 알림 발동.\n- **마스크:** PM2.5 또는 PM10 중 나쁜 쪽 기준으로 등급 판단 — PM2.5가 좋아도 PM10이 나쁘면 마스크 권고.',
        },
      ],
    },
    {
      id: 'today-weather-ko-05',
      type: 'markdown',
      markdown:
        '### 캐시·데이터 흐름\n\n오늘날씨는 단순히 공공 API를 호출하는 앱이 아니라, 국내 공공 API의 지연·차단·호출 제한을 전제로 설계한 데이터 파이프라인입니다.\n\n1. 사용자의 GPS 또는 IP 기반 위치를 좌표로 정규화합니다.\n2. Next.js Route Handler가 Vercel `icn1` 리전에서 실행되어 한국 IP 조건이 필요한 공공 API를 호출합니다.\n3. 각 API route는 먼저 Upstash Redis를 조회하고, cache hit이면 `fromCache: true` 응답을 즉시 반환합니다.\n4. cache miss일 때만 기상청·에어코리아·Kakao API를 호출한 뒤 Redis에 TTL과 함께 저장합니다.\n5. 웹과 Expo 앱은 동일한 `packages/shared` API client와 TanStack Query key factory를 사용해 데이터를 소비합니다.\n6. iOS 위젯은 저장된 `apiBaseUrl`, `lat`, `lon`으로 동일한 `/api/weather`, `/api/dust` 엔드포인트를 호출하고, 최근 5분 내 갱신 데이터가 있으면 네트워크 요청을 생략합니다.\n\n| 데이터 | 캐시 키 기준 | TTL | 이유 |\n| --- | --- | --- | --- |\n| 날씨 예보 | 기상청 격자 `nx`, `ny` | 30분 | 초단기 실황·예보가 자주 바뀌지만 사용자 요청을 충분히 묶을 수 있는 단위 |\n| 미세먼지 | 좌표 0.1도 반올림 | 30분 | 같은 권역 사용자는 동일한 시도 단위 대기질 데이터를 공유 |\n| 특보 | 좌표 0.1도 반올림 | 10분 | 특보는 빠르게 바뀔 수 있어 더 짧게 유지 |\n| 자외선 | 좌표 0.1도 반올림 | 1시간 | 자외선 지수는 급격히 변하지 않는 데이터 |\n| 꽃가루 | 좌표 0.1도 반올림 | 6시간 | 일 단위 발표 데이터라 긴 TTL 적용 |\n| 주소 | 좌표 0.01도 반올림 | 24시간 | 행정동명은 거의 변하지 않으므로 장기 캐시 |\n\n클라이언트는 TanStack Query의 기본 `staleTime`을 5분으로 두고, 성공한 쿼리만 IndexedDB(웹)와 AsyncStorage(Expo)에 최대 24시간 보존합니다. 그래서 앱 재진입 시에는 이전 성공 데이터를 먼저 보여주고, 백그라운드에서 필요한 쿼리만 다시 검증합니다.\n\n### 현재 제품 상태\n\n- 웹 앱은 Next.js App Router 기반으로 실제 기상청·에어코리아 데이터를 조회하는 상태입니다.\n- Expo 앱은 웹과 동일한 공유 패키지를 사용하며, 앱 활성화 시 주요 예보 쿼리를 다시 검증합니다.\n- iOS 홈 화면 위젯은 `@bacons/apple-targets`로 Expo 프로젝트 내부에 Swift target을 붙여 구현했습니다.\n- 추천 결과는 복장·우산·마스크 판단을 같은 shared logic에서 계산하도록 구성했습니다.\n- 남은 보강 지점은 모바일 앱/위젯 실기기 스크린샷과 배포 상태 증거를 추가하는 것입니다.\n\n## 스크린샷',
    },
    {
      id: 'today-weather-ko-06',
      type: 'lightbox',
      variant: 'phone',
      images: [
        {
          src: '/images/today-weather/web-home.png',
          alt: '오늘날씨 웹 앱 홈 화면',
          caption:
            '기상청·에어코리아 데이터를 바탕으로 현재 날씨, 생활 알림, 복장·우산·마스크 판단을 한 화면에서 보여주는 모바일 웹 홈 화면',
        },
      ],
    },
    {
      id: 'today-weather-ko-07',
      type: 'markdown',
      markdown:
        '## 회고\n\n**최신 기술 스택의 실전 도입:** Next.js 16과 React 19의 파괴적 변경 사항을 직접 해결하며 React Compiler가 실제로 보일러플레이트를 줄여주는 경우와 수동 안내가 여전히 필요한 경우를 체감으로 이해했습니다.\n\n**인프라 제약 조건 해결:** IP 차단과 Rate Limit은 문서에서 잘 다루지 않는 실제 문제입니다. 서버리스 리전 고정과 Redis 캐싱이 올바른 해결책이었고, 이 경험을 통해 인프라 문제를 적절한 레이어에서 해결하는 감각을 키웠습니다.\n\n**크로스 플랫폼 추상화:** 중복 없이 웹 앱, 모바일 앱, iOS 위젯에서 비즈니스 로직을 공유하는 것이 모노레포 설계의 핵심 가치임을 검증했습니다. 공유 패키지 패턴은 이제 멀티 플랫폼 프로젝트를 구성하는 기본 방식이 되었습니다.',
    },
  ],
};
