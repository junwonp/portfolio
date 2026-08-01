import MetricCard from '@/components/ui/MetricCard';

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
      <MetricCard
        value={String(stats.totalSessions)}
        label="총 세션 수"
        description="고유 방문자 수 (어드민 제외)"
      />
      <MetricCard
        value={String(stats.totalPageViews)}
        label="총 페이지 뷰"
        description="누적 기록된 페이지 조회 수"
      />
      <MetricCard
        value={`${stats.avgDwellTime}초`}
        label="평균 체류 시간"
        description="페이지별 평균 머무른 시간"
      />
      <MetricCard
        value={`${stats.avgScrollDepth}%`}
        label="평균 스크롤 깊이"
        description="사용자가 페이지를 내려본 평균 비율"
      />
      <MetricCard
        value={`${stats.avgActiveTime}초`}
        label="평균 활성 시간"
        description="탭이 실제로 보였던 시간"
      />
      <MetricCard
        value={`${stats.avgArticleProgress}%`}
        label="평균 본문 진행률"
        description="프로젝트 글 본문 기준 읽은 깊이"
      />
    </section>
  );
}
