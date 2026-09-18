// @vitest-environment jsdom
// @module-tag dom
import { cleanup, render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { TrafficChartSvg } from '@/components/admin/TrafficChartSvg';
import * as styles from '@/components/admin/TrendChart.css';
import {
  buildChartPoints,
  buildLinePath,
  type DailyChartEntry,
} from '@/components/admin/trendChartGeometry';

const DAILY_CHART: DailyChartEntry[] = [
  { date: '2026-01-01', hasData: true, sessions: 2, views: 7 },
  { date: '2026-01-02', hasData: true, sessions: 5, views: 21 },
  { date: '2026-01-03', hasData: false, sessions: 0, views: 0 },
];

type ChartProps = Parameters<typeof TrafficChartSvg>[0];

const renderChart = (overrides: Partial<ChartProps> = {}): ReturnType<typeof render> =>
  render(
    <TrafficChartSvg bucket="day" dailyChart={DAILY_CHART} rangeLabel="최근 30일" {...overrides} />,
  );

const circlesOf = (container: HTMLElement): NodeListOf<SVGCircleElement> =>
  container.querySelectorAll('circle');

afterEach(() => {
  cleanup();
});

describe('TrafficChartSvg', () => {
  it('frames the chart as a labelled figure with a single image role', () => {
    const { container } = renderChart();
    const figure = container.querySelector('figure');
    const svg = screen.getByRole('img');

    expect(figure).toHaveClass(styles.chartWrapper);
    expect(figure).toHaveAttribute('aria-labelledby', 'traffic-chart-title');
    expect(svg).toHaveClass(styles.svgChart);
    expect(svg).toHaveAttribute('aria-label', '최근 30일 트래픽 추이 차트');
    expect(svg).toHaveAttribute('viewBox', '0 0 700 220');
  });

  it('draws the three horizontal grid lines at the padded frame positions', () => {
    const { container } = renderChart();
    const lines = container.querySelectorAll('line');

    expect(lines).toHaveLength(3);
    for (const line of lines) {
      expect(line).toHaveClass(styles.gridLine);
      expect(line.getAttribute('x1')).toBe('55');
      expect(line.getAttribute('x2')).toBe('675');
      expect(line.getAttribute('y1')).toBe(line.getAttribute('y2'));
    }
    expect(lines[0].getAttribute('y1')).toBe('20');
    expect(lines[1].getAttribute('y1')).toBe('102.5');
    expect(lines[2].getAttribute('y1')).toBe('185');
  });

  it('labels the y-axis with the max, half and zero of the shared scale', () => {
    const { container } = renderChart();
    const { maxVal } = buildChartPoints(DAILY_CHART);
    const yLabels = container.querySelectorAll(`.${styles.yAxis}`);

    expect(Array.from(yLabels, (label) => label.textContent)).toEqual([
      String(maxVal),
      String(Math.round(maxVal / 2)),
      '0',
    ]);
    for (const label of yLabels) {
      expect(label).toHaveClass(styles.axisLabel);
      expect(label.getAttribute('text-anchor')).toBe('end');
    }
  });

  it('labels the first, middle and last buckets with day-shortened dates', () => {
    const { container } = renderChart();
    const xLabels = Array.from(container.querySelectorAll(`.${styles.xAxis}`));

    expect(xLabels.map((label) => label.textContent)).toEqual(['01-01', '01-02', '01-03']);
    expect(xLabels.map((label) => label.getAttribute('x'))).toEqual(['55', '365', '675']);
    for (const label of xLabels) {
      expect(label).toHaveClass(styles.axisLabel);
      expect(label.getAttribute('text-anchor')).toBe('middle');
    }
  });

  it('keeps full month dates on the axis for the month bucket', () => {
    const monthly: DailyChartEntry[] = [
      { date: '2026-04', hasData: true, sessions: 1, views: 2 },
      { date: '2026-05', hasData: true, sessions: 3, views: 4 },
      { date: '2026-06', hasData: true, sessions: 5, views: 6 },
    ];
    const { container } = renderChart({ bucket: 'month', dailyChart: monthly });
    const xLabels = Array.from(container.querySelectorAll(`.${styles.xAxis}`));

    expect(xLabels.map((label) => label.textContent)).toEqual(['2026-04', '2026-05', '2026-06']);
  });

  it('renders both series as paths produced by the shared line builder', () => {
    const { container } = renderChart();
    const { points } = buildChartPoints(DAILY_CHART);
    const paths = Array.from(container.querySelectorAll('path'));

    expect(paths).toHaveLength(2);
    expect(paths[0]).toHaveAttribute('d', buildLinePath(points, 'yViews'));
    expect(paths[0]).toHaveAttribute('stroke', 'var(--color-primary)');
    expect(paths[1]).toHaveAttribute('d', buildLinePath(points, 'ySessions'));
    expect(paths[1]).toHaveAttribute('stroke', 'var(--color-cat-frameworks)');
    for (const path of paths) {
      expect(path).toHaveAttribute('fill', 'none');
      expect(path).toHaveAttribute('stroke-width', '3');
    }
  });

  it('marks the circles of a data-less bucket as no-data dots', () => {
    const { container } = renderChart();
    const circles = circlesOf(container);

    expect(circles).toHaveLength(6);
    expect(circles[0]).toHaveClass(styles.interactiveDot);
    expect(circles[0]).not.toHaveClass(styles.noData);
    expect(circles[4]).toHaveClass(styles.noData);
    expect(circles[5]).toHaveClass(styles.noData);
    expect(circles[4].getAttribute('cx')).toBe(circles[5].getAttribute('cx'));
  });

  it('reveals a session and view tooltip at the hovered point', async () => {
    const user = userEvent.setup();
    const { container } = renderChart();
    const { points } = buildChartPoints(DAILY_CHART);
    const circles = circlesOf(container);

    await user.hover(circles[0]);

    const tooltip = container.querySelector(`.${styles.chartTooltip}`);
    expect(tooltip).not.toBeNull();
    expect(tooltip?.querySelector(`.${styles.tooltipDate}`)?.textContent).toBe('2026-01-01');
    expect(tooltip?.querySelectorAll('strong')[0]?.textContent).toBe('2');
    expect(tooltip?.querySelectorAll('strong')[1]?.textContent).toBe('7');
    expect(tooltip?.textContent).toContain('세션 수:');
    expect(tooltip?.textContent).toContain('조회 수:');
    expect(tooltip?.getAttribute('style')).toContain(`left: ${points[0].x}px`);
    expect(tooltip?.getAttribute('style')).toContain(
      `top: ${Math.min(points[0].ySessions, points[0].yViews) - 40}px`,
    );

    expect(circles[0].getAttribute('r')).toBe('7');
    expect(circles[1].getAttribute('r')).toBe('7');
    expect(circles[2].getAttribute('r')).toBe('4');

    await user.unhover(circles[0]);

    expect(container.querySelector(`.${styles.chartTooltip}`)).toBeNull();
    expect(circles[0].getAttribute('r')).toBe('4');
  });

  it('states 기록 없음 in the tooltip for a bucket with no data', async () => {
    const user = userEvent.setup();
    const { container } = renderChart();
    const circles = circlesOf(container);

    await user.hover(circles[4]);

    const tooltip = container.querySelector(`.${styles.chartTooltip}`);
    expect(tooltip?.textContent).toContain('2026-01-03');
    expect(tooltip?.textContent).toContain('기록 없음');
    expect(tooltip?.querySelector('strong')).toBeNull();
  });

  it('opens and closes the same tooltip from the sessions dot', async () => {
    const user = userEvent.setup();
    const { container } = renderChart();
    const circles = circlesOf(container);

    await user.hover(circles[1]);

    expect(container.querySelector(`.${styles.chartTooltip}`)?.textContent).toContain('2026-01-01');
    expect(circles[1].getAttribute('r')).toBe('7');

    await user.unhover(circles[1]);

    expect(container.querySelector(`.${styles.chartTooltip}`)).toBeNull();
    expect(circles[1].getAttribute('r')).toBe('4');
  });

  it('renders no points, paths or x labels for an empty series but keeps the axis scale', () => {
    const { container } = renderChart({ dailyChart: [] });

    expect(container.querySelectorAll('circle')).toHaveLength(0);
    expect(container.querySelectorAll('path')).toHaveLength(0);
    expect(container.querySelectorAll(`.${styles.xAxis}`)).toHaveLength(0);
    expect(container.querySelectorAll('line')).toHaveLength(3);
    expect(container.querySelector(`.${styles.yAxis}`)?.textContent).toBe('10');
  });

  it('keeps the data table for screen readers under the chart', () => {
    const { container } = renderChart();
    const caption = container.querySelector('caption');

    expect(caption?.textContent).toBe('최근 30일 트래픽 데이터');
    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
  });
});
