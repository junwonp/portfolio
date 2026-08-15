import type { SessionDetail } from '@/lib/server/admin/dashboardData';

import * as styles from './admin.css';

interface SessionTimelineProps {
  detail: SessionDetail;
}

export function SessionTimeline({ detail }: SessionTimelineProps) {
  // Merge page views and interactions chronologically
  const timelineItems: Array<
    | { kind: 'pageView'; data: SessionDetail['pageViews'][number] }
    | { kind: 'interaction'; data: SessionDetail['interactions'][number] }
  > = [];

  for (const pv of detail.pageViews) {
    timelineItems.push({ kind: 'pageView', data: pv });
  }
  for (const ix of detail.interactions) {
    timelineItems.push({ kind: 'interaction', data: ix });
  }
  timelineItems.sort((a, b) => {
    const aTime = a.kind === 'pageView' ? a.data.createdAt : a.data.createdAt;
    const bTime = b.kind === 'pageView' ? b.data.createdAt : b.data.createdAt;
    return aTime.localeCompare(bTime);
  });

  const totalDwell = detail.pageViews.reduce((sum, pv) => sum + pv.dwellTime, 0);

  return (
    <div className={styles.timeline}>
      {timelineItems.map((item, i) => {
        if (item.kind === 'pageView') {
          const pv = item.data;
          const label = pv.path === '/' ? '홈' : pv.path.replace(/^\/+/, '');
          const isProjectPage = label.startsWith('projects/');
          const displayLabel = isProjectPage ? label.replace('projects/', '') : label;

          // Show navigation arrow if this page has a previous path
          const showNavArrow = pv.previousPath && pv.previousPath !== pv.path;

          return (
            <div key={`${pv.createdAt}-${pv.path}`} className={styles.timelineItem}>
              <div className={styles.timelineDot} />
              <div className={styles.timelineContent}>
                {showNavArrow && (
                  <div className={styles.timelineNavArrow}>
                    <span className={styles.timelineNavFrom}>
                      {pv.previousPath === '/'
                        ? '홈'
                        : (pv.previousPath ?? '').replace(/^\/+/, '').replace(/^projects\//, '')}
                    </span>
                    <span className={styles.timelineNavSymbol}>↓</span>
                  </div>
                )}
                <div className={styles.timelineRow}>
                  <span className={styles.timelinePath} title={pv.path}>
                    {isProjectPage ? (
                      <>
                        <span className={styles.timelinePathPrefix}>project/</span>
                        {displayLabel}
                      </>
                    ) : (
                      displayLabel
                    )}
                  </span>
                  {pv.dwellTime > 0 && (
                    <span className={styles.timelineDwell}>
                      {pv.dwellTime >= 60
                        ? `${Math.floor(pv.dwellTime / 60)}분 ${pv.dwellTime % 60}초`
                        : `${pv.dwellTime}초`}
                    </span>
                  )}
                </div>
                {(pv.articleProgress > 0 || pv.scrollDepth > 0) && (
                  <div className={styles.timelineBars}>
                    {pv.scrollDepth > 0 && (
                      <div className={styles.timelineBarRow}>
                        <span className={styles.timelineBarLabel}>스크롤</span>
                        <div className={styles.progressBar} style={{ maxWidth: '120px' }}>
                          <div
                            className={`${styles.progressFill} ${styles.blue}`}
                            style={{ width: `${pv.scrollDepth}%` }}
                          />
                        </div>
                        <span className={styles.timelineBarVal}>{pv.scrollDepth}%</span>
                      </div>
                    )}
                    {pv.articleProgress > 0 && (
                      <div className={styles.timelineBarRow}>
                        <span className={styles.timelineBarLabel}>본문</span>
                        <div className={styles.progressBar} style={{ maxWidth: '120px' }}>
                          <div
                            className={`${styles.progressFill} ${styles.green}`}
                            style={{ width: `${pv.articleProgress}%` }}
                          />
                        </div>
                        <span className={styles.timelineBarVal}>{pv.articleProgress}%</span>
                      </div>
                    )}
                    {pv.sectionLabel && (
                      <span className={styles.timelineSection}>
                        마지막 섹션: {pv.sectionLabel}
                      </span>
                    )}
                  </div>
                )}
                {pv.activeTime > 0 && pv.activeTime !== pv.dwellTime && (
                  <span className={styles.timelineActive}>
                    활성 {pv.activeTime}초
                  </span>
                )}
              </div>
            </div>
          );
        }

        // Interaction item
        const ix = item.data;
        return (
          <div key={`ix-${ix.id}`} className={styles.timelineItem}>
            <div className={styles.timelineDotSmall} />
            <div className={styles.timelineContent}>
              <div className={styles.timelineRow}>
                <span
                  className={`${styles.interactionAction} ${ix.action === 'open' ? styles.actionOpen : styles.actionClose}`}
                >
                  {ix.action === 'open' ? '열기' : '닫기'}
                </span>
                <span className={styles.timelineInteractionLabel}>{ix.interactionLabel}</span>
              </div>
            </div>
          </div>
        );
      })}

      {totalDwell > 0 && (
        <div className={styles.timelineTotal}>
          총 체류 시간:{' '}
          {totalDwell >= 60
            ? `${Math.floor(totalDwell / 60)}분 ${totalDwell % 60}초`
            : `${totalDwell}초`}
        </div>
      )}
    </div>
  );
}
