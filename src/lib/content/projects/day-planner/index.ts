import { SKILL } from '$lib/data/skills';

import { defineProject } from '../types';

export const dayPlannerProject = defineProject({
  id: 'day_planner',
  slug: 'day-planner',
  section: 'other',
  dateFrom: '2026-04',
  paradigm: 'agentic',
  featuredSkills: [SKILL.languages.swift, SKILL.frameworks.swiftUi, SKILL.backend.cloudKit],
  skills: [SKILL.languages.swift, SKILL.frameworks.swiftUi, SKILL.backend.cloudKit],
  content: {
    en: {
      title: 'Day Planner — Cross-platform Scheduler for Time Management',
      description:
        'A cross-platform (iOS/macOS) scheduler app developed as a first Swift project. Features timetable management, auto-focus mode transition, Mac menu bar integration, and CloudKit-based synchronization.',
      metrics: [
        { value: '79', label: 'macOS Tests Passed' },
        { value: '600ms', label: 'CloudKit Debounce' },
        { value: '5', label: 'Native Surfaces' },
      ],
      summaryDetails: [
        '**[Platform-Native Experience]** Built iOS day views, a macOS Menu Bar surface, Live Activity state, and shared SwiftUI schedule views around one schedule-resolution model.',
        '**[Automation Integration]** Integrated **Apple Shortcuts** via deep links for Focus Mode workflows, while documenting the boundary between app-running automation and OS/device-only behavior.',
        '**[Sync & Verification]** Implemented **CloudKit private-database sync** with a 600ms push debounce and verified archive merge, notification planning, overlap rules, Live Activity snapshots, and menu bar label logic with **79 macOS tests**.',
      ],
      detailMetadata: {
        title: 'Day Planner: Cross-platform Scheduler for Time Management',
        description:
          'A cross-platform iOS/macOS scheduler — first Swift project featuring timetable management, Focus Mode automation, Mac Menu Bar integration, and CloudKit sync.',
        date: '2026-04 ~',
        image: '/images/preview.webp',
        metrics: [
          { value: '79', label: 'macOS Tests Passed' },
          { value: '600ms', label: 'CloudKit Debounce' },
          { value: '5', label: 'Native Surfaces' },
        ],
        role: 'Solo developer',
        platforms: ['iOS', 'macOS'],
        techStack: ['Swift', 'SwiftUI', 'CloudKit'],
      },
    },
    ko: {
      title: 'Day Planner — 시간 관리를 위한 크로스 플랫폼 스케줄러',
      description:
        '첫 Swift 프로젝트로 개발한 크로스 플랫폼(iOS/macOS) 앱. 타임테이블 관리, 자동 집중모드 전환, Mac 상태바 연동 및 CloudKit 동기화 구현.',
      metrics: [
        { value: '79', label: 'macOS 테스트 통과' },
        { value: '600ms', label: 'CloudKit 디바운스' },
        { value: '5', label: '네이티브 화면' },
      ],
      summaryDetails: [
        '**[네이티브 경험]** iOS day view, macOS Menu Bar, Live Activity 상태, 공통 SwiftUI 일정 뷰를 하나의 일정 해석 모델 위에 구축했습니다.',
        '**[시스템 자동화]** **Apple Shortcuts 딥링크**로 Focus Mode 워크플로우를 연동하고, 앱 실행 중 자동화와 OS/기기 검증이 필요한 동작의 경계를 문서화했습니다.',
        '**[동기화와 검증]** 600ms push debounce를 적용한 **CloudKit private database 동기화**를 구현하고, Archive 병합, 알림 계획, 겹침 규칙, Live Activity 스냅샷, 메뉴바 라벨 로직을 **macOS 테스트 79개**로 검증했습니다.',
      ],
      detailMetadata: {
        title: 'Day Planner: 시간 관리를 위한 크로스 플랫폼 스케줄러',
        description:
          '크로스 플랫폼(iOS/macOS) 스케줄러 — Swift 첫 프로젝트로 타임테이블 관리, 집중 모드 자동화, Mac 상태바 연동, CloudKit 동기화를 구현했습니다.',
        date: '2026-04 ~',
        image: '/images/preview.webp',
        metrics: [
          { value: '79', label: 'macOS 테스트 통과' },
          { value: '600ms', label: 'CloudKit 디바운스' },
          { value: '5', label: '네이티브 화면' },
        ],
        role: '1인 개발',
        platforms: ['iOS', 'macOS'],
        techStack: ['Swift', 'SwiftUI', 'CloudKit'],
      },
    },
  },
});
