import type { RecentInteraction } from '@/lib/server/admin/dashboardData';
import { formatDateTime } from '@/lib/utils/date';

import * as styles from './admin.css';

interface InteractionEventsPanelProps {
  recentInteractions: RecentInteraction[];
}

const INTERACTION_TYPE_LABELS: Record<string, string> = {
  accordion_company: '회사',
  accordion_project: '프로젝트',
  accordion_achievement: '작업 항목',
};

export function InteractionEventsPanel({ recentInteractions }: InteractionEventsPanelProps) {
  if (recentInteractions.length === 0) {
    return (
      <section className={`${styles.chartSection} ${styles.glass} ${styles.spacerTop}`}>
        <div className={styles.sectionHeadingRow}>
          <div>
            <h3>아코디언 인터랙션</h3>
            <p className={styles.sectionSubtitle}>
              방문자가 열어본 회사, 프로젝트, 작업 항목 아코디언 이벤트
            </p>
          </div>
        </div>
        <div className={styles.emptyState}>아직 기록된 아코디언 인터랙션이 없습니다.</div>
      </section>
    );
  }

  const grouped = new Map<string, RecentInteraction[]>();
  for (const interaction of recentInteractions) {
    const key = interaction.interactionType;
    const group = grouped.get(key) ?? [];
    group.push(interaction);
    grouped.set(key, group);
  }

  return (
    <section className={`${styles.chartSection} ${styles.glass} ${styles.spacerTop}`}>
      <div className={styles.sectionHeadingRow}>
        <div>
          <h3>아코디언 인터랙션</h3>
          <p className={styles.sectionSubtitle}>
            최근 50건 — 방문자가 열어본 회사, 프로젝트, 작업 항목 아코디언 이벤트
          </p>
        </div>
      </div>

      <div className={styles.interactionList}>
        {Array.from(grouped.entries()).map(([type, events]) => (
          <div key={type} className={styles.interactionGroup}>
            <span className={styles.interactionTypeLabel}>
              {INTERACTION_TYPE_LABELS[type] ?? type}
            </span>
            <ul>
              {events.map((event) => (
                <li key={event.id} className={styles.interactionItem}>
                  <span className={styles.interactionLabel}>{event.interactionLabel}</span>
                  <span
                    className={`${styles.interactionAction} ${event.action === 'open' ? styles.actionOpen : styles.actionClose}`}
                  >
                    {event.action === 'open' ? '열기' : '닫기'}
                  </span>
                  <span className={styles.interactionPath}>{event.path}</span>
                  <span className={styles.interactionTime}>{formatDateTime(event.createdAt)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
