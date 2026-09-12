import { useState } from 'react';

import { TrafficDataTable } from './TrafficDataTable';
import * as styles from './TrendChart.css';
import {
  buildChartPoints,
  buildLinePath,
  CHART_HEIGHT,
  CHART_WIDTH,
  type ChartPoint,
  type DailyChartEntry,
  formatChartDate,
  PADDING_BOTTOM,
  PADDING_LEFT,
  PADDING_RIGHT,
  PADDING_TOP,
  type RangeBucket,
} from './trendChartGeometry';

interface TrafficChartSvgProps {
  bucket: RangeBucket;
  dailyChart: DailyChartEntry[];
  rangeLabel: string;
}

export function TrafficChartSvg({ bucket, dailyChart, rangeLabel }: TrafficChartSvgProps) {
  const [activeDot, setActiveDot] = useState<ChartPoint | null>(null);

  const { maxVal, points } = buildChartPoints(dailyChart);
  const sessionsPath = buildLinePath(points, 'ySessions');
  const viewsPath = buildLinePath(points, 'yViews');

  return (
    <figure className={styles.chartWrapper} aria-labelledby="traffic-chart-title">
      <svg
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className={styles.svgChart}
        role="img"
        aria-label={`${rangeLabel} 트래픽 추이 차트`}
      >
        <line
          x1={PADDING_LEFT}
          y1={PADDING_TOP}
          x2={CHART_WIDTH - PADDING_RIGHT}
          y2={PADDING_TOP}
          className={styles.gridLine}
        />
        <line
          x1={PADDING_LEFT}
          y1={(CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM) / 2 + PADDING_TOP}
          x2={CHART_WIDTH - PADDING_RIGHT}
          y2={(CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM) / 2 + PADDING_TOP}
          className={styles.gridLine}
        />
        <line
          x1={PADDING_LEFT}
          y1={CHART_HEIGHT - PADDING_BOTTOM}
          x2={CHART_WIDTH - PADDING_RIGHT}
          y2={CHART_HEIGHT - PADDING_BOTTOM}
          className={styles.gridLine}
        />

        <text
          x={PADDING_LEFT - 10}
          y={PADDING_TOP + 4}
          className={`${styles.axisLabel} ${styles.yAxis}`}
          textAnchor="end"
        >
          {maxVal}
        </text>
        <text
          x={PADDING_LEFT - 10}
          y={(CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM) / 2 + PADDING_TOP + 4}
          className={`${styles.axisLabel} ${styles.yAxis}`}
          textAnchor="end"
        >
          {Math.round(maxVal / 2)}
        </text>
        <text
          x={PADDING_LEFT - 10}
          y={CHART_HEIGHT - PADDING_BOTTOM + 4}
          className={`${styles.axisLabel} ${styles.yAxis}`}
          textAnchor="end"
        >
          0
        </text>

        {points.length > 0 && (
          <text
            x={points[0].x}
            y={CHART_HEIGHT - PADDING_BOTTOM + 18}
            className={`${styles.axisLabel} ${styles.xAxis}`}
            textAnchor="middle"
          >
            {formatChartDate(points[0].date, bucket)}
          </text>
        )}
        {points.length > 2 && (
          <text
            x={points[Math.floor(points.length / 2)].x}
            y={CHART_HEIGHT - PADDING_BOTTOM + 18}
            className={`${styles.axisLabel} ${styles.xAxis}`}
            textAnchor="middle"
          >
            {formatChartDate(points[Math.floor(points.length / 2)].date, bucket)}
          </text>
        )}
        {points.length > 1 && (
          <text
            x={points[points.length - 1].x}
            y={CHART_HEIGHT - PADDING_BOTTOM + 18}
            className={`${styles.axisLabel} ${styles.xAxis}`}
            textAnchor="middle"
          >
            {formatChartDate(points[points.length - 1].date, bucket)}
          </text>
        )}

        {viewsPath && (
          <path
            d={viewsPath}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {sessionsPath && (
          <path
            d={sessionsPath}
            fill="none"
            stroke="var(--color-cat-frameworks)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
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
          style={{
            left: `${activeDot.x}px`,
            top: `${Math.min(activeDot.ySessions, activeDot.yViews) - 40}px`,
          }}
        >
          <div className={styles.tooltipDate}>{activeDot.date}</div>
          {activeDot.hasData ? (
            <>
              <div className={styles.tooltipRow}>
                <span className={`${styles.dot} ${styles.green}`}></span> 세션 수:{' '}
                <strong>{activeDot.sessions}</strong>
              </div>
              <div className={styles.tooltipRow}>
                <span className={`${styles.dot} ${styles.blue}`}></span> 조회 수:{' '}
                <strong>{activeDot.views}</strong>
              </div>
            </>
          ) : (
            <div className={`${styles.tooltipRow} ${styles.muted}`}>기록 없음</div>
          )}
        </div>
      )}

      {/* Screen readers get the full series; the SVG above stays a single image. */}
      <TrafficDataTable dailyChart={dailyChart} rangeLabel={rangeLabel} />
    </figure>
  );
}
