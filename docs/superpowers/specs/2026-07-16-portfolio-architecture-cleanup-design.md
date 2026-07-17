# Portfolio Architecture Cleanup Design

## 목표

현재 진행 중인 프로젝트 MDX 통합을 보존하면서 홈·프로젝트 상세·라우팅·컴포넌트·서버 모듈의 책임을 다시 나눈다. 콘텐츠 작성자가 한눈에 데이터를 찾을 수 있고, App Router의 `layout.tsx`와 `page.tsx` 역할이 분명하며, 과거 구현의 고아 파일과 우회 계층을 안전하게 제거할 수 있는 구조를 만든다.

이번 정리는 두 단계로 실행한다.

1. 공개 포트폴리오의 콘텐츠와 렌더링 경계를 정리한다.
2. 안정화된 공개 구조를 기준으로 admin·API·analytics를 포함한 전체 `src`를 감사한다.

## 현재 상태와 판단 근거

- 프로젝트별 `index.ts`와 별도 `detailContent/*.ts`를 제거하고 `detail.{locale}.mdx`의 frontmatter와 본문으로 합치는 작업이 진행 중이다.
- 홈 데이터는 `profile.ts`, `credentials.ts`, `careers.ts`, `resume.ts`, `homePageData.ts`에 나뉘어 있고, 작성 콘텐츠와 파생 로직의 경계가 불명확하다.
- `portfolioRouteViews.tsx`는 metadata 생성, 홈 모델 조립, 단축 URL의 DB 조회, 상세 MDX 선택, JSX 조립을 함께 담당한다.
- 한국어 기본 route와 `/en` route가 같은 화면을 렌더링하지만 `page.tsx`가 locale별로 중복되어 있다. App Router의 `[locale]` 동적 세그먼트로 구현을 통합하되 공개 URL 정책은 유지할 수 있다.
- `HomePageClient`가 홈의 넓은 영역을 Client Component 경계로 만들지만 실제 브라우저 상태가 필요한 부분은 내비게이션과 일부 인터랙션 컴포넌트다.
- `src/lib/components`에는 공용 UI, 포트폴리오 화면, analytics, route shell이 한 폴더에 섞여 있다.
- 현재 `pnpm exec vinext check` 결과는 `100% compatible (15 supported, 0 partial, 0 issues)`다.
- TypeScript와 143개 Vitest 테스트는 통과하지만 lint에는 import 정렬, 명시적 `any`, 미사용 코드 문제가 남아 있다. 구조 이동 전에 이 상태를 먼저 안정화해야 한다.

## 선택한 접근

### 하이브리드 책임 분리

`app`에는 라우트 파일과 라우트 사이에서 지속되는 shell만 둔다. 재사용 UI는 `src/components`, 사람이 수정하는 표시 콘텐츠는 `src/content`, 도메인 규칙과 화면 모델 조립은 `src/lib/portfolio`가 소유한다.

단순히 `src/lib/components`를 `src/components`로 이름만 바꾸는 최소 이동은 `data`와 `content`의 혼재를 해결하지 못하므로 채택하지 않는다. 모든 UI를 `app/**/_components`에 넣는 완전 route-colocation도 한국어·영어·단축 URL이 같은 화면을 공유하는 현재 구조에서는 중복을 늘리므로 채택하지 않는다.

## 목표 디렉터리 구조

```text
src/
├── app/
│   ├── fonts/
│   │   └── WantedSansVariable.woff2
│   ├── layout.tsx
│   ├── (portfolio)/
│   │   ├── _components/
│   │   │   └── PortfolioClientShell.tsx
│   │   └── [locale]/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── [slug]/page.tsx
│   │       ├── privacy/page.tsx
│   │       └── projects/[slug]/page.tsx
│   └── a/
│       ├── _components/
│       └── layout.tsx
├── components/
│   ├── ui/
│   └── portfolio/
│       ├── home/
│       ├── layout/
│       ├── navigation/
│       └── project-detail/
├── content/
│   ├── home/
│   │   ├── index.ts
│   │   ├── profile.ts
│   │   ├── careers.ts
│   │   └── credentials.ts
│   ├── privacy/
│   └── projects/
│       └── {slug}/
│           ├── detail.en.mdx
│           └── detail.ko.mdx
├── config/
│   └── site.ts
└── lib/
    ├── portfolio/
    │   ├── catalog.ts
    │   ├── homePage.ts
    │   ├── metadata.ts
    │   ├── skills.ts
    │   └── types.ts
    ├── server/
    └── utils/
```

