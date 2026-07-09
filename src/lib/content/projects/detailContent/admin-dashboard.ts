import type { ProjectDetailBlock } from '@/lib/content/editableContent';
import type { Language } from '@/lib/utils/language';

export const adminDashboardDetailContent: Record<Language, ProjectDetailBlock[]> = {
  en: [
    {
      id: 'admin-dashboard-en-01',
      type: 'markdown',
      markdown:
        '## Project overview\n\n**"Reusable back-office patterns for SaaS operations"**\n\nThis project was an internal B2B SaaS admin dashboard used to operate accounts, subscriptions, product usage, and revenue monitoring. Because it was an internal company system, screenshots and raw business data cannot be shared; this page focuses on the frontend architecture and reusable interaction patterns.\n\nThe important part was not a single screen. It was the repeated operational workflow: list data, filter and search it, inspect detail records, create or edit entities, and monitor usage/revenue signals without losing context. I worked on that surface with **TypeScript**, **React**, **React Table**, **MUI**, **TanStack Query**, and **Chart.js**.',
    },
    {
      id: 'admin-dashboard-en-02',
      type: 'techStack',
    },
    {
      id: 'admin-dashboard-en-03',
      type: 'markdown',
      markdown: '## Key work',
    },
    {
      id: 'admin-dashboard-en-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'CRUD',
          accent: true,
          title: 'Reusable list, filter, detail, create, and edit page pattern',
          detail:
            'Built admin pages around a repeated CRUD workflow instead of treating each management page as a one-off screen. List tables, filter panels, detail areas, and edit/create flows shared the same interaction model, which made new admin surfaces faster to add and easier for operators to learn.',
        },
        {
          tag: 'Table UX',
          title: 'Data-dense tables with React Table and MUI',
          detail:
            'Combined **React Table** with **MUI** components to support operational table behavior such as pagination, search, filter state, row-level actions, and stable column layouts. The goal was to make dense back-office data scannable without forcing operators through separate pages for every check.',
        },
        {
          tag: 'Server State',
          accent: true,
          title: 'TanStack Query-based server-state handling',
          detail:
            'Used **TanStack Query** for loading, refetching, mutation, and cache invalidation flows across account, subscription, and usage-management views. This kept page state predictable after create/edit actions and reduced duplicated request state inside UI components.',
        },
        {
          tag: 'Visualization',
          title: 'Operational usage and revenue monitoring with Chart.js',
          detail:
            'Implemented dashboard charts for usage and revenue signals with **Chart.js**, keeping chart data close to the same query layer used by the table views. The dashboards were designed as operational checks rather than decorative analytics.',
        },
      ],
    },
    {
      id: 'admin-dashboard-en-05',
      type: 'mermaid',
      eyebrow: 'Operational flow',
      title: 'Back-office workflow structure',
      chart:
        'flowchart LR\n  A[Operator] --> B[List and filter]\n  B --> C[Inspect detail]\n  C --> D[Create or edit]\n  D --> E[Invalidate and refetch]\n  E --> B\n  B --> F[Usage and revenue charts]\n  F --> C',
    },
    {
      id: 'admin-dashboard-en-06',
      type: 'markdown',
      markdown:
        '## Retrospective\n\nThis project is less of a public-facing case study and more about demonstrating the ability to build reliable, high-density internal tools. While internal surfaces like tables, filters, forms, and charts may be less flashy than consumer UIs, they demand strict state management, predictable interactions, and clear component boundaries.\n\nI learned that admin dashboards can quickly become expensive to maintain if every new page invents its own table, filter, or mutation logic. Treating these internal tools as a unified product surface with shared patterns was essential for keeping the codebase scalable and the user experience consistent.',
    },
  ],
  ko: [
    {
      id: 'admin-dashboard-ko-01',
      type: 'markdown',
      markdown:
        '## 프로젝트 소개\n\n**"SaaS 운영을 위한 재사용 가능한 백오피스 패턴"**\n\n계정, 구독, 제품 사용량, 매출 모니터링을 다루는 내부 B2B SaaS 관리자 대시보드 프로젝트입니다. 사내 운영 시스템이기 때문에 실제 화면과 원본 비즈니스 데이터는 공개할 수 없어, 이 페이지에서는 프론트엔드 구조와 재사용 가능한 운영 화면 패턴을 중심으로 정리했습니다.\n\n핵심은 특정 화면 하나가 아니라 반복되는 운영 흐름이었습니다. 데이터를 목록으로 확인하고, 검색/필터링하고, 상세 레코드를 확인하고, 생성/수정한 뒤, 사용량과 매출 신호를 같은 맥락에서 모니터링하는 흐름입니다. 이 영역을 **TypeScript**, **React**, **React Table**, **MUI**, **TanStack Query**, **Chart.js** 기반으로 구축했습니다.',
    },
    {
      id: 'admin-dashboard-ko-02',
      type: 'techStack',
    },
    {
      id: 'admin-dashboard-ko-03',
      type: 'markdown',
      markdown: '## 주요 작업',
    },
    {
      id: 'admin-dashboard-ko-04',
      type: 'achievements',
      achievements: [
        {
          tag: 'CRUD',
          accent: true,
          title: '목록, 필터, 상세, 생성, 수정으로 이어지는 재사용 페이지 패턴',
          detail:
            '각 관리자 페이지를 일회성 화면으로 만들지 않고 반복되는 CRUD 흐름을 기준으로 구성했습니다. 목록 테이블, 필터 패널, 상세 영역, 생성/수정 플로우가 같은 상호작용 모델을 공유하도록 만들어 신규 운영 화면을 더 빠르게 추가하고, 내부 사용자가 화면을 더 쉽게 익힐 수 있게 했습니다.',
        },
        {
          tag: 'Table UX',
          title: 'React Table과 MUI 기반의 데이터 밀도 높은 테이블 UX',
          detail:
            '**React Table**과 **MUI**를 조합해 페이지네이션, 검색, 필터 상태, 행 단위 액션, 안정적인 컬럼 레이아웃 등 운영 테이블에 필요한 동작을 구성했습니다. 운영자가 별도 페이지를 계속 오가지 않아도 많은 데이터를 빠르게 훑고 확인할 수 있게 만드는 것이 목표였습니다.',
        },
        {
          tag: 'Server State',
          accent: true,
          title: 'TanStack Query 기반 서버 상태 관리',
          detail:
            '계정, 구독, 사용량 관리 화면 전반에서 **TanStack Query**를 활용해 로딩, 재요청, mutation, 캐시 무효화 흐름을 정리했습니다. 생성/수정 이후에도 페이지 상태가 예측 가능하게 유지되도록 하고, UI 컴포넌트 내부에 요청 상태가 중복되는 문제를 줄였습니다.',
        },
        {
          tag: 'Visualization',
          title: 'Chart.js 기반 사용량 및 매출 운영 지표 시각화',
          detail:
            '**Chart.js**로 사용량과 매출 신호를 확인하는 대시보드 차트를 구현했습니다. 차트 데이터도 테이블 화면과 같은 query layer에 가깝게 유지하여, 장식적인 그래프가 아니라 운영자가 상태를 확인하는 도구로 동작하도록 구성했습니다.',
        },
      ],
    },
    {
      id: 'admin-dashboard-ko-05',
      type: 'mermaid',
      eyebrow: '운영 흐름',
      title: '백오피스 업무 구조',
      chart:
        'flowchart LR\n  A[운영자] --> B[목록 및 필터]\n  B --> C[상세 확인]\n  C --> D[생성 또는 수정]\n  D --> E[캐시 무효화 및 재조회]\n  E --> B\n  B --> F[사용량 및 매출 차트]\n  F --> C',
    },
    {
      id: 'admin-dashboard-ko-06',
      type: 'markdown',
      markdown:
        '## 회고\n\n이 프로젝트는 공개 사용자용 제품 사례라기보다, 회사 내부에서 자주 필요한 운영 도구를 안정적으로 구축할 수 있음을 보여주는 사례입니다. 복잡한 테이블, 필터, 폼, 차트 등 내부 시스템은 화려함보다 상태 관리의 예측 가능성과 유지보수 가능한 컴포넌트 경계가 더 중요하기 때문입니다.\n\n특히 페이지가 늘어남에 따라 각 화면이 독자적인 테이블과 필터, Mutation 흐름을 갖게 되면 유지보수 비용이 급격히 증가합니다. 이를 겪으며 관리자 대시보드 역시 하나의 중요한 제품 표면으로 정의하고, 공통 패턴을 설계하여 확장성과 일관된 사용성을 동시에 확보하는 것이 핵심임을 배웠습니다.',
    },
  ],
};
