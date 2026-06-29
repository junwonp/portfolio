'use client';

import { useRef, useState } from 'react';

import Select from '@/lib/components/Select';

import { deleteApplicationLink, logout } from './actions';
import styles from './admin.module.css';
import { LinkForm } from './LinkForm';

interface DashboardClientProps {
  stats: {
    avgDwellTime: number;
    avgScrollDepth: number;
    totalPageViews: number;
    totalSessions: number;
  };
  applicationFilterOptions: {
    companyName: string;
    id: number;
    label: string;
    slug: string;
  }[];
  applicationLinks: {
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
  dailyChart: { date: string; hasData: boolean; sessions: number; views: number }[];
  selectedApplicationLinkId: string;
  topCountries: { country: string; count: number }[];
  topPages: { path: string; avgDwell: number; avgScroll: number; views: number }[];
  topReferrers: { count: number; referrer: string }[];
  trafficRange: {
    bucket: 'day' | 'month';
    days: number;
    label: string;
    value: '7d' | '30d' | '1y';
  };
  trafficSummary: {
    activeDays: number;
    quietDays: number;
    rangeEnd: string;
    rangeSessions: number;
    rangeStart: string;
    rangeViews: number;
  };
  initialTab: 'analytics' | 'links';
  writesDisabledReason: string | null;
  writesEnabled: boolean;
}

export function DashboardClient({
  stats,
  applicationFilterOptions,
  applicationLinks,
  applicationProjectOptions,
  dailyChart,
  selectedApplicationLinkId,
  topCountries,
  topPages,
  topReferrers,
  trafficRange,
  trafficSummary,
  initialTab,
  writesDisabledReason,
  writesEnabled,
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'links'>(initialTab);
  const [activeDot, setActiveDot] = useState<{
    x: number;
    ySessions: number;
    yViews: number;
    date: string;
    hasData: boolean;
    sessions: number;
    views: number;
  } | null>(null);

  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);
  const swipeThreshold = 64;

  const chartHeight = 220;
  const chartWidth = 700;
  const paddingBottom = 35;
  const paddingLeft = 55;
  const paddingRight = 25;
  const paddingTop = 20;

  const filterOptions = [
    { value: '', label: '전체 방문' },
    ...applicationFilterOptions.map((link) => ({
      value: String(link.id),
      label: `${link.companyName} · ${link.label} · /${link.slug}`,
    })),
  ];

  const maxVal = Math.max(...dailyChart.map((d) => Math.max(d.sessions, d.views)), 10);
  const points = dailyChart.map((d, i) => {
    const x =
      paddingLeft +
      (i / Math.max(dailyChart.length - 1, 1)) * (chartWidth - paddingLeft - paddingRight);
    const ySessions =
      chartHeight - paddingBottom - (d.sessions / maxVal) * (chartHeight - paddingTop - paddingBottom);
    const yViews =
      chartHeight - paddingBottom - (d.views / maxVal) * (chartHeight - paddingTop - paddingBottom);
    return {
      x,
      ySessions,
      yViews,
      date: d.date,
      hasData: d.hasData,
      sessions: d.sessions,
      views: d.views,
    };
  });

  const sessionsPath =
    points.length > 0
      ? `M ${points[0].x} ${points[0].ySessions} ` +
        points.slice(1).map((p) => `L ${p.x} ${p.ySessions}`).join(' ')
      : '';
  const viewsPath =
    points.length > 0
      ? `M ${points[0].x} ${points[0].yViews} ` +
        points.slice(1).map((p) => `L ${p.x} ${p.yViews}`).join(' ')
      : '';

  function formatChartDate(date: string) {
    if (trafficRange.bucket === 'month') return date;
    return date.slice(5);
  }

  function formatDateTime(value: string | null) {
    if (!value) return '-';
    return value.replace('T', ' ').slice(0, 16);
  }

  function formatProjectTitle(projectId: string) {
    return applicationProjectOptions.find((p) => p.id === projectId)?.title ?? projectId;
  }

  function formatPositioning(role: 'web' | 'mobile' | 'ai' | null, summaryPreset: string) {
    if (role === 'web' && summaryPreset === 'ops-data') return '운영/데이터 웹';
    if (role === 'web' && summaryPreset === 'web-rn') return '웹/모바일 공유 구조';
    if (role === 'web') return '웹 프론트엔드';
    if (role === 'mobile') return '모바일 프론트엔드';
    if (role === 'ai') return 'AI 활용 프론트엔드';
    return '기본 포트폴리오';
  }

  function getRangeHref(value: string) {
    if (selectedApplicationLinkId) {
      return `/a?range=${value}&linkId=${encodeURIComponent(selectedApplicationLinkId)}&tab=analytics`;
    }
    return `/a?range=${value}&tab=analytics`;
  }

  function handleSwipeStart(e: React.PointerEvent) {
    if (!e.isPrimary) return;
    swipeStartX.current = e.clientX;
    swipeStartY.current = e.clientY;
  }

  function handleSwipeEnd(e: React.PointerEvent) {
    if (swipeStartX.current === null || swipeStartY.current === null) return;
    const deltaX = e.clientX - swipeStartX.current;
    const deltaY = e.clientY - swipeStartY.current;
    swipeStartX.current = null;
    swipeStartY.current = null;

    if (Math.abs(deltaX) < swipeThreshold || Math.abs(deltaX) < Math.abs(deltaY)) return;

    if (deltaX < 0) {
      setActiveTab('links');
    } else {
      setActiveTab('analytics');
    }
  }

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div>
          <h1>분석 대시보드</h1>
          <p className={styles.subtitle}>Cloudflare Edge 기반 실시간 방문자 행동 분석</p>
        </div>
        <form action={logout}>
          <button type="submit" className={styles.logoutBtn}>로그아웃</button>
        </form>
      </header>

      <section className={`${styles.dashboardViewSwitcher} ${styles.glass}`} aria-label="대시보드 화면 선택">
        <div className={styles.switcherCopy}>
          <span>{activeTab === 'analytics' ? '기본 화면' : '관리 화면'}</span>
          <strong>{activeTab === 'analytics' ? '분석 지표' : '지원 링크 생성 및 관리'}</strong>
        </div>
        <div className={styles.segmentedControl} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'analytics'}
            className={activeTab === 'analytics' ? styles.active : ''}
            onClick={() => setActiveTab('analytics')}
          >
            분석
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'links'}
            className={activeTab === 'links' ? styles.active : ''}
            onClick={() => setActiveTab('links')}
          >
            링크
          </button>
        </div>
      </section>

      <div
        className={styles.dashboardSwipeViewport}
        role="region"
        onPointerDown={handleSwipeStart}
        onPointerUp={handleSwipeEnd}
        onPointerCancel={() => {
          swipeStartX.current = null;
          swipeStartY.current = null;
        }}
      >
        {activeTab === 'analytics' ? (
          <div className={styles.dashboardPanel} role="tabpanel">
            <section className={`${styles.metricFilterCard} ${styles.glass}`} aria-labelledby="metric-filter-title">
              <div>
                <h3 id="metric-filter-title">지표 범위</h3>
                <p className={styles.sectionSubtitle}>
                  전체 방문 또는 특정 회사/라벨 링크 기준으로 지표를 나눠 봅니다.
                </p>
              </div>
              <form className={styles.metricFilterForm} method="GET" action="/a">
                <input type="hidden" name="range" value={trafficRange.value} />
                <input type="hidden" name="tab" value="analytics" />
                <label>
                  <span>회사 / 라벨</span>
                  <Select
                    name="linkId"
                    value={selectedApplicationLinkId}
                    options={filterOptions}
                    onChange={(val) => {
                      const form = document.querySelector<HTMLFormElement>(`.${styles.metricFilterForm}`);
                      if (form) {
                        const input = form.querySelector<HTMLInputElement>('input[name="linkId"]');
                        if (input) {
                          input.value = val;
                        }
                        form.submit();
                      }
                    }}
                  />
                </label>
              </form>
            </section>

            <section className={styles.metricsGrid}>
              <div className={`${styles.metricCard} ${styles.glass}`}>
                <div className={styles.cardLabel}>총 세션 수</div>
                <div className={styles.cardValue}>{stats.totalSessions}</div>
                <div className={styles.cardDesc}>고유 방문자 수 (어드민 제외)</div>
              </div>
              <div className={`${styles.metricCard} ${styles.glass}`}>
                <div className={styles.cardLabel}>총 페이지 뷰</div>
                <div className={styles.cardValue}>{stats.totalPageViews}</div>
                <div className={styles.cardDesc}>누적 기록된 페이지 조회 수</div>
              </div>
              <div className={`${styles.metricCard} ${styles.glass}`}>
                <div className={styles.cardLabel}>평균 체류 시간</div>
                <div className={styles.cardValue}>{stats.avgDwellTime}초</div>
                <div className={styles.cardDesc}>페이지별 평균 머무른 시간</div>
              </div>
              <div className={`${styles.metricCard} ${styles.glass}`}>
                <div className={styles.cardLabel}>평균 스크롤 깊이</div>
                <div className={styles.cardValue}>{stats.avgScrollDepth}%</div>
                <div className={styles.cardDesc}>사용자가 페이지를 내려본 평균 비율</div>
              </div>
            </section>

            <section className={`${styles.chartSection} ${styles.glass}`}>
              <div className={styles.sectionHeadingRow}>
                <div>
                  <h3>{trafficRange.label} 트래픽</h3>
                  <p className={styles.sectionSubtitle}>
                    {formatChartDate(trafficSummary.rangeStart)}–{formatChartDate(trafficSummary.rangeEnd)}
                    기준, 기록이 없는 {trafficRange.bucket === 'month' ? '월' : '날짜'}은 0으로 표시
                  </p>
                  <div className={styles.chartLegend}>
                    <span className={styles.legendItem}>
                      <span className={`${styles.legendColor} ${styles.views}`}></span>
                      <span className={styles.legendText}>조회 수 (Views)</span>
                    </span>
                    <span className={styles.legendItem}>
                      <span className={`${styles.legendColor} ${styles.sessions}`}></span>
                      <span className={styles.legendText}>세션 수 (Sessions)</span>
                    </span>
                  </div>
                </div>
                <div className={styles.chartActions}>
                  <div className={styles.rangeTabs} aria-label="트래픽 기간 선택">
                    {[{ label: '7일', value: '7d' }, { label: '30일', value: '30d' }, { label: '1년', value: '1y' }].map((opt) => (
                      <a
                        key={opt.value}
                        className={trafficRange.value === opt.value ? styles.active : ''}
                        href={getRangeHref(opt.value)}
                      >
                        {opt.label}
                      </a>
                    ))}
                  </div>
                  <div className={styles.rangeBadge}>
                    {trafficSummary.activeDays}{trafficRange.bucket === 'month' ? '개월' : '일'} 활성
                  </div>
                </div>
              </div>

              <div className={styles.trafficSummaryGrid}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>기간 조회</span>
                  <strong>{trafficSummary.rangeViews}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>기간 세션</span>
                  <strong>{trafficSummary.rangeSessions}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>활성 {trafficRange.bucket === 'month' ? '월' : '일'}</span>
                  <strong>{trafficSummary.activeDays}</strong>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>무기록 {trafficRange.bucket === 'month' ? '월' : '일'}</span>
                  <strong>{trafficSummary.quietDays}</strong>
                </div>
              </div>

              {dailyChart.length === 0 ? (
                <div className={styles.emptyState}>트렌드 차트를 표시할 데이터가 없습니다.</div>
              ) : (
                <div className={styles.chartWrapper}>
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className={styles.svgChart}>
                    <line x1={paddingLeft} y1={paddingTop} x2={chartWidth - paddingRight} y2={paddingTop} className={styles.gridLine} />
                    <line
                      x1={paddingLeft}
                      y1={(chartHeight - paddingTop - paddingBottom) / 2 + paddingTop}
                      x2={chartWidth - paddingRight}
                      y2={(chartHeight - paddingTop - paddingBottom) / 2 + paddingTop}
                      className={styles.gridLine}
                    />
                    <line x1={paddingLeft} y1={chartHeight - paddingBottom} x2={chartWidth - paddingRight} y2={chartHeight - paddingBottom} className={styles.gridLine} />

                    <text x={paddingLeft - 10} y={paddingTop + 4} className={`${styles.axisLabel} ${styles.yAxis}`} textAnchor="end">{maxVal}</text>
                    <text x={paddingLeft - 10} y={(chartHeight - paddingTop - paddingBottom) / 2 + paddingTop + 4} className={`${styles.axisLabel} ${styles.yAxis}`} textAnchor="end">{Math.round(maxVal / 2)}</text>
                    <text x={paddingLeft - 10} y={chartHeight - paddingBottom + 4} className={`${styles.axisLabel} ${styles.yAxis}`} textAnchor="end">0</text>

                    {points.length > 0 && (
                      <text x={points[0].x} y={chartHeight - paddingBottom + 18} className={`${styles.axisLabel} ${styles.xAxis}`} textAnchor="middle">
                        {formatChartDate(points[0].date)}
                      </text>
                    )}
                    {points.length > 2 && (
                      <text x={points[Math.floor(points.length / 2)].x} y={chartHeight - paddingBottom + 18} className={`${styles.axisLabel} ${styles.xAxis}`} textAnchor="middle">
                        {formatChartDate(points[Math.floor(points.length / 2)].date)}
                      </text>
                    )}
                    {points.length > 1 && (
                      <text x={points[points.length - 1].x} y={chartHeight - paddingBottom + 18} className={`${styles.axisLabel} ${styles.xAxis}`} textAnchor="middle">
                        {formatChartDate(points[points.length - 1].date)}
                      </text>
                    )}

                    {viewsPath && (
                      <path d={viewsPath} fill="none" stroke="var(--color-primary)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    )}
                    {sessionsPath && (
                      <path d={sessionsPath} fill="none" stroke="var(--color-cat-frameworks)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    )}

                    {points.map((pt) => (
                      <g key={pt.date}>
                        <circle
                          cx={pt.x}
                          cy={pt.yViews}
                          r={activeDot?.date === pt.date ? '7' : '4'}
                          fill="var(--color-primary)"
                          className={`${styles.interactiveDot} ${!pt.hasData ? styles.noData : ''}`}
                          onMouseEnter={() => setActiveDot(pt)}
                          onMouseLeave={() => setActiveDot(null)}
                        />
                        <circle
                          cx={pt.x}
                          cy={pt.ySessions}
                          r={activeDot?.date === pt.date ? '7' : '4'}
                          fill="var(--color-cat-frameworks)"
                          className={`${styles.interactiveDot} ${!pt.hasData ? styles.noData : ''}`}
                          onMouseEnter={() => setActiveDot(pt)}
                          onMouseLeave={() => setActiveDot(null)}
                        />
                      </g>
                    ))}
                  </svg>

                  {activeDot && (
                    <div
                      className={styles.chartTooltip}
                      style={{ left: `${activeDot.x}px`, top: `${Math.min(activeDot.ySessions, activeDot.yViews) - 40}px` }}
                    >
                      <div className={styles.tooltipDate}>{activeDot.date}</div>
                      {activeDot.hasData ? (
                        <>
                          <div className={styles.tooltipRow}>
                            <span className={`${styles.dot} ${styles.green}`}></span> 세션 수: <strong>{activeDot.sessions}</strong>
                          </div>
                          <div className={styles.tooltipRow}>
                            <span className={`${styles.dot} ${styles.blue}`}></span> 조회 수: <strong>{activeDot.views}</strong>
                          </div>
                        </>
                      ) : (
                        <div className={`${styles.tooltipRow} ${styles.muted}`}>기록 없음</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>

            <div className={styles.detailsGrid}>
              <div className={`${styles.detailsCard} ${styles.glass} ${styles.tableCard}`}>
                <h3>가장 많이 방문한 페이지</h3>
                {topPages.length === 0 ? (
                  <div className={styles.emptyState}>아직 기록된 방문자 정보가 없습니다.</div>
                ) : (
                  <div className={styles.tableScroll}>
                    <table>
                      <thead>
                        <tr>
                          <th>페이지 경로</th>
                          <th className={styles.num}>조회 수</th>
                          <th className={styles.num}>평균 체류</th>
                          <th className={styles.num}>평균 스크롤</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPages.map((page) => (
                          <tr key={page.path}>
                            <td className={styles.pathCell} title={page.path}>{page.path}</td>
                            <td className={styles.num}>{page.views}</td>
                            <td className={styles.num}>{page.avgDwell}초</td>
                            <td className={styles.num}>{page.avgScroll}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className={`${styles.detailsCard} ${styles.glass} ${styles.flexCard}`}>
                <div className={styles.subSection}>
                  <h3>주요 유입 소스 (Referrer)</h3>
                  {topReferrers.length === 0 ? (
                    <div className={styles.emptyState}>기록된 유입 경로 정보가 없습니다.</div>
                  ) : (
                    <ul className={styles.progressList}>
                      {topReferrers.map((ref) => (
                        <li key={ref.referrer}>
                          <div className={styles.listLabel}>
                            <span className={styles.labelText} title={ref.referrer}>{ref.referrer}</span>
                            <span className={styles.labelVal}>{ref.count}</span>
                          </div>
                          <div className={styles.progressBar}>
                            <div
                              className={`${styles.progressFill} ${styles.blue}`}
                              style={{ width: `${(ref.count / Math.max(...topReferrers.map(r => r.count))) * 100}%` }}
                            ></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={`${styles.subSection} ${styles.spacerTop}`}>
                  <h3>주요 접속 국가</h3>
                  {topCountries.length === 0 ? (
                    <div className={styles.emptyState}>기록된 국가 정보가 없습니다.</div>
                  ) : (
                    <ul className={styles.progressList}>
                      {topCountries.map((c) => (
                        <li key={c.country}>
                          <div className={styles.listLabel}>
                            <span className={styles.labelText}>{c.country === 'unknown' ? '직접 유입 / VPN' : c.country}</span>
                            <span className={styles.labelVal}>{c.count}</span>
                          </div>
                          <div className={styles.progressBar}>
                            <div
                              className={`${styles.progressFill} ${styles.green}`}
                              style={{ width: `${(c.count / Math.max(...topCountries.map(co => co.count))) * 100}%` }}
                            ></div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.dashboardPanel} role="tabpanel">
            <section className={`${styles.applicationLinkCard} ${styles.glass}`} aria-labelledby="link-create-title">
              <div className={styles.applicationLinkPanel}>
                <div className={styles.sectionHeadingRow}>
                  <div>
                    <h3 id="link-create-title">지원 링크 생성</h3>
                    <p className={styles.sectionSubtitle}>회사별 짧은 URL과 맞춤 프로젝트 순서를 설정합니다.</p>
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

            <section className={`${styles.applicationLinkCard} ${styles.glass}`} aria-labelledby="link-list-title">
              <div className={styles.applicationLinkPanel}>
                <div className={styles.sectionHeadingRow}>
                  <div>
                    <h3 id="link-list-title">생성된 링크</h3>
                    <p className={styles.sectionSubtitle}>활성 링크의 설정과 회사별 방문 지표를 확인합니다.</p>
                  </div>
                  <div className={styles.rangeBadge}>
                    {applicationLinks.length}개 활성 링크
                  </div>
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
                        <th>최근 방문</th>
                        <th>만료</th>
                        <th className={styles.actionCell}>관리</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicationLinks.length === 0 ? (
                        <tr>
                          <td colSpan={9} className={styles.emptyTableCell}>아직 생성된 지원 링크가 없습니다.</td>
                        </tr>
                      ) : (
                        applicationLinks.map((link) => (
                          <tr key={link.id}>
                            <td className={styles.pathCell}>
                              <a href={`/${link.slug}`} target="_blank" rel="noopener noreferrer">/{link.slug}</a>
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
                                          <li key={projectId}>{index + 1}. {formatProjectTitle(projectId)}</li>
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
                            <td>{formatDateTime(link.lastSeenAt)}</td>
                            <td>{formatDateTime(link.expiresAt)}</td>
                            <td className={styles.actionCell}>
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
        )}
      </div>
    </div>
  );
}
