import { useRouter } from 'next/navigation';

import ButtonGroup from '@/components/ui/ButtonGroup';
import Card from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import SectionHeading from '@/components/ui/SectionHeading';

import * as shared from './adminShared.css';
import { TrafficChartLegend } from './TrafficChartLegend';
import { TrafficChartSvg } from './TrafficChartSvg';
import { TrafficSummaryGrid } from './TrafficSummaryGrid';
import * as styles from './TrendChart.css';
import {
  type DailyChartEntry,
  formatChartDate,
  type TrafficRange,
  type TrafficSummary,
} from './trendChartGeometry';

interface TrendChartProps {
  trafficRange: TrafficRange;
  trafficSummary: TrafficSummary;
  dailyChart: DailyChartEntry[];
  selectedApplicationLinkId: string;
}

export function TrendChart({
  trafficRange,
  trafficSummary,
  dailyChart,
  selectedApplicationLinkId,
}: TrendChartProps) {
  const router = useRouter();

  function navigateRange(value: string) {
    const params = new URLSearchParams();
    params.set('range', value);
    params.set('tab', 'analytics');
    if (selectedApplicationLinkId) {
      params.set('linkId', selectedApplicationLinkId);
    }
    router.push(`/a?${params.toString()}`, { scroll: false });
  }

  return (
    <Card
      variant="glass"
      radius="sm"
      as="section"
      className={shared.chartSection}
      aria-labelledby="traffic-chart-title"
    >
      <SectionHeading
        level={2}
        title={`${trafficRange.label} 트래픽`}
        subtitle={`${formatChartDate(trafficSummary.rangeStart, trafficRange.bucket)}–${formatChartDate(trafficSummary.rangeEnd, trafficRange.bucket)} 기준, 기록이 없는 ${trafficRange.bucket === 'month' ? '월' : '날짜'}은 0으로 표시`}
        action={
          <div className={styles.chartActions}>
            <ButtonGroup
              options={[
                { label: '7일', value: '7d' },
                { label: '30일', value: '30d' },
                { label: '1년', value: '1y' },
              ]}
              value={trafficRange.value}
              onChange={navigateRange}
              size="sm"
              ariaLabel="트래픽 기간 선택"
            />
            <div className={shared.rangeBadge}>
              {trafficSummary.activeDays}
              {trafficRange.bucket === 'month' ? '개월' : '일'} 활성
            </div>
          </div>
        }
        id="traffic-chart-title"
      />
      <TrafficChartLegend />
      <TrafficSummaryGrid bucket={trafficRange.bucket} trafficSummary={trafficSummary} />

      {dailyChart.length === 0 ? (
        <EmptyState message="트렌드 차트를 표시할 데이터가 없습니다." />
      ) : (
        <TrafficChartSvg
          bucket={trafficRange.bucket}
          dailyChart={dailyChart}
          rangeLabel={trafficRange.label}
        />
      )}
    </Card>
  );
}
