import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

export const mndExcelViewerDetailContent: Record<Language, ProjectDetailBlock[]> = {
  en: [
    {
      id: 'mnd-excel-viewer-en-01',
      type: 'markdown',
      markdown:
        '## Project overview\n\n**"Thousands of rows without jank — spreadsheet-like grids and line-based text in the browser"**\n\nI built a **spreadsheet-style grid** on `react-table` plus a **line-based text viewer** in one package, with drag **2D range selection**, multiple regions, and virtualization. Containers own interaction while base components focus on rendering, keeping testing and extension straightforward.\n\n> For security and confidentiality I cannot share the work context or original repository; this page covers implementation only. Code snippets are reconstructed excerpts.\n\n**Public scale summary:** the viewer covered two document modes — an Excel-like grid and a line-based text reader. Without exposing original data, I validated virtual scrolling, selection anchors, and heavy-document rendering with **reconstructed fixtures of 1,000+ rows**. The main interaction model combined rectangular cell selection, reverse text-range normalization, multi-region highlights, and Socket.IO-based shared annotations.',
    },
    {
      id: 'mnd-excel-viewer-en-diagram',
      type: 'mermaid',
      eyebrow: 'System flow',
      title: 'Restricted document viewer flow',
      chart:
        'flowchart TD\n  1["1. Restricted intranet\\nNo public services or production data in local development"] --> 2["2. Mock socket layer\\nSame event contract as Socket.IO for offline UI validation"]\n  2 --> 3["3. Viewer containers\\nOwn state, range selection, popovers, and collaboration events"]\n  3 --> 4["4. Virtualized renderers\\nGrid rows via react-window; variable text lines via react-virtualized"]',
    },
    {
      id: 'mnd-excel-viewer-en-02',
      type: 'techStack',
    },
    {
      id: 'mnd-excel-viewer-en-03',
      type: 'markdown',
      markdown: '## Key work',
    },
    {
      id: 'mnd-excel-viewer-en-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Architecture',
          accent: true,
          title: 'Presentation / container split',
          detail:
            '`ExcelViewer` / `TextViewer` handle **state, mouse events, and popovers**; `ExcelViewerBase` / `TextViewerBase` focus on **table rendering and virtualization**. That makes Storybook and unit tests much easier for the rendering layer — the base components are pure functions of their props, with no event handling logic to mock out.',
        },
        {
          tag: 'Algorithm',
          accent: true,
          title: 'Excel-style column labels (A → Z → AA) + 2D drag selection',
          detail:
            'A single `String.fromCharCode` pass cannot produce Excel-style base-26 column names. A quotient/remainder loop in `columnGenerator` correctly yields **A, B … Z, AA, AB …** for any column count.\n\nFor 2D selection, cells use `column:row` string IDs. While dragging, the selection stays a **rectangle via `min` / `max`**. Updates go through **Immer `produce`** to avoid accidental reference sharing. **Ctrl + drag** increments a slot index so users can stack multiple independent regions.',
        },
        {
          tag: 'Feature',
          title: 'Text viewer — line ranges and reverse drag',
          detail:
            'The text viewer operates on line numbers rather than cell IDs. On mouse up, **inverted start/end values are normalized** so the range model is consistent regardless of which direction the user drags. This prevents off-by-one errors in highlight rendering and keeps copy-paste selection predictable.',
        },
        {
          tag: 'Performance',
          title: 'Per-view virtualization strategies',
          detail:
            'Two different virtualization strategies are used — one per view type:\n- **Grid:** `react-window` (`VariableSizeList` + `InfiniteLoader` + `AutoSizer`) for row virtualization and incremental data loading as the user scrolls.\n- **Text:** `react-virtualized` `CellMeasurerCache` to measure and cache individual line heights, so variable-height lines stay aligned with selection anchors and scroll position.\nThe key insight: no single virtualization library fits both use cases well. Choosing the right tool per view prevents layout-thrashing and keeps scroll performance smooth.',
        },
        {
          tag: 'Constraint',
          accent: true,
          title: 'Restricted-network development and validation strategy',
          detail:
            'Because the project ran in a restricted network, local development could not depend on production data, external APIs, or public SaaS tooling. I separated **reconstructed fixtures** and a **mock socket layer** so UI state transitions and collaboration events could be verified offline. That kept confidential information out of the workflow while preserving repeatable checks for large documents, highlight sync, and error isolation.',
        },
        {
          tag: 'DX',
          title: 'Socket.IO wire contracts + createMockSocket',
          detail:
            "Payloads like `socket.emit('removeHighlight', &#123; fileId, highlightId &#125;)` **pin the wire shape** between client and server. A `createMockSocket` helper implements the same interface and lets UI and integration tests run without a live backend. TypeScript types on the payload ensure the contract is enforced at compile time.",
        },
        {
          tag: 'UI',
          title: 'Selection overlay, sticky headers, and ErrorBoundary',
          detail:
            "**styled-components** handles the selection and overlay layers, with explicit styles to neutralize browser-native `::selection` so it doesn't conflict with the custom selection highlight. Sticky column headers and scrollbar theming give the grid a tool-like feel. An **ErrorBoundary** wraps each viewer so a runtime failure in one view does not take down the rest of the application.",
        },
      ],
    },
    {
      id: 'mnd-excel-viewer-en-05',
      type: 'markdown',
      markdown:
        "## Retrospective\n\nThe biggest design decision was separating presentation from container early. It paid off immediately in testability — Storybook stories for the base components required zero mocking and caught visual regressions fast.\n\nThe per-view virtualization split was less obvious upfront. Starting with one library and hitting layout issues in the text viewer forced a deeper look at what each library actually optimizes, and led to a cleaner solution that matched each view's actual constraints.",
    },
  ],
  ko: [
    {
      id: 'mnd-excel-viewer-ko-01',
      type: 'markdown',
      markdown:
        '## 프로젝트 소개\n\n**"수천 행도 끊기지 않게, 엑셀에 가까운 그리드와 텍스트를 브라우저에서"**\n\n`react-table` 기반의 **스프레드시트형 그리드**와 **줄 단위 텍스트 뷰어**를 한 패키지로 구성하고, 드래그로 **2D 영역 선택**·다중 영역·가상 스크롤까지 묶었습니다. 컨테이너와 렌더링 베이스를 나누어 테스트와 확장에 유리하게 두었습니다.\n\n> 보안 및 비공개 정책상 업무 맥락과 원본 저장소는 공개할 수 없으며, 이 글은 구현 기술만 정리합니다. 코드 스니펫은 재구성한 발췌입니다.\n\n**공개 가능한 규모 요약:** 뷰어는 엑셀형 그리드와 줄 단위 텍스트 리더라는 두 가지 문서 모드를 다뤘습니다. 원본 데이터는 공개하지 않고, **1,000행 이상 재구성 Fixture**로 가상 스크롤, 선택 앵커, 대용량 렌더링 흐름을 검증했습니다. 핵심 상호작용은 직사각형 셀 선택, 역방향 텍스트 범위 정규화, 다중 하이라이트 영역, Socket.IO 기반 공유 주석 흐름으로 구성했습니다.',
    },
    {
      id: 'mnd-excel-viewer-ko-diagram',
      type: 'mermaid',
      eyebrow: '시스템 흐름',
      title: '제한망 문서 뷰어 흐름',
      chart:
        'flowchart TD\n  1["1. 제한망 인트라넷\\n로컬 개발에서 외부 서비스와 운영 데이터를 사용하지 않음"] --> 2["2. Mock 소켓 레이어\\nSocket.IO와 동일한 이벤트 계약으로 오프라인 UI 검증"]\n  2 --> 3["3. 뷰어 컨테이너\\n상태, 영역 선택, Popover, 협업 이벤트를 담당"]\n  3 --> 4["4. 가상화 렌더러\\n그리드는 react-window, 가변 텍스트 줄은 react-virtualized"]',
    },
    {
      id: 'mnd-excel-viewer-ko-02',
      type: 'techStack',
    },
    {
      id: 'mnd-excel-viewer-ko-03',
      type: 'markdown',
      markdown: '## 주요 작업',
    },
    {
      id: 'mnd-excel-viewer-ko-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Architecture',
          accent: true,
          title: '프레젠테이션·컨테이너 분리',
          detail:
            '`ExcelViewer`·`TextViewer`는 **상태, 마우스 이벤트, Popover**를 담당하고, `ExcelViewerBase`·`TextViewerBase`는 **표·가상 스크롤 렌더링**에 집중합니다. 베이스 컴포넌트는 props의 순수 함수이므로 스토리북·단위 테스트에서 별도의 모킹 없이 렌더링 레이어만 독립적으로 검증할 수 있습니다.',
        },
        {
          tag: 'Algorithm',
          accent: true,
          title: '엑셀식 열 라벨 (A → Z → AA) + 2D 드래그 선택',
          detail:
            '단일 `String.fromCharCode`로는 26진법 엑셀 열 이름을 만들 수 없습니다. `columnGenerator`의 나머지·몫 루프가 열 수에 관계없이 **A, B … Z, AA, AB …**를 정확하게 생성합니다.\n\n2D 선택의 경우 셀은 `column:row` 형태의 ID를 사용하며, 드래그 중 **`min` / `max`로 직사각형**을 유지합니다. 선택 상태는 **Immer `produce`**로 불변 갱신하여 참조 공유 실수를 방지합니다. **Ctrl + 드래그**로 슬롯 인덱스를 늘려 독립적인 다중 영역을 쌓을 수 있습니다.',
        },
        {
          tag: 'Feature',
          title: '텍스트 뷰어 — 줄 범위와 역방향 드래그',
          detail:
            '텍스트 뷰어는 셀 ID 대신 줄 번호 기준으로 동작합니다. 마우스 업 시 **start/end가 뒤집힌 경우를 정규화**하여, 드래그 방향에 상관없이 동일한 범위 모델을 유지합니다. 이를 통해 하이라이트 렌더링에서의 오프-바이-원 오류를 방지하고 복사·붙여넣기 선택을 예측 가능하게 만들었습니다.',
        },
        {
          tag: 'Performance',
          title: '뷰별 가상화 전략',
          detail:
            '뷰 유형에 따라 서로 다른 가상화 전략을 적용했습니다:\n- **그리드:** `react-window`의 `VariableSizeList` + `InfiniteLoader` + `AutoSizer`로 행 단위 가상 스크롤 및 스크롤 시 점진적 데이터 로딩.\n- **텍스트:** `react-virtualized`의 `CellMeasurerCache`로 개별 줄 높이를 측정·캐시하여, 가변 높이 줄에서도 선택 앵커와 스크롤 위치가 어긋나지 않게 했습니다.\n핵심은 하나의 가상화 라이브러리가 두 가지 사용 사례 모두에 적합하지 않다는 점입니다. 뷰별로 적합한 도구를 선택하여 레이아웃 스래싱을 방지하고 스크롤 성능을 유지했습니다.',
        },
        {
          tag: 'Constraint',
          accent: true,
          title: '제한망 개발 제약과 검증 전략',
          detail:
            '업무망 특성상 운영 데이터, 외부 API, 공개 SaaS 의존성을 로컬 개발 흐름에 둘 수 없었습니다. 그래서 **재구성 Fixture**와 **Mock Socket 레이어**를 분리해 UI 상태 전이와 협업 이벤트를 검증했습니다. 이 방식은 비공개 정보를 보호하면서도 대용량 문서, 하이라이트 동기화, 오류 격리 같은 핵심 동작을 반복 검증할 수 있게 했습니다.',
        },
        {
          tag: 'DX',
          title: 'Socket.IO 와이어 계약 + createMockSocket',
          detail:
            "`socket.emit('removeHighlight', &#123; fileId, highlightId &#125;)`와 같은 페이로드로 클라이언트·서버 간 **와이어 형태를 고정**했습니다. `createMockSocket`은 동일한 인터페이스를 구현하여 실서버 없이 UI·통합 검증이 가능합니다. 페이로드의 TypeScript 타입이 컴파일 타임에 계약을 강제합니다.",
        },
        {
          tag: 'UI',
          title: '선택 오버레이, 고정 헤더, ErrorBoundary',
          detail:
            '**styled-components**로 선택·오버레이 레이어를 구성하고, 커스텀 선택 하이라이트와 충돌하지 않도록 브라우저 기본 `::selection`을 명시적으로 무력화했습니다. 스티키 열 헤더와 스크롤바 스타일로 그리드 도구 느낌을 살렸습니다. **ErrorBoundary**로 뷰어 영역의 런타임 오류가 나머지 애플리케이션으로 전파되지 않게 격리했습니다.',
        },
      ],
    },
    {
      id: 'mnd-excel-viewer-ko-05',
      type: 'markdown',
      markdown:
        '## 회고\n\n초기에 프레젠테이션과 컨테이너를 분리한 것이 가장 큰 설계 결정이었습니다. 테스트 용이성에서 즉각 효과가 나타났습니다 — 베이스 컴포넌트의 스토리북 스토리는 모킹이 전혀 필요 없었고, 시각적 회귀를 빠르게 포착할 수 있었습니다.\n\n뷰별 가상화 분리는 처음에는 명확하지 않았습니다. 하나의 라이브러리로 시작했다가 텍스트 뷰어에서 레이아웃 문제를 겪으면서 각 라이브러리가 실제로 어떤 부분을 최적화하는지 더 깊이 파악하게 되었고, 각 뷰의 실제 제약 조건에 맞는 더 명확한 해결책을 찾을 수 있었습니다.',
    },
  ],
};
