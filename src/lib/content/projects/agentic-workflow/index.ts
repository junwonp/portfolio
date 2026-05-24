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
        'A verified AI-assisted engineering workflow built around dotfiles, AGENTS.md directives, MCP context, code review, tests, and browser validation.',
      summaryDetails: [],
      detailMetadata: {
        title: 'AI-assisted Engineering Workflow',
        description:
          'A verified AI-assisted engineering workflow built around dotfiles, AGENTS.md directives, MCP context, code review, tests, and browser validation.',
        date: '2026-04-22',
        role: 'Workflow Design & Verification',
        techStack: ['Claude Code', 'MCP', 'dotfiles', 'AGENTS.md'],
      },
    },
    ko: {
      title: '검증 기반 AI 엔지니어링 워크플로우',
      description:
        'dotfiles, AGENTS.md 지침, MCP 컨텍스트, 코드 리뷰, 테스트, 브라우저 검증을 묶은 AI 보조 엔지니어링 워크플로우.',
      summaryDetails: [],
      detailMetadata: {
        title: '검증 기반 AI 엔지니어링 워크플로우',
        description:
          'dotfiles, AGENTS.md 지침, MCP 컨텍스트, 코드 리뷰, 테스트, 브라우저 검증을 묶은 AI 보조 엔지니어링 워크플로우.',
        date: '2026-04-22',
        role: 'Workflow Design & Verification',
        techStack: ['Claude Code', 'MCP', 'dotfiles', 'AGENTS.md'],
      },
    },
  },
});
