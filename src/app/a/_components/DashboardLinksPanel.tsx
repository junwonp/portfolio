'use client';

import type { RecentSession } from '@/lib/server/admin/dashboardData';
import { formatDateTime } from '@/lib/utils/date';

import styles from './admin.module.css';
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

// Pure helper function at module scope to avoid reallocation on render
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
          <div className={`${styles.tableScroll} ${styles.applicationTable}`}>
            <table>
              <thead>
                <tr>
                  <th>링크</th>
                  <th>회사</th>
                  <th>설정</th>
                  <th className={styles.num}>세션</th>
                  <th className={styles.num}>조회</th>
                  <th className={styles.num}>평균 체류</th>
                  <th className={styles.num}>활성</th>
                  <th className={styles.num}>본문</th>
                  <th>최근 방문</th>
                  <th>만료</th>
                  <th className={styles.actionCell}>관리</th>
                </tr>
              </thead>
              <tbody>
                {applicationLinks.length === 0 ? (
                  <tr>
                    <td colSpan={11} className={styles.emptyTableCell}>
                      아직 생성된 지원 링크가 없습니다.
                    </td>
                  </tr>
                ) : (
                  applicationLinks.map((link) => (
                    <tr key={link.id}>
                      <td className={styles.pathCell}>
                        <a href={`/${link.slug}`} target="_blank" rel="noopener noreferrer">
                          /{link.slug}
                        </a>
                      </td>
                      <td>
                        <strong>{link.companyName}</strong>
                        <div className={styles.mutedText}>{link.label}</div>
                      </td>
                      <td>
                        <dl className={styles.linkConfigList}>
                          <div>
                            <dt>포지셔닝</dt>
                            <dd>{formatPositioning(link.role, link.summaryPreset)}</dd>
                          </div>
                          <div>
                            <dt>프로젝트</dt>
                            <dd>
                              {link.projectIds.length > 0 ? (
                                <ol className={styles.projectOrderList}>
                                  {link.projectIds.map((projectId, index) => (
                                    <li key={projectId}>
                                      {index + 1}. {formatProjectTitle(projectId, applicationProjectOptions)}
                                    </li>
                                  ))}
                                </ol>
                              ) : (
                                '지정 없음'
                              )}
                            </dd>
                          </div>
                        </dl>
                      </td>
                      <td className={styles.num}>{link.sessions}</td>
                      <td className={styles.num}>{link.views}</td>
                      <td className={styles.num}>{link.avgDwellTime}초</td>
                      <td className={styles.num}>{link.avgActiveTime}초</td>
                      <td className={styles.num}>{link.avgArticleProgress}%</td>
                      <td>{formatDateTime(link.lastSeenAt)}</td>
                      <td>{formatDateTime(link.expiresAt)}</td>
                      <td className={styles.actionCell}>
                        <div style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center' }}>
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
