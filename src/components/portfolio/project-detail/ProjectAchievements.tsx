"use client";

import React, { useCallback, useState } from "react";
import { ChevronDown } from "lucide-react";

import Badge from "@/components/ui/Badge";
import Collapse from "@/components/ui/Collapse";
import { sanitizeProjectHtml } from "@/lib/utils/safeHtml";

import * as styles from "./ProjectAchievements.css";

export interface Achievement {
  tag: string;
  accent?: boolean;
  title: string;
  detail: string;
}

interface Props {
  achievements: Achievement[];
}

function AchievementItem({
  achievement,
  isOpen,
  onToggle,
}: {
  achievement: Achievement;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`${styles.achCard} ${isOpen ? styles.open : ""}`}
    >
      <button
        className={styles.achHeader}
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className={styles.achTitleRow}>
          <Badge
            text={achievement.tag}
            color={achievement.accent ? "green" : "primary"}
            className={styles.achTag}
          />
          <span className={styles.achTitle}>{achievement.title}</span>
        </div>
        <div className={styles.achHeaderRight}>
          <div
            className={`${styles.achChevron} ${isOpen ? styles.open : ""}`}
          >
            <ChevronDown size={18} strokeWidth={2} />
          </div>
        </div>
      </button>
      <Collapse isOpen={isOpen}>
        <div className={styles.achBody}>
          <div
            className={styles.achDesc}
            dangerouslySetInnerHTML={{ __html: achievement.detail }}
            suppressHydrationWarning
          />
        </div>
      </Collapse>
    </div>
  );
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

  const toggle = useCallback((index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }, []);

  return (
    <div className={styles.achievements}>
      {sanitizedAchievements.map((achievement, i) => (
        <AchievementItem
          key={i}
          achievement={achievement}
          isOpen={openIndex === i}
          onToggle={() => toggle(i)}
        />
      ))}
    </div>
  );
}
