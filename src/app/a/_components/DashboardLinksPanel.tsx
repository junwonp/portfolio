import * as styles from './admin.css';
import { LinkCard } from './LinkCard';
import { LinkForm } from './LinkForm';

interface DashboardLinksPanelProps {
  applicationLinks: {
    avgActiveTime: number;
    avgArticleProgress: number;
    avgDwellTime: number;
    avgScrollDepth: number;
    companyName: string;
    createdAt: string;
    expiresAt: string;
    id: number;
    interactionCount: number;
    interactionLabels: string[];
    label: string;
    lastSeenAt: string | null;
    projectIds: string[];
    role: 'web' | 'mobile' | 'ai' | null;
    sessions: number;
    slug: string;
    summaryPreset: string;
    views: number;
  }[];
  applicationProjectOptions: { id: string; title: string }[];
  writesDisabledReason: string | null;
  writesEnabled: boolean;
}

export function DashboardLinksPanel({
  applicationLinks,
  applicationProjectOptions,
  writesDisabledReason,
  writesEnabled,
}: DashboardLinksPanelProps) {
  return (
    <div className={styles.dashboardPanel} role="tabpanel">
      <section
        className={`${styles.applicationLinkCard} ${styles.glass}`}
        aria-labelledby="link-create-title"
      >
        <div className={styles.applicationLinkPanel}>
          <div className={styles.sectionHeadingRow}>
            <div>
              <h3 id="link-create-title">지원 링크 생성</h3>
              <p className={styles.sectionSubtitle}>
                회사별 짧은 URL과 맞춤 프로젝트 순서를 설정합니다.
              </p>
              {writesDisabledReason && (
                <p className={styles.sectionSubtitle}>{writesDisabledReason}</p>
              )}
            </div>
          </div>
          <LinkForm
            applicationProjectOptions={applicationProjectOptions}
            writesEnabled={writesEnabled}
          />
        </div>
      </section>

      <section
        className={`${styles.applicationLinkCard} ${styles.glass}`}
        aria-labelledby="link-list-title"
      >
        <div className={styles.applicationLinkPanel}>
          <div className={styles.sectionHeadingRow}>
            <div>
              <h3 id="link-list-title">생성된 링크</h3>
              <p className={styles.sectionSubtitle}>
                활성 링크 목록입니다. 상세 지표는 분석 화면에서 확인하세요.
              </p>
            </div>
            <div className={styles.rangeBadge}>{applicationLinks.length}개 활성 링크</div>
          </div>

          {applicationLinks.length === 0 ? (
            <div className={styles.emptyState}>아직 생성된 지원 링크가 없습니다.</div>
          ) : (
            <div className={styles.tableScroll}>
              <table className={styles.linkTable}>
                <thead>
                  <tr>
                    <th>Slug</th>
                    <th>회사명</th>
                    <th>라벨</th>
                    <th>포지셔닝</th>
                    <th>노출 프로젝트</th>
                    <th className={styles.num}>세션</th>
                    <th className={styles.num}>조회</th>
                    <th>최근 방문</th>
                    <th>만료</th>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {applicationLinks.map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      projectOptions={applicationProjectOptions}
                      writesEnabled={writesEnabled}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
