import { SKILL } from '@/lib/data/skills';

import { defineProject } from '../types';

const adminDashboardFeaturedSkills = [
  SKILL.languages.typescript,
  SKILL.frameworks.react,
  SKILL.ui.reactTable,
  SKILL.ui.chartJs,
  SKILL.state.tanstackQuery,
  SKILL.ui.mui,
];

const adminDashboardSkills = [
  SKILL.languages.typescript,
  SKILL.frameworks.react,
  SKILL.ui.styledComponents,
  SKILL.ui.mui,
  SKILL.ui.reactTable,
  SKILL.ui.chartJs,
  SKILL.state.tanstackQuery,
];

export const adminDashboardProject = defineProject({
  id: 'admin_dashboard',
  slug: 'admin-dashboard',
  section: 'work',
  parentId: 'vault_micro',
  detailPath: '/projects/admin-dashboard',
  dateFrom: '2022-03',
  dateTo: '2023-06',
  paradigm: 'assisted',
  featuredSkills: adminDashboardFeaturedSkills,
  skills: adminDashboardSkills,
  content: {
    en: {
      title: 'B2B Admin Dashboard',
      description:
        'SaaS admin system for accounts, subscriptions, product usage, and revenue monitoring',
      detailMetadata: {
        title: 'B2B Admin Dashboard',
        description:
          'Internal SaaS operations dashboard for accounts, subscriptions, product usage, and revenue monitoring.',
        date: '2022.03 ~ 2023.06',
        role: 'Frontend Developer',
        status: 'Internal Operations',
        tagline:
          'Reusable CRUD, table, filter, chart, and detail-view patterns for SaaS back-office workflows.',
        platforms: ['Web', 'Internal Admin', 'B2B SaaS'],
        metrics: [
          { value: 'CRUD', label: 'Reusable Page Pattern' },
          { value: 'Chart.js', label: 'Operational Metrics' },
          { value: 'TanStack Query', label: 'Server State' },
        ],
        techStack: adminDashboardFeaturedSkills,
      },
      summaryDetails: [
        '**[Operational Scope]** Built admin surfaces for SaaS operations across accounts, subscriptions, product usage, and revenue monitoring.',
        '**[Reusable CRUD/Table System]** Combined **React Table**, **MUI**, and **TanStack Query** into reusable list, filter, detail, create, and edit patterns for management pages.',
        '**[Data Visualization]** Implemented real-time usage and revenue monitoring dashboards using **Chart.js**.',
      ],
    },
    ko: {
      title: 'B2B 통합 관리자 대시보드',
      description: '계정, 구독, 제품 사용량, 매출 모니터링을 위한 SaaS 통합 관리 시스템',
      detailMetadata: {
        title: 'B2B 통합 관리자 대시보드',
        description:
          '계정, 구독, 제품 사용량, 매출 모니터링을 위한 SaaS 내부 운영 관리자 시스템입니다.',
        date: '2022.03 ~ 2023.06',
        role: 'Frontend Developer',
        status: 'Internal Operations',
        tagline:
          'SaaS 백오피스 업무를 위한 CRUD, 테이블, 필터, 차트, 상세 화면 패턴을 재사용 가능한 형태로 구성했습니다.',
        platforms: ['Web', 'Internal Admin', 'B2B SaaS'],
        metrics: [
          { value: 'CRUD', label: '재사용 페이지 패턴' },
          { value: 'Chart.js', label: '운영 지표 시각화' },
          { value: 'TanStack Query', label: '서버 상태 관리' },
        ],
        techStack: adminDashboardFeaturedSkills,
      },
      summaryDetails: [
        '**[운영 범위]** 계정, 구독, 제품 사용량, 매출 모니터링을 다루는 SaaS 운영용 관리자 화면을 구축했습니다.',
        '**[재사용 CRUD/Table 시스템]** **React Table**, **MUI**, **TanStack Query**를 조합해 목록, 필터, 상세, 생성, 수정 패턴을 관리 페이지에 재사용 가능한 형태로 정리했습니다.',
        '**[데이터 시각화]** **Chart.js를 활용하여 이용량 및 매출 지표를 실시간으로 모니터링**할 수 있는 대시보드를 구현했습니다.',
      ],
    },
  },
});
