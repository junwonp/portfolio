import { SKILL } from '$lib/data/skills';

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
    SKILL.ui.styledComponents,
    SKILL.ui.antDesign,
    SKILL.state.redux,
  ],
  content: {
    en: {
      title: 'Defense Resource Dashboard',
      description: 'Resource Monitoring & Statistics System',
      summaryDetails: [
        '**[Legacy Modernization]** Successfully migrated a legacy statistics system to **React**, improving system reliability and user navigation speed.',
        '**[Complex State Management]** Managed multi-layered resource data using **Redux**, ensuring consistent state across nested dashboard views.',
      ],
    },
    ko: {
      title: '국방 자원 모니터링 대시보드',
      description: '자원 현황 관리 및 통계 시스템',
      summaryDetails: [
        '**[레거시 현대화]** 기존의 노후화된 통계 시스템을 **React 기반으로 성공적으로 마이그레이션**하여 시스템 안정성과 유저 내비게이션 속도를 개선했습니다.',
        '**[복잡한 상태 관리]** **Redux를 사용하여 다층적인 자원 데이터를 체계적으로 관리**하고, 복잡한 대시보드 뷰 간의 데이터 일관성을 유지했습니다.',
      ],
    },
  },
});
