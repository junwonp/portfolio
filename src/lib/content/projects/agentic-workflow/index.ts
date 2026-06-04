import { defineProject } from '../types';

export const agenticWorkflowProject = defineProject({
  id: 'agentic_workflow',
  slug: 'agentic-workflow',
  section: 'standalone',
  detailPath: '/projects/agentic-workflow',
  content: {
    en: {
      title: 'AI-assisted Engineering Workflow',
      description:
        'A verified AI-assisted engineering workflow built around scoped context, primary agent roles, MCP, code review, tests, and browser validation.',
      summaryDetails: [
        '**[Context Budgeting]** Split global agent rules from project-specific directives to avoid injecting unnecessary context into every task.',
        '**[Tooling Boundaries]** Used Claude Code and Codex for the main implementation path, with Antigravity and Cursor kept as supporting tools for reading, docs, and quick edits.',
        '**[Verification Gates]** Treated check, lint, tests, browser rendering, and diff review as required gates before accepting AI-assisted changes.',
      ],
      detailMetadata: {
        title: 'AI-assisted Engineering Workflow',
        description:
          'A verified AI-assisted engineering workflow built around scoped context, primary agent roles, MCP, code review, tests, and browser validation.',
        date: '2026-04-22',
        role: 'Workflow Design & Verification',
        techStack: ['Claude Code', 'Codex'],
      },
    },
    ko: {
      title: '검증 기반 AI 엔지니어링 워크플로우',
      description:
        '범위가 제한된 컨텍스트, 주요 에이전트 역할 분리, MCP, 코드 리뷰, 테스트, 브라우저 검증을 묶은 AI 보조 엔지니어링 워크플로우.',
      summaryDetails: [
        '**[컨텍스트 예산 설계]** 전역 에이전트 규칙과 프로젝트별 지침을 분리해 모든 작업에 불필요한 컨텍스트가 주입되지 않도록 했습니다.',
        '**[도구 경계 설정]** Claude Code와 Codex를 주력 구현 경로로 두고, Antigravity와 Cursor는 읽기·문서·빠른 수정에만 보조적으로 사용했습니다.',
        '**[검증 게이트]** check, lint, 테스트, 브라우저 렌더링, diff 리뷰를 AI 보조 변경의 필수 통과 기준으로 두었습니다.',
      ],
      detailMetadata: {
        title: '검증 기반 AI 엔지니어링 워크플로우',
        description:
          '범위가 제한된 컨텍스트, 주요 에이전트 역할 분리, MCP, 코드 리뷰, 테스트, 브라우저 검증을 묶은 AI 보조 엔지니어링 워크플로우.',
        date: '2026-04-22',
        role: 'Workflow Design & Verification',
        techStack: ['Claude Code', 'Codex'],
      },
    },
  },
});
