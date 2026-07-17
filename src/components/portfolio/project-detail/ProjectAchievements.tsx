"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

import Badge from "@/components/ui/Badge";
import { sanitizeProjectHtml } from "@/lib/utils/safeHtml";

import styles from "./ProjectAchievements.module.css";

export interface Achievement {
  tag: string;
  accent?: boolean;
  title: string;
  detail: string;
}

interface Props {
  achievements: Achievement[];
}

export default function ProjectAchievements({ achievements }: Props) {
  const firstAccentIndex = achievements.findIndex((a) => a.accent);
  const [openIndex, setOpenIndex] = useState<number>(
    firstAccentIndex >= 0 ? firstAccentIndex : 0
  );

  const sanitizedAchievements = achievements.map((achievement) => ({
    ...achievement,
    detail: sanitizeProjectHtml(achievement.detail),
  }));

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <div className={styles.achievements}>
      {sanitizedAchievements.map((achievement, i) => {
        const isOpen = openIndex === i;

        return (
          <div
            key={i}
            className={`${styles["ach-card"]} ${isOpen ? styles.open : ""}`}
          >
            <button
              className={styles["ach-header"]}
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
            >
              <div className={styles["ach-title-row"]}>
                <Badge
                  text={achievement.tag}
                  color={achievement.accent ? "green" : "primary"}
                  className={styles["ach-tag"]}
                />
                <span className={styles["ach-title"]}>{achievement.title}</span>
              </div>
              <div className={styles["ach-header-right"]}>
                <div
                  className={`${styles["ach-chevron"]} ${isOpen ? styles.open : ""}`}
                >
                  <ChevronDown size={18} strokeWidth={2} />
                </div>
              </div>
            </button>
            <div
              className={`${styles["ach-body-wrapper"]} ${isOpen ? styles.open : ""}`}
            >
              <div className={styles["ach-body"]}>
                <div
                  className={styles["ach-desc"]}
                  dangerouslySetInnerHTML={{ __html: achievement.detail }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