### 위치 규칙

- `src/app/fonts`는 유지한다. `next/font/local`을 호출하는 root layout과 함께 있는 전역 폰트 자산이며 Next.js가 공식적으로 허용하는 위치다.
- 하나의 라우트 그룹에서만 쓰는 shell과 provider adapter는 `app/**/_components`에 둔다.
- `[locale]`에는 `ko`와 `en`만 허용하고 layout에서 locale을 검증한다. 알 수 없는 값은 `notFound()`로 종료한다.
- 두 개 이상의 라우트나 locale에서 재사용하는 UI는 `src/components`에 둔다.
- CSS Module과 컴포넌트 전용 테스트는 컴포넌트와 같은 폴더에 둔다.
- `src/lib`에는 React 화면 컴포넌트를 두지 않는다.
- 범용 `data` 폴더를 없애고 파일의 책임에 따라 `content`, `config`, `lib/portfolio`로 이동한다.

## 콘텐츠와 도메인 데이터 경계

### 홈 콘텐츠

홈에서 사람이 직접 수정하는 짧은 문자열과 구조화 레코드는 `src/content/home/`에 두고 `index.ts`를 유일한 외부 진입점으로 사용한다. 전체 데이터를 단일 파일로 합치면 475줄을 넘어 오히려 탐색성이 떨어지므로 프로필, 경력, 자격·학력을 응집도 높은 세 파일로 나눈다.

이 파일은 다음 내용을 소유한다.

- 기본 프로필
- 역할별 프로필 preset
- 경력 표시 콘텐츠
- 학력
- 자격증

각 파일은 명시적인 홈 콘텐츠 타입에 `satisfies`로 맞추고, 한국어와 영어의 필수 필드가 구조적으로 일치하도록 테스트한다. URL query 해석, 프로젝트 선택, locale 경로 생성, 화면용 그룹핑은 포함하지 않는다.

### 프로젝트 콘텐츠

최근 합의한 프로젝트 통합 방향을 유지한다.

- `detail.{locale}.mdx` frontmatter는 홈 프로젝트 카드와 상세 hero가 공유하는 표시 metadata를 소유한다.
- MDX body는 프로젝트 사례 설명과 문서형 콘텐츠를 소유한다.
- 프로젝트별 `index.ts`와 별도 `detailContent/*.ts`는 다시 만들지 않는다.
- ID, slug, section, detail route, career 관계는 MDX가 아니라 TypeScript catalog가 소유한다.
- 허용된 skill 이름과 정렬 규칙은 도메인 registry가 소유하고 frontmatter를 검증한다.

### 설정과 파생 모델

- 사이트 URL과 외부 프로필 URL 같은 배포 설정은 `src/config/site.ts`가 소유한다.
- 프로젝트·경력 ID와 관계는 `src/lib/portfolio/catalog.ts`가 소유한다.
- `src/content/home/careers.ts`의 경력 콘텐츠는 `CareerId`로 키를 지정하지만 catalog가 홈 콘텐츠를 import하지는 않는다. `homePage.ts`만 두 소스를 조합해 순환 의존을 막는다.
- 정적 MDX import, 프로젝트 관계, locale별 MDX component 선택은 `catalog.ts`가 함께 소유한다. frontmatter SSOT와 프로젝트 관계를 한 레코드에서 검증할 수 있고, 별도 registry를 만들 때 생기는 이중 매핑을 피한다. Cloudflare Worker에서 request-time 파일 탐색이나 동적 파일 경로 import는 사용하지 않는다.
- `homePage.ts`는 홈 콘텐츠, catalog, skill registry, query/단축 URL override를 `HomePageData`로 조립하는 순수 경계를 제공한다.
- `metadata.ts`는 홈과 프로젝트의 canonical, language alternate, Open Graph, Twitter metadata를 생성한다.

