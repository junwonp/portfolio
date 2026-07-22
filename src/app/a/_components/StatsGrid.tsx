import * as styles from './admin.css';

interface StatsGridProps {
  stats: {
    avgActiveTime: number;
    avgArticleProgress: number;
    avgDwellTime: number;
    avgScrollDepth: number;
    totalPageViews: number;
    totalSessions: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
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
      <div className={`${styles.metricCard} ${styles.glass}`}>
        <div className={styles.cardLabel}>평균 활성 시간</div>
        <div className={styles.cardValue}>{stats.avgActiveTime}초</div>
        <div className={styles.cardDesc}>탭이 실제로 보였던 시간</div>
      </div>
      <div className={`${styles.metricCard} ${styles.glass}`}>
        <div className={styles.cardLabel}>평균 본문 진행률</div>
        <div className={styles.cardValue}>{stats.avgArticleProgress}%</div>
        <div className={styles.cardDesc}>프로젝트 글 본문 기준 읽은 깊이</div>
      </div>
    </section>
  );
}
