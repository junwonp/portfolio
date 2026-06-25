"use client";

import React, { useEffect, useRef, useState } from "react";

import SkillChip from "@/lib/components/SkillChip";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { useSkillState } from "@/lib/states/skills";
import type { SkillProps } from "@/lib/types/about";

import styles from "./BottomSkillBar.module.css";

interface Props {
  skills: SkillProps[];
  onHeightChange?: (height: number) => void;
}

const ICONS: Record<string, string> = {
  languages: "M16 18L22 12L16 6M8 6L2 12L8 18",
  frameworks: "M12 2L2 7L12 12L22 7L12 2ZM2 17L12 22L22 17M2 12L12 17L22 12",
  ui: "M12 19L21 12L12 5L3 12L12 19Z",
  state:
    "M4 7V17M20 7V17M4 7C4 5.34315 7.58172 4 12 4C16.4183 4 20 5.34315 20 7M4 7C4 8.65685 7.58172 10 12 10C16.4183 10 20 8.65685 20 7M4 12C4 13.6569 7.58172 15 12 15C16.4183 15 20 13.6569 20 12M4 17C4 18.6569 7.58172 20 12 20C16.4183 20 20 18.6569 20 17",
  performance: "M13 2L3 14H12L11 22L21 10H12L13 2Z",
  backend:
    "M5 10H19M5 14H19M5 6H19C20.1046 6 21 6.89543 21 8V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V8C3 6.89543 3.89543 6 5 6Z",
  devops:
    "M12 16V22M8 12H2M16 12H22M12 8V2M7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 9.23858 14.7614 7 12 7C9.23858 7 7 9.23858 7 12Z",
  ai_workflow:
    "M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z",
};

export default function BottomSkillBar({ skills, onHeightChange }: Props) {
  const { locale, labels } = useLocale();
  const { selectedTechs, isEmpty, close } = useSkillState();
  const [isMinimized, setIsMinimized] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Esc key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [close]);

  // Height measurement
  useEffect(() => {
    if (!wrapperRef.current || !onHeightChange) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        onHeightChange(entry.target.clientHeight);
      }
    });

    resizeObserver.observe(wrapperRef.current);
    // Initial measurement
    onHeightChange(wrapperRef.current.clientHeight);

    return () => resizeObserver.disconnect();
  }, [onHeightChange, isMinimized]); // Measure again if minimized status changes

  const filterText = (() => {
    const count = selectedTechs.length;
    if (count === 0) return "";
    if (count === 1) return `"${selectedTechs[0]}"`;
    return locale === "ko"
      ? `"${selectedTechs[0]}" 외 ${String(count - 1)}개`
      : `"${selectedTechs[0]}" and ${String(count - 1)} more`;
  })();

  const filterLabelParts = labels.skillFilterActive.split("{tech}");

  return (
    <div ref={wrapperRef} className={styles["bottom-skill-bar-wrapper"]}>
      <div className={styles["bottom-skill-bar"]}>
        <div className={styles["bar-header"]}>
          <div className={styles["status-info"]}>
            <span
              className={`${styles["status-dot"]} ${isEmpty ? styles.inactive : ""}`}
            ></span>
            <span className={styles["status-text"]}>
              {isEmpty ? (
                labels.skillFilterPlaceholder
              ) : (
                <>
                  {filterLabelParts[0]}
                  <strong>{filterText}</strong>
                  {filterLabelParts[1] ?? ""}
                </>
              )}
            </span>
          </div>
          <div className={styles["header-actions"]}>
            <button
              className={styles["toggle-btn"]}
              onClick={() => setIsMinimized((prev) => !prev)}
              aria-label={
                isMinimized
                  ? labels.skillBarExpandAriaLabel
                  : labels.skillBarCollapseAriaLabel
              }
            >
              {isMinimized ? labels.skillBarExpand : labels.skillBarCollapse}
            </button>
            <button
              className={styles["close-btn"]}
              onClick={() => {
                close();
              }}
              aria-label={labels.skillFilterClearAriaLabel}
            >
              {labels.skillFilterClear}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div className={styles["bar-body"]}>
            {skills.map((skillGroup) => (
              <div key={skillGroup.title} className={styles["skill-category"]}>
                <div
                  className={styles["category-header"]}
                  style={
                    {
                      color: `var(--color-cat-${skillGroup.id})`,
                    } as React.CSSProperties
                  }
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={ICONS[skillGroup.id] || ""}></path>
                  </svg>
                  <h4 className={styles["category-title"]}>
                    {skillGroup.title}
                  </h4>
                </div>
                <div className={styles["category-chips"]}>
                  {skillGroup.list.map((skill) => (
                    <SkillChip key={skill} skill={skill} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
