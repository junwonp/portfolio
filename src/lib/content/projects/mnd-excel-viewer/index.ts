import { SKILL } from '$lib/data/skills';

import { defineProject } from '../types';

export const mndExcelViewerProject = defineProject({
  id: 'web_viewer',
  slug: 'mnd-excel-viewer',
  section: 'work',
  parentId: 'mnd',
  dateFrom: '2020-08',
  dateTo: '2020-10',
  detailPath: '/projects/mnd-excel-viewer',
  featuredSkills: [
    SKILL.languages.typescript,
    SKILL.frameworks.react,
    SKILL.ui.reactTable,
    SKILL.performance.reactWindow,
    SKILL.performance.reactVirtualized,
    SKILL.backend.socketIo,
  ],
  skills: [
    SKILL.languages.typescript,
    SKILL.frameworks.react,
    SKILL.ui.styledComponents,
    SKILL.ui.atomicDesign,
    SKILL.ui.reactTable,
    SKILL.state.redux,
    SKILL.state.reduxSaga,
    SKILL.performance.reactWindow,
    SKILL.performance.reactVirtualized,
    SKILL.backend.socketIo,
  ],
  content: {
    en: {
      title: 'Web-based Document Viewer',
      description: 'Large-scale Spreadsheet Viewer for Intranet',
      summaryDetails: [
        '**[High-Performance Virtualization]** Built an Excel-style grid capable of handling thousands of rows using **react-window**. Optimized row/column rendering to maintain responsiveness under heavy data load.',
        '**[2D Selection UX]** Implemented complex 2D area selection and drag-to-update logic, using **styled-components** for real-time visual feedback.',
        '**[Real-time Collaboration]** Integrated **Socket.IO** to allow multiple users to highlight and comment on document areas simultaneously. Built a custom mock socket environment for robust offline development in restricted networks.',
        '**[Atomic Design System]** Established a scalable component library from scratch using **Atomic Design** principles, ensuring UI consistency across the intranet platform.',
      ],
      detailMetadata: {
        title: 'Spreadsheet-style grid & text viewer',
        description:
          'Large-scale grid and line-based text viewer using React Table, virtualization, and 2D cell selection (Immer)',
        date: '2020-08 ~ 2020-10',
        role: 'Frontend Engineer',
        techStack: [
          'TypeScript',
          'React',
          'styled-components',
          'Atomic Design',
          'React Table',
          'Redux',
          'Redux-Saga',
          'react-window',
          'react-virtualized',
          'Socket.IO',
        ],
      },
    },
    ko: {
      title: '웹 기반 문서 뷰어',
      description: '인트라넷용 대용량 스프레드시트 뷰어',
      summaryDetails: [
        '**[고성능 가상화]** **react-window를 활용하여 수천 개의 행을 끊김 없이 렌더링**하는 엑셀 스타일의 그리드를 구축했습니다. 대량 데이터 로드 시의 응답성을 확보했습니다.',
        '**[2D 영역 선택 UX]** **복잡한 2차원 영역 선택 및 드래그 업데이트 로직**을 구현하고, **styled-components**를 사용해 실시간 시각적 피드백을 최적화했습니다.',
        '**[실시간 협업 기능]** **Socket.IO를 연동하여 여러 사용자가 동시에 문서의 특정 영역을 강조**하고 코멘트를 남길 수 있는 기능을 구현했습니다. 오프라인 개발을 위한 커스텀 Mock 소켓 환경을 구축했습니다.',
        '**[Atomic 디자인 시스템]** **Atomic Design 원칙에 따라 컴포넌트 라이브러리를 바닥부터 설계**하여, 인트라넷 플랫폼 전체의 UI 일관성을 확보했습니다.',
      ],
      detailMetadata: {
        title: '스프레드시트형 그리드·텍스트 뷰어',
        description:
          'React Table·가상화·2D 셀 선택(Immer)을 활용한 대용량 그리드와 줄 단위 텍스트 뷰어',
        date: '2020-08 ~ 2020-10',
        role: 'Frontend Engineer',
        techStack: [
          'TypeScript',
          'React',
          'styled-components',
          'Atomic Design',
          'React Table',
          'Redux',
          'Redux-Saga',
          'react-window',
          'react-virtualized',
          'Socket.IO',
        ],
      },
    },
  },
});
