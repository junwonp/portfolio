import * as styles from './TrendChart.css';

export function TrafficChartLegend() {
  return (
    <ul className={styles.chartLegend}>
      <li className={styles.legendItem}>
        <span className={`${styles.legendColor} ${styles.views}`}></span>
        <span className={styles.legendText}>조회 수 (Views)</span>
      </li>
      <li className={styles.legendItem}>
        <span className={`${styles.legendColor} ${styles.sessions}`}></span>
        <span className={styles.legendText}>세션 수 (Sessions)</span>
      </li>
    </ul>
  );
}
