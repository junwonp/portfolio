'use client';

import { Fragment, useState } from 'react';

import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeading from '@/components/ui/SectionHeading';
import type { SessionDetail, SessionRow } from '@/lib/server/admin/dashboardData';
import { formatDateTime } from '@/lib/utils/date';

import * as shared from './adminShared.css';
import { formatAcceptLanguage } from './dashboardLabels';
import { SessionFilters } from './SessionFilters';
import * as styles from './SessionsTable.css';
import { SessionTimeline } from './SessionTimeline';

const UNKNOWN_LABEL = '알 수 없음';

const formatDerivedLabel = (value: string): string => {
  const trimmed = value?.trim() ?? '';

  if (!trimmed || trimmed.toLowerCase() === 'unknown') {
    return UNKNOWN_LABEL;
  }

  return `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
};

const formatLocation = (city: string, regionCode: string): string =>
  [city, regionCode]
    .map((part) => part?.trim() ?? '')
    .filter((part) => part.length > 0)
    .join(', ');

// timezone/colo are NULL on rows recorded before those columns existed, so an
// absent or 'unknown' value renders nothing instead of a literal placeholder.
const formatOptionalLabel = (value: string): string => {
  const trimmed = value?.trim() ?? '';

  return trimmed.toLowerCase() === 'unknown' ? '' : trimmed;
};

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
      className={`${shared.chartSection} ${shared.spacerTop}`}
      aria-labelledby="sessions-table-title"
    >
      <SectionHeading
        level={2}
        title="접속 세션"
        subtitle="행을 클릭하면 방문자의 전체 페이지 뷰와 인터랙션 타임라인을 확인할 수 있습니다."
        action={<div className={shared.rangeBadge}>{totalCount}개 세션</div>}
        id="sessions-table-title"
      />

      <SessionFilters classification={classification} timeRange={timeRange} />

      {sessions.length === 0 ? (
        <EmptyState message="조건에 맞는 세션 정보가 없습니다." />
      ) : (
        <div className={shared.tableScroll}>
          <table>
            <thead>
              <tr>
                <th scope="col" className={styles.timeColumn}>
                  접속 시각
                </th>
                <th scope="col">유형</th>
                <th scope="col">단축 링크</th>
                <th scope="col">국가</th>
                <th scope="col">유입 경로</th>
                <th scope="col" className={shared.num}>
                  조회
                </th>
                <th scope="col">기기</th>
                <th scope="col">위치</th>
                <th scope="col">언어</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                const isExpanded = expandedSession === session.id;
                const detail = sessionDetails[session.id];
                const deviceLabel = formatDerivedLabel(session.deviceType);
                const browserLabel = formatDerivedLabel(session.browser);
                const osLabel = formatDerivedLabel(session.os);
                const locationLabel = formatLocation(session.city, session.regionCode);
                const timezoneLabel = formatOptionalLabel(session.timezone);
                const coloLabel = formatOptionalLabel(session.colo);

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
                          <time dateTime={session.createdAt}>
                            {formatDateTime(session.createdAt)}
                          </time>
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
                      <td className={shared.num}>{session.pageViewsCount}</td>
                      <td
                        className={styles.deviceCell}
                        title={`${deviceLabel} · ${browserLabel} / ${osLabel}`}
                      >
                        <span>{deviceLabel}</span>
                        <span className={styles.deviceDetail}>
                          {browserLabel} / {osLabel}
                        </span>
                      </td>
                      <td
                        className={styles.locationCell}
                        title={
                          [locationLabel, timezoneLabel].filter(Boolean).join(' · ') || undefined
                        }
                      >
                        <span>{locationLabel || <span className={styles.mutedCell}>-</span>}</span>
                        {timezoneLabel && (
                          <span className={styles.deviceDetail}>{timezoneLabel}</span>
                        )}
                      </td>
                      <td className={styles.noWrapCell}>
                        {formatAcceptLanguage(session.acceptLanguage)}
                      </td>
                    </tr>
                    {isExpanded && (
                      <tr className={`${styles.expandedRow} ${styles.detailRow}`}>
                        <td className={styles.detailCell} colSpan={9}>
                          {coloLabel && (
                            <p className={styles.detailNote}>Cloudflare 엣지: {coloLabel}</p>
                          )}
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
