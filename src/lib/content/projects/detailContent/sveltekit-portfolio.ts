import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

export const sveltekitPortfolioDetailContent: Record<Language, ProjectDetailBlock[]> = {
  en: [
    {
      id: 'sveltekit-portfolio-en-01',
      type: 'markdown',
      markdown:
        '## Project overview\n\n**"Adding the flexibility of dynamic routing to the performance of a static site"**\n\nTraditional static hosting like GitHub Pages cannot execute server-side logic, so localization had to rely on client-side JavaScript — causing a flash of unstyled/wrong-language content before the redirect. I migrated to **Cloudflare Pages** to adopt a hybrid strategy: **SSG performance** for all content, plus **Edge Functions** that detect the user\'s language at the request level before the HTML ever reaches the browser.',
    },
    {
      id: 'sveltekit-portfolio-en-02',
      type: 'techStack',
    },
    {
      id: 'sveltekit-portfolio-en-03',
      type: 'markdown',
      markdown: '## Key work',
    },
    {
      id: 'sveltekit-portfolio-en-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Architecture',
          accent: true,
          title: 'Hybrid UX: Combining Résumé and Portfolio',
          detail:
            'Instead of a generic blog format or a heavy single-page app, the home screen is designed as a dense **résumé** for quick scanning, while deep-dive details are rendered from Markdown retrospectives. This design focuses on the primary goal of a portfolio — helping hiring managers explore information efficiently without unnecessary navigation.',
        },
        {
          tag: 'i18n & Performance',
          accent: true,
          title: 'Edge-Based Zero-Delay i18n & Cache Optimization',
          detail:
            'To eliminate layout shifts or wrong-language flashes, the edge middleware (Cloudflare Pages handle) detects cookies and the `Accept-Language` header to serve pre-rendered HTML instantly. Light integrations like font preloading and immutable assets caching were added to guarantee a Lighthouse Performance score of 97.',
        },
        {
          tag: 'Troubleshooting',
          title: 'Svelte 5 Migration & Build-Time Compatibility Bridge',
          detail:
            'While migrating to Svelte 5 (Runes) to simplify state management, I encountered a build error where the markdown renderer (mdsvex) generated Svelte 4 legacy module scripts. Rather than relying on heavy or unverified third-party libraries, I wrote a lightweight regex-based preprocessor for the build pipeline to solve the blocker independently.',
        },
        {
          tag: 'DX & Integrity',
          title: 'Automated Translation Integrity Checking',
          detail:
            'Updating bilingual content frequently led to human errors, such as missing translations or mismatched metadata. Instead of using complex translation management tools, I wrote a lightweight Vitest script to automatically assert the structural symmetry of localized files during the build stage, ensuring translation integrity at minimum cost.',
        },
        {
          tag: 'UX & Context',
          title: 'Interviewer-Centric User Experience Design',
          detail:
            'Designed three core UX features to facilitate seamless evaluation by hiring managers: 1) **One-click technology filtering** that dynamically isolates relevant projects based on chosen tech stacks, 2) **intelligent scroll restoration** using session history to preserve the reading position when returning from detailed project pages, and 3) a dedicated, print-friendly **Print View** for clean paper/PDF export without broken layouts.',
        },
      ],
    },
    {
      id: 'sveltekit-portfolio-en-05',
      type: 'markdown',
      markdown: '## Screenshots',
    },
    {
      id: 'sveltekit-portfolio-en-06',
      type: 'lightbox',
      images: [
        {
          src: '/images/sveltekit-portfolio/1.webp',
          mobileSrc: '/images/sveltekit-portfolio/1_mobile.jpg',
          alt: 'Main page',
          caption: 'Homepage — résumé-style layout for quick information scanning',
        },
        {
          src: '/images/sveltekit-portfolio/2.webp',
          alt: 'Responsive design demo',
          caption: 'Pure CSS responsive design — optimized layouts for mobile and desktop',
        },
        {
          src: '/images/sveltekit-portfolio/3.webp',
          alt: 'Lighthouse performance score',
          caption: 'Lighthouse results: Performance 97, Accessibility 100, Best Practices 100',
        },
      ],
    },
    {
      id: 'sveltekit-portfolio-en-07',
      type: 'markdown',
      markdown:
        "## Retrospective\n\n**Why Cloudflare Pages over GitHub Pages?** The core issue was the initial load experience. Static hosting forces a blank-page → JS language check → redirect cycle that causes a visible flicker. Edge Functions intercept the request before anything reaches the browser, so the first HTML is already correct.\n\n**Why Svelte over Next.js?** Next.js static exports still ship the React runtime and incur hydration overhead — unnecessary for a content-focused portfolio. Svelte compiles components to optimized vanilla JS with no runtime, resulting in faster FCP and a smaller bundle.\n\n**SEO vs. privacy tradeoff:** The Lighthouse SEO score of 66 is a deliberate choice. The résumé contains personal contact details and career history that shouldn't be freely indexed. `noindex` is the right call here.",
    },
  ],
  ko: [
    {
      id: 'sveltekit-portfolio-ko-01',
      type: 'markdown',
      markdown:
        '## 프로젝트 소개\n\n**"정적 사이트의 성능에 동적 라우팅의 유연함을 더하다"**\n\nGitHub Pages 같은 순수 정적 호스팅에서는 서버 사이드 로직을 사용할 수 없어, 다국어 처리를 클라이언트 JavaScript에 의존해야 했습니다. 그 결과 잘못된 언어로 렌더링된 페이지가 잠깐 보였다 사라지는 깜빡임 현상이 발생했습니다. **Cloudflare Pages**로 마이그레이션하여 하이브리드 전략을 채택했습니다. 모든 콘텐츠는 **SSG 성능**을 유지하면서, **Edge Functions**가 요청 단계에서 사용자 언어를 감지해 HTML이 브라우저에 도달하기 전에 이미 올바른 언어로 완성되도록 했습니다.',
    },
    {
      id: 'sveltekit-portfolio-ko-02',
      type: 'techStack',
    },
    {
      id: 'sveltekit-portfolio-ko-03',
      type: 'markdown',
      markdown: '## 주요 작업',
    },
    {
      id: 'sveltekit-portfolio-ko-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Architecture',
          accent: true,
          title: '이력서와 포트폴리오의 하이브리드 결합',
          detail:
            '단순한 블로그 형식이나 무거운 단일 페이지 앱 대신, 홈 화면은 정보를 한눈에 전달하는 **Dense Résumé** 형식으로 설계하고 상세 정보는 마크다운 회고록으로 구현했습니다. 방문자(면접관)가 불필요한 링크 이동 없이 효율적으로 정보를 탐색하도록 돕는 포트폴리오 본연의 목적에 집중한 설계입니다.',
        },
        {
          tag: 'i18n & Performance',
          accent: true,
          title: '엣지 기반 무지연 다국어 대응 및 캐시 최적화',
          detail:
            '다국어 제공 시 프론트엔드 단에서 발생하는 화면 깜빡임(Flicker)을 제거하기 위해, 엣지 미들웨어(Cloudflare Pages handle)에서 HTTP 요청의 쿠키와 `Accept-Language`를 즉시 파악하여 첫 HTML부터 알맞게 렌더링했습니다. 또한 폰트 헤더 프리로드 및 브라우저 영구 캐싱 설정을 가볍게 적용하여 Lighthouse Performance 97점을 확보했습니다.',
        },
        {
          tag: 'Troubleshooting',
          title: 'Svelte 5 마이그레이션 및 빌드 타임 컴파일 호환성 확보',
          detail:
            '코드 유지보수를 위해 Svelte 5(Runes)로 전환하는 과정에서, 마크다운 렌더러인 mdsvex가 Svelte 4 스펙의 모듈 스크립트를 출력하는 빌드 호환성 충돌이 발생했습니다. 무겁거나 검증되지 않은 외부 라이브러리에 의존하는 대신, 빌드 파이프라인에 간단한 정규식 전처리기를 직접 구현하여 호환성 블로커를 독립적으로 해결했습니다.',
        },
        {
          tag: 'DX & Integrity',
          title: '다국어 리소스 정합성 검증 테스트 자동화',
          detail:
            '콘텐츠를 업데이트할 때 한국어/영어 중 한쪽이 누락되거나 메타데이터 필드가 어긋나는 휴먼 에러가 자주 일어났습니다. 거창한 번역 관리 도구 대신, 빌드 전에 작동하는 가벼운 Vitest 테스트 하나로 양국어 파일 쌍의 완벽한 대칭성을 검사하도록 설계하여 최소한의 비용으로 다국어 콘텐츠 정합성을 확보했습니다.',
        },
        {
          tag: 'UX & Context',
          title: '면접관의 탐색 흐름을 고려한 사용자 경험 설계',
          detail:
            '서류 검토자(면접관)가 정보를 편리하게 검토할 수 있도록 세 가지 장치를 마련했습니다. 1) 관심 있는 기술 스택만 선택해 관련 프로젝트를 모아볼 수 있는 **원클릭 기술 태그 필터링**, 2) 상세 프로젝트 회고를 읽고 홈으로 돌아왔을 때 보던 위치를 유지해주는 **스크롤 위치 보존 및 복원**, 3) 종이나 PDF로 인쇄/저장할 때 깨짐 없이 가독성을 확보해주는 **인쇄 전용 단일 페이지 뷰(Print View)**를 제공합니다.',
        },
      ],
    },
    {
      id: 'sveltekit-portfolio-ko-05',
      type: 'markdown',
      markdown: '## 스크린샷',
    },
    {
      id: 'sveltekit-portfolio-ko-06',
      type: 'lightbox',
      images: [
        {
          src: '/images/sveltekit-portfolio/1.webp',
          mobileSrc: '/images/sveltekit-portfolio/1_mobile.jpg',
          alt: '메인 페이지',
          caption: '홈 화면 — 빠른 정보 파악을 위한 이력서 스타일 레이아웃',
        },
        {
          src: '/images/sveltekit-portfolio/2.webp',
          alt: '반응형 디자인 데모',
          caption: 'Pure CSS 반응형 디자인 — 모바일과 데스크탑에 최적화된 레이아웃',
        },
        {
          src: '/images/sveltekit-portfolio/3.webp',
          alt: 'Lighthouse 성능 점수',
          caption: 'Lighthouse 결과: Performance 97, Accessibility 100, Best Practices 100',
        },
      ],
    },
    {
      id: 'sveltekit-portfolio-ko-07',
      type: 'markdown',
      markdown:
        '## 회고\n\n**왜 GitHub Pages에서 Cloudflare Pages로?** 핵심 문제는 초기 로딩 경험이었습니다. 정적 호스팅에서는 빈 화면 → JS 언어 확인 → 리다이렉트 순서로 동작해 눈에 띄는 깜빡임이 발생합니다. Edge Functions가 요청을 브라우저에 도달하기 전에 가로채어 처리하므로, 첫 번째 HTML이 처음부터 올바릅니다.\n\n**왜 Next.js 대신 Svelte?** Next.js의 정적 배포 결과물은 여전히 React 런타임을 포함해 하이드레이션 비용이 발생합니다. 콘텐츠 중심의 포트폴리오 사이트에는 불필요한 오버헤드입니다. Svelte는 컴파일 단계에서 최적화된 바닐라 JS로 변환되므로 런타임이 가볍고 FCP가 빠릅니다.\n\n**SEO vs. 프라이버시 트레이드오프:** Lighthouse SEO 점수 66점은 의도된 선택입니다. 이력서에는 개인 연락처와 경력 정보가 포함되어 있어 무분별하게 인덱싱되어서는 안 됩니다. 이 경우 `noindex`가 올바른 결정입니다.',
    },
  ],
};
