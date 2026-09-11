'use client';

import { ChevronDown } from 'lucide-react';
import { useId, useState } from 'react';

import Badge from '@/components/ui/Badge';
import Collapse from '@/components/ui/Collapse';
import { cardSurface } from '@/components/ui/surface.css';
import { reportInteraction } from '@/lib/analytics/analyticsTransport';
import { markdownInlineToHtml } from '@/lib/utils/markdown';
import { sanitizeProjectHtml } from '@/lib/utils/safeHtml';

import * as styles from './ProjectAchievements.css';

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
  const id = useId();
  const headerId = `${id}-header`;
  const panelId = `${id}-panel`;

  return (
    <li className={`${styles.achCard} ${cardSurface} ${isOpen ? styles.open : ''}`}>
      <h3 className={styles.achTitle}>
        <button
          type="button"
          id={headerId}
          className={styles.achHeader}
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className={styles.achTitleRow}>
            <Badge
              text={achievement.tag}
              color={achievement.accent ? 'green' : 'primary'}
              className={styles.achTag}
            />
            {achievement.title}
          </span>
          <span className={styles.achHeaderRight}>
            <span className={`${styles.achChevron} ${isOpen ? styles.open : ''}`}>
              <ChevronDown size={18} strokeWidth={2} />
            </span>
          </span>
        </button>
      </h3>
      <Collapse isOpen={isOpen} id={panelId}>
        <div className={styles.achBody} role="region" aria-labelledby={headerId}>
          {/* detail is sanitized via sanitizeProjectHtml before it reaches here */}
          <div
            className={styles.achDesc}
            dangerouslySetInnerHTML={{ __html: achievement.detail }}
            suppressHydrationWarning
          />
        </div>
      </Collapse>
    </li>
  );
}

export default function ProjectAchievements({ achievements }: Props) {
  const firstAccentIndex = achievements.findIndex((a) => a.accent);
  const [openIndex, setOpenIndex] = useState<number>(firstAccentIndex >= 0 ? firstAccentIndex : 0);

  const sanitizedAchievements = achievements.map((achievement) => ({
    ...achievement,
    detail: sanitizeProjectHtml(markdownInlineToHtml(achievement.detail)),
  }));

  const toggle = (index: number) => {
    const nextOpen = openIndex === index ? -1 : index;
    setOpenIndex(nextOpen);
    if (nextOpen >= 0) {
      reportInteraction({
        interactionType: 'accordion_achievement',
        interactionLabel: sanitizedAchievements[nextOpen]?.title ?? `achievement-${nextOpen}`,
        action: 'open',
      });
    }
  };

  return (
    <ul className={styles.achievements}>
      {sanitizedAchievements.map((achievement, i) => (
        <AchievementItem
          key={achievement.title}
          achievement={achievement}
          isOpen={openIndex === i}
          onToggle={() => toggle(i)}
        />
      ))}
    </ul>
  );
}
