import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import ProgressBar from '@/components/ui/ProgressBar';
import SectionHeading from '@/components/ui/SectionHeading';

import * as shared from './adminShared.css';
import * as styles from './DetailsGrid.css';

interface DetailsGridProps {
  topPages: {
    avgActive: number;
    avgArticleProgress: number;
    avgDwell: number;
    avgScroll: number;
    path: string;
    views: number;
  }[];
  topReferrers: { count: number; referrer: string }[];
  topCountries: { country: string; count: number }[];
  webVitals: {
    avgValue: number;
    good: number;
    metricName: string;
    needsImprovement: number;
    poor: number;
    samples: number;
  }[];
}

export function DetailsGrid({ topPages, topReferrers, topCountries, webVitals }: DetailsGridProps) {
  return (
    <div className={styles.detailsGrid}>
      <Card variant="glass" radius="sm" className={`${styles.detailsCard} ${styles.tableCard}`}>
        <SectionHeading level={3} title="가장 많이 방문한 페이지" />
        {topPages.length === 0 ? (
          <EmptyState message="아직 기록된 방문자 정보가 없습니다." />
        ) : (
          <div className={shared.tableScroll}>
            <table>
              <thead>
                <tr>
                  <th>페이지 경로</th>
                  <th className={shared.num}>조회 수</th>
                  <th className={shared.num}>평균 체류</th>
                  <th className={shared.num}>활성 시간</th>
                  <th className={`${shared.num} ${styles.progressHeaderCell}`}>평균 스크롤</th>
                  <th className={`${shared.num} ${styles.progressHeaderCell}`}>본문 진행</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page) => (
                  <tr key={page.path}>
                    <td className={styles.pathCell} title={page.path}>
                      {page.path}
                    </td>
                    <td className={shared.num}>{page.views}</td>
                    <td className={shared.num}>{page.avgDwell}초</td>
                    <td className={shared.num}>{page.avgActive}초</td>
                    <td className={shared.num}>
                      <span className={styles.miniProgressCell}>
                        <span className={styles.miniProgressBar}>
                          <span
                            className={`${styles.miniProgressFill} ${styles.scrollBar}`}
                            style={{ width: `${page.avgScroll}%` }}
                          />
                        </span>
                        <span className={styles.miniProgressVal}>{page.avgScroll}%</span>
                      </span>
                    </td>
                    <td className={shared.num}>
                      <span className={styles.miniProgressCell}>
                        <span className={styles.miniProgressBar}>
                          <span
                            className={`${styles.miniProgressFill} ${styles.readBar}`}
                            style={{ width: `${page.avgArticleProgress}%` }}
                          />
                        </span>
                        <span className={styles.miniProgressVal}>{page.avgArticleProgress}%</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card variant="glass" radius="sm" className={`${styles.detailsCard} ${styles.flexCard}`}>
        <div className={styles.subSection}>
          <SectionHeading level={3} title="주요 유입 소스 (Referrer)" />
          {topReferrers.length === 0 ? (
            <EmptyState message="기록된 유입 경로 정보가 없습니다." />
          ) : (
            <ul className={styles.progressList}>
              {topReferrers.map((ref) => (
                <li key={ref.referrer}>
                  <div className={styles.listLabel}>
                    <span className={styles.labelText} title={ref.referrer}>
                      {ref.referrer}
                    </span>
                    <span className={styles.labelVal}>{ref.count}</span>
                  </div>
                  <ProgressBar
                    value={(ref.count / Math.max(...topReferrers.map((r) => r.count))) * 100}
                    tone="success"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${styles.subSection} ${shared.spacerTop}`}>
          <SectionHeading level={3} title="주요 접속 국가" />
          {topCountries.length === 0 ? (
            <EmptyState message="기록된 국가 정보가 없습니다." />
          ) : (
            <ul className={styles.progressList}>
              {topCountries.map((c) => (
                <li key={c.country}>
                  <div className={styles.listLabel}>
                    <span className={styles.labelText}>
                      {c.country === 'unknown' ? '직접 유입 / VPN' : c.country}
                    </span>
                    <span className={styles.labelVal}>{c.count}</span>
                  </div>
                  <ProgressBar
                    value={(c.count / Math.max(...topCountries.map((co) => co.count))) * 100}
                    tone="primary"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${styles.subSection} ${shared.spacerTop}`}>
          <SectionHeading level={3} title="코어 웹 바이탈" />
          {webVitals.length === 0 ? (
            <EmptyState message="기록된 Web Vitals 샘플이 없습니다." />
          ) : (
            <ul className={styles.progressList}>
              {webVitals.map((metric) => (
                <li key={metric.metricName}>
                  <div className={styles.listLabel}>
                    <span className={styles.labelText}>{metric.metricName}</span>
                    <span className={styles.labelVal}>
                      {metric.avgValue} · {metric.samples}회
                    </span>
                  </div>
                  <div className={styles.mutedText}>
                    좋음 {metric.good} · 개선 필요 {metric.needsImprovement} · 나쁨 {metric.poor}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
