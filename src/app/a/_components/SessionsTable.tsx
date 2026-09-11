'use client';

import { Fragment, useState } from 'react';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeading from '@/components/ui/SectionHeading';
import type { SessionDetail, SessionRow } from '@/lib/server/admin/dashboardData';
import { formatDateTime } from '@/lib/utils/date';

import * as styles from './admin.css';
import { SessionFilters } from './SessionFilters';
import { SessionTimeline } from './SessionTimeline';

interface SessionsTableProps {
  sessions: SessionRow[];
  totalCount: number;
  sessionDetails: Record<string, SessionDetail>;
  classification?: 'bot' | 'suspected' | 'human';
  timeRange?: '7d' | '30d' | 'all';
}

export function SessionsTable({
  sessions,
  totalCount,
  sessionDetails,
  classification,
  timeRange,
}: SessionsTableProps) {
  const [expandedSession, setExpandedSession] = useState<string | null>(null);

  return (
    <Card
      variant="glass"
      radius="sm"
      as="section"
      className={`${styles.chartSection} ${styles.spacerTop}`}
    >
      <SectionHeading
        level={3}
        title="접속 세션"
        subtitle="행을 클릭하면 방문자의 전체 페이지 뷰와 인터랙션 타임라인을 확인할 수 있습니다."
        action={<div className={styles.rangeBadge}>{totalCount}개 세션</div>}
      />

      <SessionFilters classification={classification} timeRange={timeRange} />

      {sessions.length === 0 ? (
        <EmptyState message="조건에 맞는 세션 정보가 없습니다." />
      ) : (
        <div className={styles.tableScroll}>
          <table>
            <thead>
              <tr>
                <th className={styles.timeColumn}>접속 시각</th>
                <th>유형</th>
                <th>단축 링크</th>
                <th>국가</th>
                <th>유입 경로</th>
                <th className={styles.num}>조회</th>
                <th>정보</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                const isExpanded = expandedSession === session.id;
                const detail = sessionDetails[session.id];

                return (
                  <Fragment key={session.id}>
                    <tr className={isExpanded ? styles.expandedRow : undefined}>
                      <td className={styles.noWrapCell}>
                        <button
                          type="button"
                          className={styles.expandToggle}
                          onClick={() => setExpandedSession(isExpanded ? null : session.id)}
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
                      <td className={styles.noWrapCell}>
                        {session.classification === 'bot' && <Badge text="봇" color="web" />}
                        {session.classification === 'suspected' && (
                          <Badge text="봇 의심" color="orange" />
                        )}
                        {session.classification === 'human' && <Badge text="사람" color="green" />}
                      </td>
                      <td>
                        {session.applicationLinkSlug ? (
                          <a
                            href={`/${session.applicationLinkSlug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.linkCell}
                          >
                            /{session.applicationLinkSlug}
                          </a>
                        ) : (
                          <span className={styles.mutedCell}>-</span>
                        )}
                      </td>
                      <td>{session.ipCountry === 'unknown' ? '직접/VPN' : session.ipCountry}</td>
                      <td className={styles.referrerCell} title={session.referrer}>
                        {session.referrer}
                      </td>
                      <td className={styles.num}>{session.pageViewsCount}</td>
                      <td className={styles.uaCell}>
                        <span className={styles.uaPreview} title={session.userAgent}>
                          {session.userAgent
                            .replace(/Mozilla\/5\.0\s*\(/.exec(session.userAgent)?.[0] ?? '', '')
                            .slice(0, 60)}
                        </span>
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className={`${styles.expandedRow} ${styles.detailRow}`}>
                        <td className={styles.detailCell} colSpan={7}>
                          {detail && detail.pageViews.length > 0 ? (
                            <SessionTimeline detail={detail} />
                          ) : (
                            <EmptyState message="이 세션의 페이지 뷰 기록이 없습니다." />
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
    </Card>
  );
}
