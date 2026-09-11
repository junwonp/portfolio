import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeading from '@/components/ui/SectionHeading';

import * as shared from './adminShared.css';
import * as styles from './DashboardLinksPanel.css';
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
    <div className={shared.dashboardPanel} role="tabpanel">
      <Card
        variant="glass"
        radius="sm"
        as="section"
        className={styles.applicationLinkCard}
        aria-labelledby="link-create-title"
      >
        <div className={styles.applicationLinkPanel}>
          <SectionHeading
            level={3}
            title="지원 링크 생성"
            subtitle={`회사별 짧은 URL과 맞춤 프로젝트 순서를 설정합니다.${writesDisabledReason ? ` ${writesDisabledReason}` : ''}`}
            id="link-create-title"
          />
          <LinkForm
            applicationProjectOptions={applicationProjectOptions}
            writesEnabled={writesEnabled}
          />
        </div>
      </Card>

      <Card
        variant="glass"
        radius="sm"
        as="section"
        className={styles.applicationLinkCard}
        aria-labelledby="link-list-title"
      >
        <div className={styles.applicationLinkPanel}>
          <SectionHeading
            level={3}
            title="생성된 링크"
            subtitle="활성 링크 목록입니다. 상세 지표는 분석 화면에서 확인하세요."
            action={<div className={shared.rangeBadge}>{applicationLinks.length}개 활성 링크</div>}
            id="link-list-title"
          />

          {applicationLinks.length === 0 ? (
            <EmptyState message="아직 생성된 지원 링크가 없습니다." />
          ) : (
            <div className={shared.tableScroll}>
              <table className={styles.linkTable}>
                <thead>
                  <tr>
                    <th>Slug</th>
                    <th>회사명</th>
                    <th>라벨</th>
                    <th>포지셔닝</th>
                    <th>노출 프로젝트</th>
                    <th className={shared.num}>세션</th>
                    <th className={shared.num}>조회</th>
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
      </Card>
    </div>
  );
}
