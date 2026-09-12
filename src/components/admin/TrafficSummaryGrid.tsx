import * as styles from './TrendChart.css';
import type { RangeBucket, TrafficSummary } from './trendChartGeometry';

interface TrafficSummaryGridProps {
  bucket: RangeBucket;
  trafficSummary: TrafficSummary;
}

export function TrafficSummaryGrid({ bucket, trafficSummary }: TrafficSummaryGridProps) {
  return (
    <dl className={styles.trafficSummaryGrid}>
      <div className={styles.summaryItem}>
        <dt className={styles.summaryLabel}>기간 조회</dt>
        <dd>
          <strong>{trafficSummary.rangeViews}</strong>
        </dd>
      </div>
      <div className={styles.summaryItem}>
        <dt className={styles.summaryLabel}>기간 세션</dt>
        <dd>
          <strong>{trafficSummary.rangeSessions}</strong>
        </dd>
      </div>
      <div className={styles.summaryItem}>
        <dt className={styles.summaryLabel}>활성 {bucket === 'month' ? '월' : '일'}</dt>
        <dd>
          <strong>{trafficSummary.activeDays}</strong>
        </dd>
      </div>
      <div className={styles.summaryItem}>
        <dt className={styles.summaryLabel}>무기록 {bucket === 'month' ? '월' : '일'}</dt>
        <dd>
          <strong>{trafficSummary.quietDays}</strong>
        </dd>
      </div>
    </dl>
  );
}
