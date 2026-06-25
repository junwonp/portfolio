import { SKILL } from '@/lib/data/skills';

import { defineProject } from '../types';

export const mndDashboardProject = defineProject({
  id: 'mnd_dashboard',
  slug: 'mnd-dashboard',
  section: 'work',
  parentId: 'mnd',
  dateFrom: '2019-06',
  dateTo: '2019-09',
  featuredSkills: [
    SKILL.languages.javascript,
    SKILL.frameworks.react,
    SKILL.ui.antDesign,
    SKILL.state.redux,
  ],
  skills: [
    SKILL.languages.javascript,
    SKILL.frameworks.react,
    SKILL.ui.antDesign,
    SKILL.state.redux,
  ],
  content: {
    en: {
      title: 'Defense Resource Dashboard',
      description: 'Closed-network dashboard for resource status, statistics, and drill-down views',
      summaryDetails: [
        '**[Legacy Modernization]** Migrated a closed-network resource status and statistics system to **React**, replacing brittle page flows with clearer dashboard sections and drill-down navigation.',
        '**[Dashboard Behavior]** Structured the UI around resource status tables, aggregate statistics, filter panels, and nested detail views so operators could move from overview to specific records without losing context.',
        '**[Complex State Management]** Managed selected resource groups, filters, loading states, and nested view state with **Redux**, keeping dashboard panels consistent across route and tab transitions.',
      ],
    },
    ko: {
      title: '국방 자원 모니터링 대시보드',
      description: '제한망 자원 현황·통계·드릴다운 대시보드',
      summaryDetails: [
        '**[레거시 현대화]** 제한망에서 동작하던 자원 현황·통계 시스템을 **React 기반으로 마이그레이션**하고, 불안정한 페이지 흐름을 명확한 대시보드 섹션과 드릴다운 내비게이션으로 재구성했습니다.',
        '**[대시보드 동작]** 자원 현황 테이블, 집계 통계, 필터 패널, 중첩 상세 뷰를 기준으로 UI를 정리해 개요에서 특정 항목까지 맥락을 잃지 않고 이동할 수 있게 했습니다.',
        '**[복잡한 상태 관리]** **Redux로 선택된 자원 그룹, 필터, 로딩 상태, 중첩 뷰 상태를 관리**하여 라우트·탭 전환 중에도 대시보드 패널 간 데이터 일관성을 유지했습니다.',
      ],
    },
  },
});
