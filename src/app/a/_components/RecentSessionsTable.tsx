import type { RecentSession } from '@/lib/server/admin/dashboardData';
import { formatDateTime } from '@/lib/utils/date';

import * as styles from './admin.css';

interface RecentSessionsTableProps {
  recentSessions: RecentSession[];
}

export function RecentSessionsTable({ recentSessions }: RecentSessionsTableProps) {
  return (
    <section className={`${styles.chartSection} ${styles.glass} ${styles.spacerTop}`}>
      <div className={styles.sectionHeadingRow}>
        <div>
          <h3>최근 접속 세션</h3>
          <p className={styles.sectionSubtitle}>
            최근 방문한 30개 사용자 세션의 상세 로그 (어드민 제외)
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
                <th>접속 시각</th>
                <th>유형</th>
                <th>IP 주소</th>
                <th>국가</th>
                <th>유입 경로 (Referrer)</th>
                <th className={styles.num}>조회 수</th>
                <th>브라우저 정보 (User Agent)</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map((session) => (
                <tr key={session.id}>
                  <td style={{ whiteSpace: 'nowrap' }}>{formatDateTime(session.createdAt)}</td>
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
                    <code className={styles.ipBadge}>{session.ipAddress}</code>
                  </td>
                  <td>{session.ipCountry === 'unknown' ? '직접/VPN' : session.ipCountry}</td>
                  <td className={styles.pathCell} title={session.referrer}>
                    {session.referrer}
                  </td>
                  <td className={styles.num}>{session.pageViewsCount}</td>
                  <td className={styles.pathCell} title={session.userAgent} style={{ maxWidth: '250px' }}>
                    {session.userAgent}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
