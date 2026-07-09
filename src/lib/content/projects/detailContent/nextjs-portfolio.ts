import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

export const nextjsPortfolioDetailContent: Record<Language, ProjectDetailBlock[]> = {
  en: [
    {
      id: 'nextjs-portfolio-en-01',
      type: 'markdown',
      markdown:
        '## Project overview\n\nA personal portfolio website built by combining the **Next.js App Router** framework and the **Cloudflare Workers** edge environment. It uses the **Vinext** toolchain for edge runtime compatibility. Dynamic routing, multi-region database operations via **Cloudflare D1 (SQLite)**, **R2** media assets, and global caching via **KV** are natively bound to deliver server-side rendering (SSR) at Edge-native speeds.',
    },
    {
      id: 'nextjs-portfolio-en-02',
      type: 'techStack',
    },
    {
      id: 'nextjs-portfolio-en-03',
      type: 'markdown',
      markdown: '## Key work',
    },
    {
      id: 'nextjs-portfolio-en-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Architecture',
          accent: true,
          title: 'Hybrid UX: Combining Résumé and Portfolio',
          detail:
            'Instead of a generic blog format or a heavy single-page app, the home screen is designed as a dense **résumé** for quick scanning, while deep-dive details are rendered from Markdown-like dynamically editable retrospectives. The Next.js edge engine delivers localized HTML instantly without hydration delay.',
        },
        {
          tag: 'i18n & Performance',
          accent: true,
          title: 'Edge-Based Zero-Delay i18n & Cache Optimization',
          detail:
            'To eliminate layout shifts or wrong-language flashes, the edge middleware detects cookies and the `Accept-Language` header to serve localized Next.js HTML on the first response. Instead of relying on outdated baseline numbers, I established a continuous verification and measurement system to validate performance metrics on every new deployment.',
        },
        {
          tag: 'Cloudflare Integration',
          title: 'Full-Stack Serverless Binding (D1, R2, KV)',
          detail:
            'Bound Cloudflare D1 (SQLite) for admin data writes, R2 for project screenshots, and KV for fast static-asset routing to ensure a complex full-stack Next.js app runs seamlessly within a single Worker.',
        },
        {
          tag: 'RSC & Bundle Optimization',
          accent: true,
          title: 'Islands Architecture & JS Bundle Size Reduction',
          detail:
            'Avoided rendering-blocking hydration on the client side by dynamic-importing heavy visualization dependencies such as Mermaid.js only when needed. This keeps non-critical visualization runtime out of the first-load path, while bundle changes are verified from current build output instead of reused as stale fixed numbers.',
        },
        {
          tag: 'Security & Admin CMS',
          title: 'Cloudflare Access Integration & Real-time CMS',
          detail:
            'Created an in-browser content editor integrated with Cloudflare Access. By connecting it with D1 and KV invalidation, content changes can be reflected at runtime without going through the traditional markdown-edit, build, and deploy loop.',
        },
        {
          tag: 'Workflow',
          title: 'Verification-first development workflow',
          detail:
            'Tied project rules, content SSOT, type checks, Vitest, and browser inspection into a repeatable workflow for catching regressions after content or infrastructure changes. The important claim is not automation by itself, but that each change leaves behind evidence through checks and rendered-page verification.',
        },
      ],
    },
    {
      id: 'nextjs-portfolio-en-05',
      type: 'markdown',
      markdown: '## Screenshots',
    },
    {
      id: 'nextjs-portfolio-en-06',
      type: 'lightbox',
      images: [
        {
          src: '/images/nextjs-portfolio/1.webp',
          alt: 'Main page',
          caption: 'Homepage — résumé-style layout for quick information scanning',
        },
        {
          src: '/images/nextjs-portfolio/2.webp',
          alt: 'Responsive design demo',
          caption: 'Pure CSS responsive design — optimized layouts for mobile and desktop',
        },
      ],
    },
    {
      id: 'nextjs-portfolio-en-07',
      type: 'markdown',
      markdown:
        '## Retrospective\n\n**Why Next.js on Cloudflare Workers?** The App Router provides a clean, folder-based layout system that scales well, but standard Next.js deployments can be heavy. By using Vinext, we recompile the React server component layer to run directly on V8 isolates. The result is a fast, global startup with dynamic routing and sub-second rendering times.\n\n**Full-Stack Edge Architecture:** By integrating D1, R2, and KV, we bypassed traditional DB network hops. Database writes are enabled for administration, while cache hits remain close to the edge, making full-stack Next.js development lightweight and cost-effective.',
    },
  ],
  ko: [
    {
      id: 'nextjs-portfolio-ko-01',
      type: 'markdown',
      markdown:
        '## 프로젝트 소개\n\n**Next.js App Router** 프레임워크와 **Cloudflare Workers** 에지 환경을 결합하여 구축한 개인 포트폴리오 사이트입니다. 에지 런타임 호환을 위해 **Vinext** 툴체인을 도입했으며, 동적 라우팅과 **Cloudflare D1 (SQLite)**, **R2** 미디어 에셋 바인딩, **KV** 글로벌 캐싱이 유기적으로 맞물려 작동하여 정적 사이트 수준의 속도로 동적 서버 사이드 렌더링(SSR)을 제공합니다.',
    },
    {
      id: 'nextjs-portfolio-ko-02',
      type: 'techStack',
    },
    {
      id: 'nextjs-portfolio-ko-03',
      type: 'markdown',
      markdown: '## 주요 작업',
    },
    {
      id: 'nextjs-portfolio-ko-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Architecture',
          accent: true,
          title: '이력서와 포트폴리오의 하이브리드 결합',
          detail:
            '단순한 블로그 형식이나 무거운 단일 페이지 앱 대신, 홈 화면은 정보를 한눈에 전달하는 **Dense Résumé** 형식으로 설계하고 상세 정보는 동적으로 수정 가능한 프로젝트 회고록으로 구현했습니다. Next.js 에지 엔진이 클라이언트 하이드레이션 지연 없이 다국어 HTML을 즉각 렌더링하여 효율적인 정보 탐색을 돕습니다.',
        },
        {
          tag: 'i18n & Performance',
          accent: true,
          title: '엣지 기반 무지연 다국어 대응 및 캐시 최적화',
          detail:
            '다국어 제공 시 프론트엔드 단에서 발생하는 화면 깜빡임(Flicker)을 제거하기 위해, 엣지 미들웨어에서 쿠키와 `Accept-Language`를 분석하여 첫 응답부터 알맞은 언어로 완성된 Next.js HTML을 전송합니다. 단순히 과거의 특정 수치에 의존하기보다, 실시간으로 최신 배포의 성능을 검증하고 유지할 수 있는 측정 기반의 최적화 체계를 구축했습니다.',
        },
        {
          tag: 'Cloudflare Integration',
          title: '풀스택 서버리스 바인딩 (D1, R2, KV)',
          detail:
            '관리자 페이지 데이터 및 콘텐츠 재정의를 위한 Cloudflare D1(SQLite), 프로젝트 스크린샷 저장을 위한 R2, 정적 에셋 라우팅을 위한 KV를 바인딩하여 복잡한 풀스택 Next.js 애플리케이션이 하나의 Workers 인프라에서 부드럽게 구동되도록 구현했습니다.',
        },
        {
          tag: 'RSC & Bundle Optimization',
          accent: true,
          title: 'Islands 아키텍처 도입 및 JS 번들 크기 경량화',
          detail:
            'Mermaid.js 등 대용량 클라이언트 시각화 라이브러리를 동적 임포트(Dynamic Import)로 필요 시점에만 비동기 로딩(Islands)하도록 설계했습니다. 첫 화면에서 필요하지 않은 시각화 런타임을 분리해 초기 로딩 경로를 가볍게 유지하고, 번들 변화는 빌드 결과를 기준으로 다시 검증할 수 있게 관리합니다.',
        },
        {
          tag: 'Security & Admin CMS',
          title: 'Cloudflare Access 연동 및 실시간 콘텐츠 에디터',
          detail:
            'Cloudflare Access 권한 제어 연동을 통해 브라우저에서 직접 데이터를 수정할 수 있는 관리자 웹 에디터를 구현했습니다. D1 데이터베이스 및 KV 캐시 무효화를 결합하여, 기존 마크다운 파일 수정-빌드-배포 흐름을 거치지 않고 런타임에서 콘텐츠를 반영하는 구조로 개편했습니다.',
        },
        {
          tag: 'Workflow',
          title: '검증 중심 개발 워크플로우',
          detail:
            '프로젝트 규칙, 콘텐츠 SSOT, 타입 체크, Vitest, 브라우저 확인을 묶어 수정 후 회귀를 빠르게 확인하는 흐름을 만들었습니다. 특히 다국어 메타데이터와 상세 콘텐츠가 한쪽 언어만 어긋나지 않도록 테스트와 카탈로그 검증을 유지합니다.',
        },
      ],
    },
    {
      id: 'nextjs-portfolio-ko-05',
      type: 'markdown',
      markdown: '## 스크린샷',
    },
    {
      id: 'nextjs-portfolio-ko-06',
      type: 'lightbox',
      images: [
        {
          src: '/images/nextjs-portfolio/1.webp',
          alt: '메인 페이지',
          caption: '홈 화면 — 빠른 정보 파악을 위한 이력서 스타일 레이아웃',
        },
        {
          src: '/images/nextjs-portfolio/2.webp',
          alt: '반응형 디자인 데모',
          caption: 'Pure CSS 반응형 디자인 — 모바일과 데스크탑에 최적화된 레이아웃',
        },
      ],
    },
    {
      id: 'nextjs-portfolio-ko-07',
      type: 'markdown',
      markdown:
        '## 회고\n\n**왜 Cloudflare Workers 환경에서 Next.js인가?** Next.js의 App Router는 가독성 높은 폴더 기반 레이아웃과 높은 확장성을 제공하지만, 프로덕션 서버 환경은 다소 무거울 수 있습니다. Vinext 빌드를 통해 React 서버 컴포넌트 레이어를 V8 Isolate 환경 위에서 직접 실행되도록 컴파일하여, 에지 특유의 즉각적인 글로벌 기동과 빠른 렌더링 성능을 동시에 만족시킵니다.\n\n**풀스택 에지 아키텍처의 이점:** D1 데이터베이스, R2 스토리지, KV 캐시를 Workers 컨텍스트에 직접 바인딩함으로써, 전통적인 웹서버가 가졌던 네트워크 홉 문제를 우회했습니다. 데이터 변경은 D1을 통해 안전하게 작성하되 캐시 히트는 에지 단에서 처리하여 풀스택 구성을 가볍고 저비용으로 구축할 수 있었습니다.',
    },
  ],
};
