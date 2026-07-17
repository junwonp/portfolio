"use client";

import React, { useMemo } from "react";

import type { Language } from "@/lib/utils/language";

import styles from "./DayPlannerEvidence.module.css";

interface Props {
  locale: Language;
}

interface EvidenceItem {
  detail: string;
  label: string;
  value: string;
}

interface SurfaceItem {
  detail: string;
  label: string;
}

const copy = {
  en: {
    evidenceTitle: "Verification boundary",
    note: "Reconstructed evidence map based on the local Day Planner codebase and tests. It is not a product screenshot.",
    surfacesTitle: "Cross-platform surface map",
    evidence: [
      {
        label: "macOS test run",
        value: "79 passed",
        detail:
          "Archive merge, CloudKit payload handling, recurrence, overlap rules, notification planning, Live Activity snapshots, and menu bar label logic.",
      },
      {
        label: "Sync policy",
        value: "600ms",
        detail:
          "Local schedule edits trigger a debounced CloudKit push, then merge sections by timestamp before applying locally.",
      },
      {
        label: "Device checks",
        value: "Manual",
        detail:
          "Actual Shortcuts execution, local notification delivery, ActivityKit rendering, and multi-device CloudKit conflicts remain OS/device verification paths.",
      },
    ],
    surfaces: [
      {
        label: "iOS day view",
        detail:
          "Timed schedule, all-day panel, todos, and Live Activity state share the same ScheduleStore resolution path.",
      },
      {
        label: "macOS menu bar",
        detail:
          "MenuBarExtra shows the active schedule and remaining time from a 30-second status engine.",
      },
      {
        label: "Focus automation",
        detail:
          "Schedule transitions call user-defined Shortcuts through shortcuts://run-shortcut?name=...",
      },
      {
        label: "Timeline layout",
        detail:
          "Overlapping timed blocks are packed into lanes and covered by a text snapshot fixture.",
      },
      {
        label: "CloudKit sync",
        detail:
          "A private PlannerArchive/main record stores JSON payload and section-level timestamps.",
      },
    ],
  },
  ko: {
    evidenceTitle: "검증 범위",
    note: "로컬 Day Planner 코드베이스와 테스트를 기준으로 재구성한 증거 맵입니다. 실제 제품 스크린샷은 아닙니다.",
    surfacesTitle: "크로스 플랫폼 화면 흐름",
    evidence: [
      {
        label: "macOS 테스트 실행",
        value: "79개 통과",
        detail:
          "Archive 병합, CloudKit payload 처리, 반복 일정, 겹침 검증, 알림 계획, Live Activity 스냅샷, 메뉴바 라벨 로직을 포함합니다.",
      },
      {
        label: "동기화 정책",
        value: "600ms",
        detail:
          "로컬 일정 변경 후 디바운스된 CloudKit push를 수행하고, section timestamp 기준으로 병합한 뒤 로컬에 반영합니다.",
      },
      {
        label: "기기 검증",
        value: "수동",
        detail:
          "Shortcuts 실제 실행, 로컬 알림 전달, ActivityKit 렌더링, 다중 기기 CloudKit 충돌은 OS/기기 검증 경로로 분리했습니다.",
      },
    ],
    surfaces: [
      {
        label: "iOS day view",
        detail:
          "시간 일정, 하루 종일 패널, todo, Live Activity 상태가 같은 ScheduleStore 해석 경로를 공유합니다.",
      },
      {
        label: "macOS menu bar",
        detail:
          "MenuBarExtra가 30초 상태 엔진에서 계산한 현재 일정과 남은 시간을 표시합니다.",
      },
      {
        label: "Focus automation",
        detail:
          "일정 전환 시 shortcuts://run-shortcut?name=...으로 사용자 지정 단축어를 호출합니다.",
      },
      {
        label: "Timeline layout",
        detail:
          "겹치는 시간 블록을 lane으로 배치하고 텍스트 스냅샷 fixture로 회귀를 확인합니다.",
      },
      {
        label: "CloudKit sync",
        detail:
          "private PlannerArchive/main 레코드에 JSON payload와 section timestamp를 저장합니다.",
      },
    ],
  },
} satisfies Record<
  Language,
  {
    evidence: EvidenceItem[];
    evidenceTitle: string;
    note: string;
    surfaces: SurfaceItem[];
    surfacesTitle: string;
  }
>;

export default function DayPlannerEvidence({ locale }: Props) {
  const labels = useMemo(() => copy[locale] || copy.ko, [locale]);

  return (
    <section className={styles["day-planner-evidence"]} aria-label={labels.surfacesTitle}>
      <div className={styles["section-heading"]}>
        <p>{labels.note}</p>
      </div>

      <div className={styles["surface-map"]}>
        <h3>{labels.surfacesTitle}</h3>
        <ol className={styles["surface-list"]}>
          {labels.surfaces.map((item, index) => (
            <li key={item.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className={styles["verification-card"]}>
        <h3>{labels.evidenceTitle}</h3>
        <dl>
          {labels.evidence.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>
                <strong>{item.value}</strong>
                <span>{item.detail}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