## 렌더링 흐름

### 홈

```text
content/home/index.ts
  ├─ profile.ts
  ├─ careers.ts
  └─ credentials.ts
project MDX frontmatter
catalog + skill registry
        ↓
lib/portfolio/homePage.ts
        ↓
app/(portfolio)/[locale]/page.tsx
        ↓
components/portfolio/home/HomePage.tsx
```

홈 route와 application short URL은 동일한 홈 모델 조립 함수를 사용한다. short URL route만 D1에서 선택된 project ID와 preset을 읽고, 표시 콘텐츠 자체는 저장소의 TS와 MDX에서 가져온다.

### 프로젝트 상세

```text
catalog
        ↓
slug/locale로 frontmatter와 MDX component 선택
        ↓
page.tsx에서 metadata/notFound/최상위 JSX 조립
        ↓
ProjectDetailPage 안의 MDX article
```

`detailPath`가 없는 프로젝트는 상세 metadata나 MDX component를 공개하지 않는다. locale 파일, catalog 관계, detail route가 어긋나면 테스트에서 실패한다.

## locale 라우팅과 공개 URL 정책

App Router의 locale route는 `src/app/(portfolio)/[locale]` 한 벌로 통합한다. `[locale]`은 내부 route segment이며, 브라우저에 노출되는 canonical URL 정책은 바꾸지 않는다.

```text
공개 URL                     내부 App Router 경로
/                            /ko
/projects/aira               /ko/projects/aira
/privacy                     /ko/privacy
/{applicationSlug}           /ko/{applicationSlug}
/en                          /en
/en/projects/aira            /en/projects/aira
/en/privacy                  /en/privacy
/en/{applicationSlug}        /en/{applicationSlug}
```

`src/proxy.ts`는 다음 순서로 처리한다.

1. `resume.junwon.dev/`의 `/resume` rewrite를 현재와 같이 가장 먼저 처리한다.
2. 외부 `/ko`와 `/ko/**` 요청은 prefix 없는 한국어 canonical URL로 redirect한다.
3. `/en`과 `/en/**`는 rewrite하지 않고 그대로 `[locale] = en` route로 전달한다.
4. prefix 없는 공개 포트폴리오 경로만 내부 `/ko${pathname}`로 rewrite하고 request header의 `x-locale`은 `ko`로 유지한다.
5. 보안, cache, robots header는 내부 rewrite 경로가 아니라 최초 공개 pathname의 정책을 기준으로 계산한다.

한국어 내부 rewrite 대상에서 다음 경로를 명시적으로 제외한다.

- `/_next`, `/favicon.ico`와 정적 파일 요청
- `/api`, `/a`, `/admin`, `/print`, `/resume`
- `/fonts`, `/images`, `/certificates`

optional catch-all route로 locale prefix 유무를 동시에 표현하지 않는다. 이 프로젝트의 `/{applicationSlug}` 단축 URL과 locale 판별이 충돌하고 route 의도가 불명확해지기 때문이다. `next.config.ts`의 Pages Router용 `i18n` 설정도 사용하지 않는다.

locale-aware link, canonical, `hreflang` 생성은 계속 공개 URL을 사용한다. 한국어는 prefix가 없고 영어만 `/en` prefix를 가진다. 내부 `/ko` 경로는 metadata, analytics pathname, 사용자에게 보이는 링크에 노출하지 않는다.

## `layout.tsx`와 화면 컴포넌트의 소유권

Next.js의 `layout.tsx`는 단순한 시각 레이아웃 모음이 아니라 여러 페이지 사이에서 유지되고 navigation 때 다시 렌더링되지 않는 경계다. 다음 요소만 특별 파일인 layout에 둔다.

### `src/app/layout.tsx`

