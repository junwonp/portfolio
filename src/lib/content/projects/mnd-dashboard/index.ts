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
        '**[React Migration Support]** Participated in moving a closed-network resource status and statistics system toward a **React**-based dashboard structure.',
        '**[Dashboard UI Experience]** Worked on resource status tables, aggregate statistics, filter panels, and drill-down views while learning how operational dashboards organize dense internal data.',
        '**[State Management Foundation]** Used **Redux** and **Ant Design** in an early React project, gaining hands-on experience with shared state, loading states, and nested dashboard views.',
      ],
    },
    ko: {
      title: '국방 자원 모니터링 대시보드',
      description: '제한망 자원 현황·통계·드릴다운 대시보드',
      summaryDetails: [
        '**[React 전환 참여]** 제한망에서 동작하던 자원 현황·통계 시스템을 **React 기반 대시보드 구조로 전환하는 작업에 참여**했습니다.',
        '**[대시보드 UI 경험]** 자원 현황 테이블, 집계 통계, 필터 패널, 드릴다운 뷰를 다루며 운영용 대시보드가 복잡한 내부 데이터를 어떻게 정리하는지 경험했습니다.',
        '**[상태 관리 기초]** 초기 React 프로젝트로서 **Redux와 Ant Design**을 사용하며 공유 상태, 로딩 상태, 중첩 대시보드 화면을 다루는 기초 경험을 쌓았습니다.',
      ],
    },
  },
});
