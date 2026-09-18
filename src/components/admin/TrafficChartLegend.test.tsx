import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { TrafficChartLegend } from '@/components/admin/TrafficChartLegend';
import * as styles from '@/components/admin/TrendChart.css';

describe('TrafficChartLegend', () => {
  it('lists exactly the two series the chart draws', () => {
    const html = renderToStaticMarkup(<TrafficChartLegend />);

    expect((html.match(/<li/g) ?? []).length).toBe(2);
    expect(html).toContain('조회 수 (Views)');
    expect(html).toContain('세션 수 (Sessions)');
    expect(html).toContain(styles.chartLegend);
    expect(html).toContain(styles.legendItem);
    expect(html).toContain(styles.legendText);
  });

  it('keeps each label paired with its own series swatch color', () => {
    const html = renderToStaticMarkup(<TrafficChartLegend />);
    const items = Array.from(
      html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g),
      (match) => match[1] ?? '',
    );

    expect(items).toHaveLength(2);
    expect(items[0]).toContain(styles.views);
    expect(items[0]).toContain('조회 수 (Views)');
    expect(items[0]).not.toContain(styles.sessions);
    expect(items[1]).toContain(styles.sessions);
    expect(items[1]).toContain('세션 수 (Sessions)');
    expect(items[1]).not.toContain(styles.views);
  });

  it('renders both swatches as empty decorative spans', () => {
    const html = renderToStaticMarkup(<TrafficChartLegend />);
    const swatches = Array.from(
      html.matchAll(new RegExp(`<span class="${styles.legendColor}[^"]*"></span>`, 'g')),
    );

    expect(swatches).toHaveLength(2);
  });
});
