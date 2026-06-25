"use client";

import React, { useMemo } from "react";

import type { Language } from "@/lib/utils/language";

import styles from "./MndExcelViewerDiagram.module.css";

interface Props {
  locale: Language;
}

interface DiagramStep {
  detail: string;
  label: string;
}

const copy = {
  en: {
    caption:
      "Reconstructed system diagram. The original intranet UI and data are not shown.",
    title: "Restricted document viewer flow",
    steps: [
      {
        label: "Restricted intranet",
        detail: "No public services or production data in local development",
      },
      {
        label: "Mock socket layer",
        detail: "Same event contract as Socket.IO for offline UI validation",
      },
      {
        label: "Viewer containers",
        detail: "Own state, range selection, popovers, and collaboration events",
      },
      {
        label: "Virtualized renderers",
        detail:
          "Grid rows via react-window; variable text lines via react-virtualized",
      },
    ],
  },
  ko: {
    caption:
      "재구성한 시스템 다이어그램입니다. 원본 인트라넷 UI와 데이터는 포함하지 않았습니다.",
    title: "제한망 문서 뷰어 흐름",
    steps: [
      {
        label: "제한망 인트라넷",
        detail: "로컬 개발에서 외부 서비스와 운영 데이터를 사용하지 않음",
      },
      {
        label: "Mock 소켓 레이어",
        detail: "Socket.IO와 동일한 이벤트 계약으로 오프라인 UI 검증",
      },
      {
        label: "뷰어 컨테이너",
        detail: "상태, 영역 선택, Popover, 협업 이벤트를 담당",
      },
      {
        label: "가상화 렌더러",
        detail:
          "그리드는 react-window, 가변 텍스트 줄은 react-virtualized",
      },
    ],
  },
} satisfies Record<
  Language,
  { caption: string; steps: DiagramStep[]; title: string }
>;

export default function MndExcelViewerDiagram({ locale }: Props) {
  const labels = useMemo(() => copy[locale] || copy.ko, [locale]);

  return (
    <figure
      className={styles["viewer-diagram"]}
      aria-labelledby="mnd-viewer-diagram-title"
    >
      <figcaption className={styles.figcaption}>
        <strong id="mnd-viewer-diagram-title">{labels.title}</strong>
        <span>{labels.caption}</span>
      </figcaption>
      <ol className={styles["diagram-flow"]}>
        {labels.steps.map((step, index) => (
          <li key={step.label} className={styles["diagram-node"]}>
            <span className={styles["node-index"]}>{index + 1}</span>
            <strong>{step.label}</strong>
            <span>{step.detail}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}
