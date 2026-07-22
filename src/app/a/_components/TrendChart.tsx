import { useState } from 'react';

import * as styles from './admin.css';

interface TrendChartProps {
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
  dailyChart: { date: string; hasData: boolean; sessions: number; views: number }[];
  selectedApplicationLinkId: string;
}

export function TrendChart({
  trafficRange,
  trafficSummary,
  dailyChart,
  selectedApplicationLinkId,
}: TrendChartProps) {
  const [activeDot, setActiveDot] = useState<{
    x: number;
    ySessions: number;
    yViews: number;
    date: string;
    hasData: boolean;
    sessions: number;
    views: number;
  } | null>(null);

  const chartHeight = 220;
  const chartWidth = 700;
  const paddingBottom = 35;
  const paddingLeft = 55;
  const paddingRight = 25;
  const paddingTop = 20;

  const maxVal = Math.max(...dailyChart.map((d) => Math.max(d.sessions, d.views)), 10);
  const points = dailyChart.map((d, i) => {
    const x =
      paddingLeft +
      (i / Math.max(dailyChart.length - 1, 1)) * (chartWidth - paddingLeft - paddingRight);
    const ySessions =
      chartHeight -
      paddingBottom -
      (d.sessions / maxVal) * (chartHeight - paddingTop - paddingBottom);
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
        points
          .slice(1)
          .map((p) => `L ${p.x} ${p.ySessions}`)
          .join(' ')
      : '';
  const viewsPath =
    points.length > 0
      ? `M ${points[0].x} ${points[0].yViews} ` +
        points
          .slice(1)
          .map((p) => `L ${p.x} ${p.yViews}`)
          .join(' ')
      : '';

  function formatChartDate(date: string) {
    if (trafficRange.bucket === 'month') return date;
    return date.slice(5);
  }

  function getRangeHref(value: string) {
    if (selectedApplicationLinkId) {
      return `/a?range=${value}&linkId=${encodeURIComponent(selectedApplicationLinkId)}&tab=analytics`;
    }
    return `/a?range=${value}&tab=analytics`;
  }

  return (
    <section className={`${styles.chartSection} ${styles.glass}`}>
      <div className={styles.sectionHeadingRow}>
        <div>
          <h3>{trafficRange.label} 트래픽</h3>
          <p className={styles.sectionSubtitle}>
            {formatChartDate(trafficSummary.rangeStart)}–
            {formatChartDate(trafficSummary.rangeEnd)}
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
            {[
              { label: '7일', value: '7d' },
              { label: '30일', value: '30d' },
              { label: '1년', value: '1y' },
            ].map((opt) => (
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
            {trafficSummary.activeDays}
            {trafficRange.bucket === 'month' ? '개월' : '일'} 활성
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
          <span className={styles.summaryLabel}>
            활성 {trafficRange.bucket === 'month' ? '월' : '일'}
          </span>
          <strong>{trafficSummary.activeDays}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>
            무기록 {trafficRange.bucket === 'month' ? '월' : '일'}
          </span>
          <strong>{trafficSummary.quietDays}</strong>
        </div>
      </div>

      {dailyChart.length === 0 ? (
        <div className={styles.emptyState}>트렌드 차트를 표시할 데이터가 없습니다.</div>
      ) : (
        <div className={styles.chartWrapper}>
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className={styles.svgChart}>
            <line
              x1={paddingLeft}
              y1={paddingTop}
              x2={chartWidth - paddingRight}
              y2={paddingTop}
              className={styles.gridLine}
            />
            <line
              x1={paddingLeft}
              y1={(chartHeight - paddingTop - paddingBottom) / 2 + paddingTop}
              x2={chartWidth - paddingRight}
              y2={(chartHeight - paddingTop - paddingBottom) / 2 + paddingTop}
              className={styles.gridLine}
            />
            <line
              x1={paddingLeft}
              y1={chartHeight - paddingBottom}
              x2={chartWidth - paddingRight}
              y2={chartHeight - paddingBottom}
              className={styles.gridLine}
            />

            <text
              x={paddingLeft - 10}
              y={paddingTop + 4}
              className={`${styles.axisLabel} ${styles.yAxis}`}
              textAnchor="end"
            >
              {maxVal}
            </text>
            <text
              x={paddingLeft - 10}
              y={(chartHeight - paddingTop - paddingBottom) / 2 + paddingTop + 4}
              className={`${styles.axisLabel} ${styles.yAxis}`}
              textAnchor="end"
            >
              {Math.round(maxVal / 2)}
            </text>
            <text
              x={paddingLeft - 10}
              y={chartHeight - paddingBottom + 4}
              className={`${styles.axisLabel} ${styles.yAxis}`}
              textAnchor="end"
            >
              0
            </text>

            {points.length > 0 && (
              <text
                x={points[0].x}
                y={chartHeight - paddingBottom + 18}
                className={`${styles.axisLabel} ${styles.xAxis}`}
                textAnchor="middle"
              >
                {formatChartDate(points[0].date)}
              </text>
            )}
            {points.length > 2 && (
              <text
                x={points[Math.floor(points.length / 2)].x}
                y={chartHeight - paddingBottom + 18}
                className={`${styles.axisLabel} ${styles.xAxis}`}
                textAnchor="middle"
              >
                {formatChartDate(points[Math.floor(points.length / 2)].date)}
              </text>
            )}
            {points.length > 1 && (
              <text
                x={points[points.length - 1].x}
                y={chartHeight - paddingBottom + 18}
                className={`${styles.axisLabel} ${styles.xAxis}`}
                textAnchor="middle"
              >
                {formatChartDate(points[points.length - 1].date)}
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
        </div>
      )}
    </section>
  );
}
