import styles from './admin.module.css';

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

export function DetailsGrid({
  topPages,
  topReferrers,
  topCountries,
  webVitals,
}: DetailsGridProps) {
  return (
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
                  <th className={styles.num}>활성 시간</th>
                  <th className={styles.num}>평균 스크롤</th>
                  <th className={styles.num}>본문 진행</th>
                </tr>
              </thead>
              <tbody>
                {topPages.map((page) => (
                  <tr key={page.path}>
                    <td className={styles.pathCell} title={page.path}>
                      {page.path}
                    </td>
                    <td className={styles.num}>{page.views}</td>
                    <td className={styles.num}>{page.avgDwell}초</td>
                    <td className={styles.num}>{page.avgActive}초</td>
                    <td className={styles.num}>{page.avgScroll}%</td>
                    <td className={styles.num}>{page.avgArticleProgress}%</td>
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
                    <span className={styles.labelText} title={ref.referrer}>
                      {ref.referrer}
                    </span>
                    <span className={styles.labelVal}>{ref.count}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${styles.blue}`}
                      style={{
                        width: `${(ref.count / Math.max(...topReferrers.map((r) => r.count))) * 100}%`,
                      }}
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
                    <span className={styles.labelText}>
                      {c.country === 'unknown' ? '직접 유입 / VPN' : c.country}
                    </span>
                    <span className={styles.labelVal}>{c.count}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={`${styles.progressFill} ${styles.green}`}
                      style={{
                        width: `${(c.count / Math.max(...topCountries.map((co) => co.count))) * 100}%`,
                      }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={`${styles.subSection} ${styles.spacerTop}`}>
          <h3>Core Web Vitals</h3>
          {webVitals.length === 0 ? (
            <div className={styles.emptyState}>기록된 Web Vitals 샘플이 없습니다.</div>
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
                    good {metric.good} · needs {metric.needsImprovement} · poor{' '}
                    {metric.poor}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