- `<html>`과 `<body>`
- 전역 CSS
- Wanted Sans 설정
- CSP nonce를 사용하는 theme 초기화
- 전역 metadata base

### `src/app/(portfolio)/[locale]/layout.tsx`

- `params.locale` 검증과 `Language` narrowing
- locale별 metadata 기본값
- 검증된 locale을 `PortfolioClientShell`에 전달

### `src/app/(portfolio)/_components/PortfolioClientShell.tsx`

- locale provider
- analytics와 Web Vitals
- skip link
- portfolio 공통 wrapper와 footer
- `usePathname()`에 따라 모드가 달라지는 main class와 모바일 bottom navigation의 작은 격리 영역

`PortfolioClientShell`은 `usePathname()`을 사용하는 명시적인 Client Component 경계이므로 `layout.tsx` 안에 인라인하지 않는다. Server layout은 async params 처리와 metadata export를 유지하고, Server Component인 `children`을 Client shell의 slot으로 전달한다. 이 경계는 파일을 줄이기 위한 대상이 아니라 서버와 브라우저 책임을 구분하는 장치다.

Proxy rewrite 환경에서는 서버가 인식한 내부 `/ko/**` 경로와 브라우저의 prefix 없는 경로가 다를 수 있다. pathname에 의존하는 class와 navigation만 작은 하위 영역으로 격리하고, 서버와 최초 client render에서는 동일한 안정 상태를 사용한 뒤 mount 후 `usePathname()` 값으로 갱신한다. 경로 차이로 전체 shell이 hydration mismatch를 일으키지 않도록 한다.

`(portfolio)` route group 밖의 admin을 검사하는 현재 `isAdminPage` 분기는 제거한다. admin layout은 `src/app/a/layout.tsx`가 독립적으로 소유한다.

root `src/app/layout.tsx`는 `<html lang>`과 CSP nonce를 위해 Proxy가 설정한 `x-locale`과 `x-nonce`를 계속 읽는다. `[locale]/layout.tsx`는 화면 locale을 `params.locale`에서 직접 받으므로 `getPortfolioLocale()` 호출을 중복하지 않는다. 두 값이 일치하는지는 Proxy 집중 테스트와 rendered HTML smoke test로 검증한다. 일치가 확인되면 `PortfolioClientShell`의 `document.documentElement.lang` 동기화 effect는 제거해 서버가 `<html lang>`의 단일 소유자가 되게 한다.

### 화면이 소유하는 요소

- 홈의 모바일 sticky header는 프로필 이름과 링크에 의존하므로 HomePage가 소유한다.
- 홈의 desktop section navigation은 실제로 존재하는 섹션과 역할별 프로젝트 선택에 의존하므로 HomePage가 소유한다.
- 프로젝트의 TOC는 렌더링된 MDX heading에 의존하므로 ProjectDetailPage가 소유한다.
- 프로젝트의 GitHub와 product link header는 frontmatter에 의존하므로 ProjectDetailPage가 소유한다.
- 공통 grid와 header/nav slot의 배치만 `PortfolioContentLayout` 컴포넌트가 공유한다. 이 컴포넌트는 특별 파일인 `layout.tsx`가 아니다.

## `page.tsx` 원칙

각 `page.tsx`는 다음 네 가지를 직접 보여준다.

1. `params` 또는 `searchParams` 해석
2. 화면 모델 loader 호출
3. `notFound()` 또는 redirect 판단
4. 최상위 페이지 컴포넌트 JSX

`portfolioRouteViews.tsx`처럼 JSX를 반환하는 `render*Route` 우회 계층은 제거한다. metadata와 순수 loader는 공유하되 JSX 조립은 route file에 남긴다.

홈 전체 JSX를 `page.tsx`에 붙이지는 않는다. `HomePage`는 일반 홈과 application short URL에서 재사용된다. `ProjectDetailPage`도 모든 locale이 공유하며 별도 스타일과 테스트 경계를 가진다. 이처럼 실제 재사용이나 Server/Client 경계가 있는 경우에는 컴포넌트 분리를 유지한다.

