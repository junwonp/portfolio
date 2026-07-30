'use client';

import { Fragment, useState } from 'react';

import type { RecentSession, SessionDetail } from '@/lib/server/admin/dashboardData';
import { formatDateTime } from '@/lib/utils/date';

import * as styles from './admin.css';

interface RecentSessionsTableProps {
  recentSessions: RecentSession[];
  sessionDetails: Record<string, SessionDetail>;
}

function SessionTimeline({ detail }: { detail: SessionDetail }) {
  return (
    <div className={styles.timeline}>
      {detail.pageViews.map((pv, i) => {
        const label = pv.path === '/' ? '홈' : pv.path.replace(/^\/+/, '');
        const isProjectPage = label.startsWith('projects/');
        const displayLabel = isProjectPage ? label.replace('projects/', '') : label;

        return (
          <div key={`${pv.createdAt}-${i}`} className={styles.timelineItem}>
            <div className={styles.timelineDot} />
            <div className={styles.timelineContent}>
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
      })}

      {detail.interactions.length > 0 && (
        <div className={styles.timelineInteractions}>
          <span className={styles.timelineInteractionsLabel}>아코디언 인터랙션</span>
          {detail.interactions.map((ix) => (
            <div key={ix.id} className={styles.timelineInteractionItem}>
              <span className={styles.timelineDotSmall} />
              <span
                className={`${styles.interactionAction} ${ix.action === 'open' ? styles.actionOpen : styles.actionClose}`}
              >
                {ix.action === 'open' ? '열기' : '닫기'}
              </span>
              <span className={styles.timelineInteractionLabel}>{ix.interactionLabel}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RecentSessionsTable({
  recentSessions,
  sessionDetails,
}: RecentSessionsTableProps) {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  return (
    <section className={`${styles.chartSection} ${styles.glass} ${styles.spacerTop}`}>
      <div className={styles.sectionHeadingRow}>
        <div>
          <h3>최근 접속 세션</h3>
          <p className={styles.sectionSubtitle}>
            행을 클릭하면 방문자의 전체 페이지 뷰와 인터랙션 타임라인을 확인할 수 있습니다.
          </p>
        </div>
      </div>

      {recentSessions.length === 0 ? (
        <div className={styles.emptyState}>기록된 최근 세션 정보가 없습니다.</div>
      ) : (
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '140px' }}>접속 시각</th>
                <th>유형</th>
                <th>국가</th>
                <th>유입 경로</th>
                <th className={styles.num}>조회</th>
                <th>정보</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((session) => {
                const isExpanded = expandedSession === session.id;
                const detail = sessionDetails[session.id];

                return (
                  <Fragment key={session.id}>
                    <tr className={isExpanded ? styles.expandedRow : undefined}>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          className={styles.expandToggle}
                          onClick={() =>
                            setExpandedSession(isExpanded ? null : session.id)
                          }
                          aria-expanded={isExpanded}
                        >
                          <span
                            className={`${styles.expandChevron} ${isExpanded ? styles.expandChevronOpen : ''}`}
                          >
                            ▸
                          </span>
                          {formatDateTime(session.createdAt)}
                        </button>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {session.classification === 'bot' && (
                          <span className="badge web">봇</span>
                        )}
                        {session.classification === 'suspected' && (
                          <span className="badge orange">봇 의심</span>
                        )}
                        {session.classification === 'human' && (
                          <span className="badge green">사람</span>
                        )}
                      </td>
                      <td>
                        {session.ipCountry === 'unknown' ? '직접/VPN' : session.ipCountry}
                      </td>
                      <td
                        className={styles.pathCell}
                        title={session.referrer}
                        style={{ maxWidth: '200px' }}
                      >
                        {session.referrer}
                      </td>
                      <td className={styles.num}>{session.pageViewsCount}</td>
                      <td className={styles.pathCell} style={{ maxWidth: '280px' }}>
                        <span
                          className={styles.uaPreview}
                          title={session.userAgent}
                        >
                          {session.userAgent.replace(/Mozilla\/5\.0\s*\(/.exec(session.userAgent)?.[0] ?? '', '').slice(0, 60)}
                        </span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className={styles.expandedRow}>
                        <td className={styles.detailCell} colSpan={6}>
                          {detail && detail.pageViews.length > 0 ? (
                            <SessionTimeline detail={detail} />
                          ) : (
                            <div className={styles.emptyState} style={{ padding: '1rem 0' }}>
                              이 세션의 페이지 뷰 기록이 없습니다.
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
