import { SKILL } from '$lib/data/skills';

import { defineProject } from '../types';

export const dayPlannerProject = defineProject({
  id: 'day_planner',
  slug: 'day-planner',
  section: 'other',
  dateFrom: '2026-04',
  detailPath: '/projects/day-planner',
  paradigm: 'agentic',
  featuredSkills: [SKILL.languages.swift, SKILL.frameworks.swiftUi, SKILL.backend.cloudKit],
  skills: [
    SKILL.languages.swift,
    SKILL.frameworks.swiftUi,
    SKILL.backend.cloudKit,
    SKILL.aiWorkflow.agenticWorkflow,
    SKILL.aiWorkflow.claudeCode,
  ],
  content: {
    en: {
      title: 'Day Planner — Cross-platform Scheduler for Time Management',
      description:
        'A cross-platform (iOS/macOS) scheduler app developed as a first Swift project. Features timetable management, auto-focus mode transition, Mac menu bar integration, and CloudKit-based synchronization.',
      summaryDetails: [
        '**[Platform-Native Experience]** Built a native macOS Menu Bar app and iOS widgets using **SwiftUI**, managing real-time countdowns and state synchronization across platforms.',
        '**[Automation Integration]** Integrated with **Apple Shortcuts** via deep links to automate system Focus Modes based on the user’s schedule.',
        '**[Agentic Development]** Designed and executed the entire project through an **Agentic Workflow**, leveraging **Claude Code** and custom directives to maintain high velocity and architectural integrity.',
      ],
      detailMetadata: {
        title: 'Day Planner: Cross-platform Scheduler for Time Management',
        description:
          'A cross-platform iOS/macOS scheduler — first Swift project featuring timetable management, Focus Mode automation, Mac Menu Bar integration, and CloudKit sync.',
        date: '2026-04 ~',
        image: '/images/preview.webp',
        role: 'Solo developer',
        platforms: ['iOS', 'macOS'],
        techStack: ['Swift', 'SwiftUI', 'CloudKit', 'Agentic Workflow', 'Claude Code'],
      },
    },
    ko: {
      title: 'Day Planner — 시간 관리를 위한 크로스 플랫폼 스케줄러',
      description:
        '첫 Swift 프로젝트로 개발한 크로스 플랫폼(iOS/macOS) 앱. 타임테이블 관리, 자동 집중모드 전환, Mac 상태바 연동 및 CloudKit 동기화 구현.',
      summaryDetails: [
        '**[네이티브 경험]** **SwiftUI를 사용하여 macOS 상태바 앱과 iOS 위젯**을 구축했습니다. 플랫폼 간 실시간 카운트다운 및 상태 동기화를 구현했습니다.',
        '**[시스템 자동화]** **애플 단축어(Shortcuts) 연동**을 통해 사용자의 일정에 맞춰 집중 모드가 자동으로 전환되는 시스템 환경을 설계했습니다.',
        '**[에이전틱 개발]** **Claude Code와 커스텀 지침을 활용한 에이전틱 워크플로우**를 설계하여, 직접적인 코드 작성보다 아키텍처 설계와 검증에 집중한 고효율 개발을 수행했습니다.',
      ],
      detailMetadata: {
        title: 'Day Planner: 시간 관리를 위한 크로스 플랫폼 스케줄러',
        description:
          '크로스 플랫폼(iOS/macOS) 스케줄러 — Swift 첫 프로젝트로 타임테이블 관리, 집중 모드 자동화, Mac 상태바 연동, CloudKit 동기화를 구현했습니다.',
        date: '2026-04 ~',
        image: '/images/preview.webp',
        role: '1인 개발',
        platforms: ['iOS', 'macOS'],
        techStack: ['Swift', 'SwiftUI', 'CloudKit', 'Agentic Workflow', 'Claude Code'],
      },
    },
  },
});
