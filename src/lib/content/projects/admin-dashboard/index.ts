import { SKILL } from '@/lib/data/skills';

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
    SKILL.ui.reactTable,
    SKILL.ui.chartJs,
    SKILL.state.tanstackQuery,
  ],
  content: {
    en: {
      title: 'B2B Admin Dashboard',
      description:
        'SaaS admin system for accounts, subscriptions, product usage, and revenue monitoring',
      summaryDetails: [
        '**[Operational Scope]** Built admin surfaces for SaaS operations across accounts, subscriptions, product usage, and revenue monitoring.',
        '**[Reusable CRUD/Table System]** Combined **React Table**, **MUI**, and **TanStack Query** into reusable list, filter, detail, create, and edit patterns for management pages.',
        '**[Data Visualization]** Implemented real-time usage and revenue monitoring dashboards using **Chart.js**.',
      ],
    },
    ko: {
      title: 'B2B 통합 관리자 대시보드',
      description: '계정, 구독, 제품 사용량, 매출 모니터링을 위한 SaaS 통합 관리 시스템',
      summaryDetails: [
        '**[운영 범위]** 계정, 구독, 제품 사용량, 매출 모니터링을 다루는 SaaS 운영용 관리자 화면을 구축했습니다.',
        '**[재사용 CRUD/Table 시스템]** **React Table**, **MUI**, **TanStack Query**를 조합해 목록, 필터, 상세, 생성, 수정 패턴을 관리 페이지에 재사용 가능한 형태로 정리했습니다.',
        '**[데이터 시각화]** **Chart.js를 활용하여 이용량 및 매출 지표를 실시간으로 모니터링**할 수 있는 대시보드를 구현했습니다.',
      ],
    },
  },
});
