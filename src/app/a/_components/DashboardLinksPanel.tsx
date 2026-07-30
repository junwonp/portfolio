'use client';

import { formatDateTime } from '@/lib/utils/date';

import * as styles from './admin.css';
import { LinkForm } from './LinkForm';

import { deleteApplicationLink } from '../actions';

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

function formatPositioning(role: 'web' | 'mobile' | 'ai' | null, summaryPreset: string) {
  if (role === 'web' && summaryPreset === 'ops-data') return '운영/데이터 웹';
  if (role === 'web' && summaryPreset === 'web-rn') return '웹/모바일 공유 구조';
  if (role === 'web') return '웹 프론트엔드';
  if (role === 'mobile') return '모바일 프론트엔드';
  if (role === 'ai') return 'AI 활용 프론트엔드';
  return '기본 포트폴리오';
}

function formatProjectTitle(projectId: string, projectOptions: { id: string; title: string }[]) {
  return projectOptions.find((p) => p.id === projectId)?.title ?? projectId;
}

function LinkCard({
  link,
  projectOptions,
  writesEnabled,
}: {
  link: DashboardLinksPanelProps['applicationLinks'][number];
  projectOptions: { id: string; title: string }[];
  writesEnabled: boolean;
}) {
  return (
    <div className={styles.linkCard}>
      <div className={styles.linkCardHeader}>
        <div className={styles.linkCardSlugRow}>
          <a
            href={`/${link.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.linkCardSlug}
          >
            /{link.slug}
          </a>
          <span className={styles.linkCardBadge}>{formatPositioning(link.role, link.summaryPreset)}</span>
        </div>
        <strong className={styles.linkCardCompany}>{link.companyName}</strong>
        <span className={styles.linkCardLabel}>{link.label}</span>
      </div>

      {link.projectIds.length > 0 && (
        <div className={styles.linkCardProjects}>
          <span className={styles.linkCardSectionLabel}>노출 프로젝트</span>
          <ul className={styles.linkCardProjectList}>
            {link.projectIds.map((pid, i) => (
              <li key={pid}>
                {i + 1}. {formatProjectTitle(pid, projectOptions)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.linkCardMetrics}>
        <div className={styles.linkMetric}>
          <span className={styles.linkMetricValue}>{link.sessions}</span>
          <span className={styles.linkMetricLabel}>세션</span>
        </div>
        <div className={styles.linkMetric}>
          <span className={styles.linkMetricValue}>{link.views}</span>
          <span className={styles.linkMetricLabel}>조회</span>
        </div>
        <div className={styles.linkMetric}>
          <span className={styles.linkMetricValue}>{link.avgDwellTime}초</span>
          <span className={styles.linkMetricLabel}>평균 체류</span>
        </div>
        <div className={styles.linkMetric}>
          <span className={styles.linkMetricValue}>{link.avgActiveTime}초</span>
          <span className={styles.linkMetricLabel}>활성 시간</span>
        </div>
        <div className={styles.linkMetric}>
          <div className={styles.linkMetricProgress}>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${styles.blue}`}
                style={{ width: `${link.avgScrollDepth}%` }}
              />
            </div>
            <span className={styles.linkMetricValue}>{link.avgScrollDepth}%</span>
          </div>
          <span className={styles.linkMetricLabel}>스크롤 깊이</span>
        </div>
        <div className={styles.linkMetric}>
          <div className={styles.linkMetricProgress}>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${styles.green}`}
                style={{ width: `${link.avgArticleProgress}%` }}
              />
            </div>
            <span className={styles.linkMetricValue}>{link.avgArticleProgress}%</span>
          </div>
          <span className={styles.linkMetricLabel}>본문 진행</span>
        </div>
      </div>

      {link.interactionLabels.length > 0 && (
        <div className={styles.linkCardInteractions}>
          <div className={styles.linkCardInteractionsHeader}>
            <span className={styles.linkCardSectionLabel}>펼쳐본 아코디언</span>
            <span className={styles.linkCardInteractionCount}>{link.interactionCount}회</span>
          </div>
          <ul className={styles.linkCardInteractionList}>
            {link.interactionLabels.map((label) => (
              <li key={label} className={styles.linkCardInteractionTag}>{label}</li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.linkCardFooter}>
        <div className={styles.linkCardDates}>
          {link.lastSeenAt && (
            <span className={styles.linkCardDate}>
              최근 방문: {formatDateTime(link.lastSeenAt)}
            </span>
          )}
          <span className={styles.linkCardDate}>
            만료: {formatDateTime(link.expiresAt)}
          </span>
        </div>
        <div className={styles.linkCardActions}>
          <a
            href={`/print?slug=${link.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.printBtn}
          >
            인쇄
          </a>
          <form
            action={deleteApplicationLink}
            onSubmit={(e) => {
              if (!writesEnabled) {
                e.preventDefault();
                return;
              }
              if (!confirm(`/${link.slug} 링크를 삭제할까요?`)) {
                e.preventDefault();
              }
            }}
          >
            <input type="hidden" name="linkId" value={link.id} />
            <button
              type="submit"
              className={styles.dangerBtn}
              disabled={!writesEnabled}
              title={
                writesEnabled
                  ? undefined
                  : 'develop 환경에서는 production 데이터 보호를 위해 삭제가 비활성화됩니다.'
              }
            >
              삭제
            </button>
          </form>
        </div>
      </div>
    </div>
  );
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
                활성 링크의 설정과 회사별 방문 지표를 확인합니다.
              </p>
            </div>
            <div className={styles.rangeBadge}>{applicationLinks.length}개 활성 링크</div>
          </div>

          {applicationLinks.length === 0 ? (
            <div className={styles.emptyState}>아직 생성된 지원 링크가 없습니다.</div>
          ) : (
            <div className={styles.linkCardGrid}>
              {applicationLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  projectOptions={applicationProjectOptions}
                  writesEnabled={writesEnabled}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