locale별로 중복된 짧은 route adapter는 유지하지 않는다. `src/app/(portfolio)/[locale]` 아래 역할별 `page.tsx` 한 벌에서 `params.locale`을 받아 처리한다. 단, 홈·프로젝트 상세·application short URL처럼 서로 다른 route 역할까지 하나의 catch-all `page.tsx`로 합치지는 않는다.

## Server Component와 Client Component 경계

- `HomePage`와 `ProjectDetailPage`는 Server Component로 유지한다.
- `[locale]/layout.tsx`와 각 `page.tsx`는 Server Component로 유지한다.
- `PortfolioClientShell`만 pathname 기반 route mode가 필요한 Client Component로 유지한다.
- `HomePageClient`는 제거하고 홈 section JSX를 `HomePage`로 합친다.
- `DesktopSideNav`, `WorkAccordion`, `BottomNav`, lightbox처럼 브라우저 API나 상태가 필요한 단위만 Client Component로 남긴다.
- Server Component가 만든 `ReactNode`를 넓은 Client Component wrapper로 전달하는 패턴을 줄인다.
- `next/*` import를 `vinext/*`로 바꾸지 않는다.

## 2단계 전체 `src` 감사

공개 포트폴리오 구조가 모든 검증을 통과한 뒤 다음을 별도 변경 그룹으로 수행한다.

- admin route에서만 쓰는 컴포넌트를 `src/app/a/_components`로 이동한다.
- 공용 form primitive만 `src/components/ui`에 남긴다.
- analytics, asset, application-link, admin access 서버 코드를 각 도메인별 하위 폴더로 묶는다.
- `src/lib/types`의 범용 타입을 실제 소유 모듈로 옮긴다.
- 더 이상 사용되지 않는 barrel export와 compatibility shim을 제거한다.
- 과거 SvelteKit, Pages, OpenNext 산출물과 설정 참조가 남아 있는지 검색한다.
- vinext가 무시하는 `runtime`과 `preferredRegion` route segment 설정은 제거한다. 현재 OG/Twitter route handlers의 `runtime = 'edge'`도 대상이며, 제거 후 `next/og` route를 build와 HTTP smoke로 검증한다.
- route convention, MDX 정적 import, 문자열 기반 asset 참조를 확인하지 않고 파일을 삭제하지 않는다.
- analytics와 application short URL의 저장·조회 동작은 구조 이동 과정에서 변경하지 않는다.

## 오류 처리와 안전 조건

- 알 수 없는 locale, project slug, detail route는 기존과 동일하게 404 처리한다.
- 외부 `/ko` 경로는 prefix 없는 한국어 canonical URL로 redirect하고, 내부 rewrite로 생성된 `/ko` route는 사용자 URL과 metadata에 노출하지 않는다.
- Proxy rewrite 전에 resume host와 비포트폴리오 경로 제외 규칙을 적용해 `/resume`, `/api`, `/a`, 정적 asset 동작을 보존한다.
- application short URL의 D1 binding이나 레코드가 없으면 기존과 동일하게 404 처리한다.
- 콘텐츠 schema 오류, 중복 ID/slug/detailPath, 잘못된 career 관계, 등록되지 않은 skill은 테스트 또는 build 단계에서 실패시킨다.
- DB와 Cloudflare binding은 module scope에서 query를 실행하지 않고 현재의 lazy access 경계를 유지한다.
- 기존 미커밋 변경을 기준 상태로 취급하고 관련 없는 사용자 변경을 되돌리거나 포맷하지 않는다.
- 공개 구조 정리와 전체 `src` 감사는 서로 다른 논리적 commit 그룹으로 유지한다.

## 검증과 수용 기준

### 자동 검증

각 작업 그룹에서 관련 집중 테스트를 먼저 실패시키고 구현 후 통과시킨다. 단계 종료 시 다음 명령이 모두 성공해야 한다.

```bash
pnpm lint
pnpm exec tsc --noEmit --pretty false
pnpm exec vitest run
pnpm exec vinext check
pnpm build
pnpm exec wrangler deploy --dry-run
```

