import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

export const agenticWorkflowDetailContent: Record<Language, ProjectDetailBlock[]> = {
  en: [
    {
      id: 'agentic-workflow-en-01',
      type: 'markdown',
      markdown:
        '## Project overview\n\n**"Use AI for speed, keep engineering ownership explicit."**\n\nThis workflow is how I use AI tools to move faster on portfolio and product UI work while keeping product judgment, architecture, and final review under my control. It starts from the user-facing outcome and existing code, then constrains the agent with project rules, scoped context, check/lint/test gates, browser verification, and final diff review.\n\nThe result is not a tool showcase. It is a repeatable delivery loop for turning AI output into reviewed, tested, and rendered changes that can be defended in an engineering conversation.',
    },
    {
      id: 'agentic-workflow-en-02',
      type: 'techStack',
    },
    {
      id: 'agentic-workflow-en-03',
      type: 'markdown',
      markdown: '## Key work',
    },
    {
      id: 'agentic-workflow-en-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Scope',
          accent: true,
          title: 'Start from product intent before implementation',
          detail:
            'Each task begins with the intended user-facing result, the current code shape, and the smallest acceptable change. AI is used only after the work is scoped enough to review, test, and explain.',
        },
        {
          tag: 'Context',
          accent: true,
          title: 'Split global rules from project-specific directives',
          detail:
            'Shared directives live in `dotfiles`, while repo-specific rules stay in files such as `AGENTS.md`. This keeps repeated standards consistent without flooding each task with irrelevant context.',
        },
        {
          tag: 'Review',
          accent: true,
          title: 'Keep architecture and final diff review human-owned',
          detail:
            'AI can draft repetitive implementation, but product tradeoffs, data handling, security boundaries, and final diff review remain my responsibility. That boundary makes the workflow faster without hiding ownership.',
        },
        {
          tag: 'Evidence',
          title: 'Require checks, tests, browser rendering, and diff review',
          detail:
            'Changes are accepted only after static checks, focused tests, rendered-page inspection when relevant, and a final review of the actual diff. The output is judged by evidence, not by whether AI generated it quickly.',
        },
      ],
    },
    {
      id: 'agentic-workflow-en-05',
      type: 'markdown',
      markdown: '### Workflow & verification guardrails',
    },
    {
      id: 'agentic-workflow-en-06',
      type: 'mermaid',
      chart:
        'flowchart TD\n  A["1. Gather context<br/>Files · docs · browser"] --> B["2. Constrain scope<br/>Keep related diffs only"]\n  B --> C["3. Verify<br/>check · lint · test · browser"]\n  C --> D["4. Review & commit<br/>Diff review · split commits"]',
      eyebrow: 'Verification flow',
      title: 'Verified AI-assisted engineering workflow',
    },
    {
      id: 'agentic-workflow-en-07',
      type: 'markdown',
      markdown:
        '**Verification guardrails**\n\n| Step | Standard | If it fails |\n| --- | --- | --- |\n| Context gathering | Read relevant files and existing patterns first | Stop guessing and inspect the source |\n| Context budget | Split global and project skills so only necessary rules are loaded | Remove unrelated directives from the task context |\n| Scope control | Touch only files directly tied to the request | Split unrelated diffs before commit |\n| Static validation | Pass `pnpm check` and `pnpm lint` | Fix from logs, not blind retries |\n| Content validation | Keep localized detail, alt, caption, and links in sync | Block one-locale-only changes |\n| Browser validation | Verify the rendered local page | Rework from DOM/screenshot evidence |\n| Commit review | Separate logical diff groups | Split mixed concerns before commit |\n\n**Concrete examples**\n\n- **Portfolio positioning:** Reworked the home page so product growth and release ownership stay ahead of AI-tool messaging.\n- **Metric cleanup:** Kept metric cards focused on outcome, scale, and measurable improvement instead of years, technology names, or status labels.\n- **Browser-based UI verification:** Checked responsive metric layouts, project-detail table styling, and homepage visibility directly in the local browser before marking work complete.\n- **Evidence hygiene:** Avoided using screenshots as portfolio evidence unless they came from real product screens or reproducible local output.\n\n## Retrospective\n\n**The main value is not raw speed.** The useful part is breaking repetitive work into reviewable units and leaving behind evidence that each change is safe.\n\n**AI does not replace engineering judgment.** The workflow works only when context, scope, and verification are explicit. That is the part I can defend in a code review or interview.',
    },
  ],
  ko: [
    {
      id: 'agentic-workflow-ko-01',
      type: 'markdown',
      markdown:
        '## 프로젝트 소개\n\n**"AI는 속도를 위해 사용하고, 엔지니어링 오너십은 명시적으로 유지합니다."**\n\n이 워크플로우는 포트폴리오와 제품 UI 작업에서 속도를 높이되, 제품 판단과 아키텍처, 최종 리뷰는 직접 소유하기 위한 방식입니다. 사용자에게 보일 결과와 기존 코드 구조를 먼저 확인하고, 프로젝트 규칙, 제한된 컨텍스트, check/lint/test, 브라우저 검증, 최종 diff 리뷰로 AI 결과물을 통제합니다.\n\n특정 도구를 많이 쓴다는 소개가 아니라, AI가 만든 결과를 리뷰 가능하고 테스트 가능하며 실제 화면에서 확인된 변경으로 바꾸는 반복 가능한 출시 루프입니다.',
    },
    {
      id: 'agentic-workflow-ko-02',
      type: 'techStack',
    },
    {
      id: 'agentic-workflow-ko-03',
      type: 'markdown',
      markdown: '## 주요 작업',
    },
    {
      id: 'agentic-workflow-ko-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'Scope',
          accent: true,
          title: '구현 전에 제품 의도부터 고정',
          detail:
            '각 작업은 사용자에게 보일 결과, 현재 코드 구조, 허용 가능한 최소 변경 범위를 먼저 정리한 뒤 시작합니다. AI는 리뷰하고 테스트하고 설명할 수 있을 만큼 범위가 잡힌 작업에만 사용합니다.',
        },
        {
          tag: 'Context',
          accent: true,
          title: '전역 규칙과 프로젝트별 지침 분리',
          detail:
            '공통 지침은 `dotfiles`에 두고, 레포별 규칙은 `AGENTS.md` 같은 프로젝트 파일에 둡니다. 반복 기준은 일관되게 유지하되, 각 작업에 불필요한 컨텍스트가 과하게 들어가지 않도록 관리합니다.',
        },
        {
          tag: 'Review',
          accent: true,
          title: '아키텍처와 최종 diff 리뷰는 직접 소유',
          detail:
            'AI는 반복 구현을 초안으로 만들 수 있지만, 제품 트레이드오프, 데이터 처리, 보안 경계, 최종 diff 리뷰는 직접 책임집니다. 이 경계를 통해 속도는 얻되 오너십은 흐려지지 않게 했습니다.',
        },
        {
          tag: 'Evidence',
          title: '검사, 테스트, 브라우저 렌더링, diff 리뷰를 필수화',
          detail:
            '정적 검사, 집중 테스트, 필요한 경우 실제 렌더링 확인, 최종 diff 리뷰를 통과한 변경만 받아들입니다. 빠르게 생성됐는지가 아니라 어떤 근거로 안전한지가 기준입니다.',
        },
      ],
    },
    {
      id: 'agentic-workflow-ko-05',
      type: 'markdown',
      markdown: '### 워크플로우와 검증 가드레일',
    },
    {
      id: 'agentic-workflow-ko-06',
      type: 'mermaid',
      chart:
        'flowchart TD\n  A["1. 컨텍스트 수집<br/>파일 · 문서 · 브라우저"] --> B["2. 변경 범위 제한<br/>관련 diff만 유지"]\n  B --> C["3. 검증<br/>check · lint · test · browser"]\n  C --> D["4. 리뷰와 커밋<br/>diff 검토 · 단위 분리"]',
      eyebrow: '검증 흐름',
      title: '검증 기반 AI 엔지니어링 워크플로우',
    },
    {
      id: 'agentic-workflow-ko-07',
      type: 'markdown',
      markdown:
        '**검증 가드레일**\n\n| 단계 | 기준 | 실패 시 처리 |\n| --- | --- | --- |\n| 컨텍스트 확인 | 관련 파일과 기존 패턴을 먼저 읽음 | 추측 구현 금지, 파일 재확인 |\n| 컨텍스트 예산 | 전역/프로젝트 스킬을 분리해 필요한 지침만 로드 | 불필요한 규칙은 작업 컨텍스트에서 제외 |\n| 구현 범위 | 요청과 직접 연결된 파일만 수정 | unrelated diff 분리 |\n| 정적 검증 | `pnpm check`, `pnpm lint` 통과 | 실패 로그 기반으로 수정 |\n| 콘텐츠 검증 | 언어별 detail, alt, caption, 링크 동기화 | 한쪽 언어만 바뀐 변경 차단 |\n| 브라우저 검증 | 로컬 페이지에서 실제 렌더링 확인 | DOM/스크린샷 기준으로 재수정 |\n| 커밋 검토 | diff를 논리 단위로 분리 | 섞인 변경은 커밋 전 분리 |\n\n**실제 적용 예시**\n\n- **포트폴리오 포지셔닝:** 홈 화면에서 AI 도구 메시지보다 제품 성장과 출시 오너십이 먼저 보이도록 재정렬했습니다.\n- **메트릭 정리:** 연도, 기술명, 상태 라벨처럼 성과 지표가 아닌 값은 카드에서 제거하고, 실제 수치·규모·개선율만 남겼습니다.\n- **브라우저 기반 UI 검증:** 메트릭 카드의 반응형 배치, 상세 페이지 table UI, 홈 화면 노출 여부를 로컬 브라우저에서 직접 확인한 뒤 완료 처리했습니다.\n- **이미지 증거 관리:** 실제 제품 화면이나 재현 가능한 로컬 결과물이 아닌 이미지는 포트폴리오 근거로 사용하지 않는 기준을 세웠습니다.\n\n## 회고\n\n**핵심 가치는 단순한 속도가 아닙니다.** 반복 작업을 리뷰 가능한 단위로 나누고, 각 변경이 안전하다는 근거를 남기는 것이 더 중요했습니다.\n\n**AI는 엔지니어링 판단을 대체하지 않습니다.** 컨텍스트, 범위, 검증을 명시적으로 관리할 때만 이 흐름이 제대로 작동합니다. 이 부분이 코드 리뷰나 면접에서 설명 가능한 강점입니다.',
    },
  ],
};
