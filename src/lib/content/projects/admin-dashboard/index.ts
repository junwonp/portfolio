import { SKILL } from '$lib/data/skills';

import { defineProject } from '../types';

export const adminDashboardProject = defineProject({
  id: 'admin_dashboard',
  slug: 'admin-dashboard',
  section: 'work',
  parentId: 'vault_micro',
  dateFrom: '2022-03',
  dateTo: '2023-06',
  paradigm: 'assisted',
  featuredSkills: [
    SKILL.languages.typescript,
    SKILL.frameworks.react,
    SKILL.ui.reactTable,
    SKILL.ui.chartJs,
    SKILL.state.tanstackQuery,
    SKILL.ui.mui,
  ],
  skills: [
    SKILL.languages.typescript,
    SKILL.frameworks.react,
    SKILL.ui.styledComponents,
    SKILL.ui.mui,
    SKILL.ui.atomicDesign,
    SKILL.ui.reactTable,
    SKILL.ui.chartJs,
    SKILL.state.tanstackQuery,
    SKILL.devops.firebaseHosting,
    SKILL.devops.githubActions,
    SKILL.aiWorkflow.githubCopilot,
  ],
  content: {
    en: {
      title: 'B2B Admin Dashboard',
      description: 'Integrated Management System for SaaS',
      summaryDetails: [
        '**[Efficiency]** Developed reusable CRUD components using **MUI**, significantly reducing the time required to build new management pages.',
        '**[Data Visualization]** Implemented real-time usage and revenue monitoring dashboards using **Chart.js**.',
      ],
    },
    ko: {
      title: 'B2B 통합 관리자 대시보드',
      description: 'SaaS 관리를 위한 통합 관리 시스템',
      summaryDetails: [
        '**[개발 효율성]** **MUI를 기반으로 재사용 가능한 CRUD 컴포넌트**들을 개발하여, 새로운 관리 페이지 구축에 필요한 공수를 크게 줄였습니다.',
        '**[데이터 시각화]** **Chart.js를 활용하여 이용량 및 매출 지표를 실시간으로 모니터링**할 수 있는 대시보드를 구현했습니다.',
      ],
    },
  },
});