`vinext check`는 현재 기준인 `100% compatible`과 `0 issues`를 유지해야 한다. Wrangler log 경로의 환경 경고는 exit code와 실제 build 산출물을 기준으로 구분한다.

### 콘텐츠와 라우트 검증

- `/`와 `/en`에서 locale별 홈 콘텐츠가 렌더링된다.
- `/`와 prefix 없는 한국어 portfolio 경로는 내부 `[locale] = ko` route로 rewrite되지만 브라우저 주소와 canonical에는 `/ko`가 나타나지 않는다.
- `/ko`, `/ko/projects/aira`, `/ko/privacy`는 각각 `/`, `/projects/aira`, `/privacy`로 redirect된다.
- `/?role=webFrontend`와 역할별 preset에서 올바른 소개와 프로젝트가 선택된다.
- `/projects/aira`와 `/en/projects/aira`에서 frontmatter와 MDX body가 함께 렌더링된다.
- 상세 route가 없는 프로젝트는 기존 정책대로 404를 반환한다.
- 홈 카드와 상세 hero의 title, description, metrics, tech stack이 같은 locale frontmatter에서 파생된다.
- `/privacy`, `/en/privacy`, `/a`, analytics route, asset route가 구조 이동 전과 같은 상태 코드와 핵심 동작을 유지한다.
- `/api`, `/a`, `/resume`, `/fonts`, `/images`, `/certificates`가 한국어 내부 rewrite 대상에서 제외된다.
- `resume.junwon.dev/`가 계속 `/resume`을 제공하고 portfolio root로 rewrite되지 않는다.
- `src/proxy.test.ts`에서 redirect, rewrite, 제외 경로, 원래 pathname 기준 cache/robots header 정책을 검증한다.
- `[locale]` layout과 route 테스트에서 `ko`, `en`만 허용하고 다른 locale은 404가 되는지 검증한다.

### 브라우저 검증

- 데스크톱과 모바일에서 홈·상세의 header, side navigation, bottom navigation, TOC를 확인한다.
- 키보드 탐색, skip link, focus 상태, locale 경로 전환을 확인한다.
- `/`, `/en`, 한국어·영어 상세 페이지의 `<html lang>`, canonical, `hreflang`과 analytics pathname을 확인한다.
- rewrite와 `usePathname()`이 함께 쓰이는 `PortfolioClientShell`에서 hydration warning이 없는지 브라우저 console과 rendered HTML로 확인하고, mount 전 안정 상태에서 mount 후 route mode로 전환될 때 nav 영역의 눈에 띄는 layout shift가 없는지 확인한다.
- 홈 초기 렌더에 불필요한 Client Component가 다시 포함되지 않았는지 build manifest와 rendered HTML을 확인한다.
- UI 변경이 발생한 viewport는 데스크톱과 모바일 스크린샷으로 비교한다.

## 범위 밖

- vinext에서 다른 adapter로 재마이그레이션하지 않는다.
- 공개 URL의 한국어 기본 경로와 `/en` 경로 구조를 바꾸지 않는다. `/ko`는 내부 App Router 경로로만 사용한다.
- D1 analytics schema와 application short URL schema를 재설계하지 않는다.
- 디자인 시스템이나 시각 스타일을 전면 재설계하지 않는다.
- project detail의 MDX 문구 자체를 일괄 수정하지 않는다.
- 새로운 콘텐츠 관리 시스템이나 파일 자동 탐색 code generation을 도입하지 않는다.

## 공식 기준

- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Next.js Layouts and Pages](https://nextjs.org/docs/app/getting-started/layouts-and-pages)
- [Next.js Internationalization](https://nextjs.org/docs/app/guides/internationalization)
- [Next.js Proxy](https://nextjs.org/docs/app/getting-started/proxy)
- [Next.js `usePathname`](https://nextjs.org/docs/app/api-reference/functions/use-pathname)
- [Next.js Font Optimization](https://nextjs.org/docs/app/getting-started/fonts)
- [Cloudflare vinext](https://github.com/cloudflare/vinext)
