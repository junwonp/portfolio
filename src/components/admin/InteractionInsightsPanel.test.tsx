import type { ComponentProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { InteractionInsightsPanel } from '@/components/admin/InteractionInsightsPanel';

type PanelProps = ComponentProps<typeof InteractionInsightsPanel>;

const textOf = (html: string): string =>
  html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

// Each ranking row renders its label and count as the two cells of one <tr>.
const cellTexts = (html: string): string[] =>
  Array.from(html.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g), (match) => textOf(match[1] ?? ''));

const renderPanel = (props: PanelProps): string =>
  renderToStaticMarkup(<InteractionInsightsPanel {...props} />);

const expectRankingRow = (cells: string[], label: string, count: number): void => {
  const index = cells.indexOf(label);
  expect(index, `ranking is missing the formatted label ${label}`).toBeGreaterThanOrEqual(0);
  expect(cells[index + 1]).toBe(String(count));
};

const EMPTY_RANKINGS: PanelProps = {
  localeSwitches: [],
  outboundLinks: [],
  themeToggles: [],
};

describe('InteractionInsightsPanel', () => {
  it('renders the three ranking card titles', () => {
    const text = textOf(renderPanel(EMPTY_RANKINGS));

    for (const title of ['외부 링크 클릭', '테마 전환 방향', '언어 전환']) {
      expect(text).toContain(title);
    }
  });

  it('renders every ranking empty state and no table when all rankings are empty', () => {
    const html = renderPanel(EMPTY_RANKINGS);
    const text = textOf(html);

    for (const message of [
      '기록된 외부 링크 클릭이 없습니다',
      '기록된 테마 전환이 없습니다',
      '기록된 언어 전환이 없습니다',
    ]) {
      expect(text).toContain(message);
    }

    expect(html).not.toContain('<table');
  });

  it('formats known labels and keeps each count in the same row', () => {
    const cells = cellTexts(
      renderPanel({
        outboundLinks: [
          { count: 42, label: 'github' },
          { count: 17, label: 'linkedin' },
          { count: 9, label: 'email' },
          { count: 5, label: 'resume' },
          { count: 3, label: 'external:camerafi.com' },
        ],
        themeToggles: [
          { count: 21, label: 'light' },
          { count: 13, label: 'dark' },
        ],
        localeSwitches: [
          { count: 8, label: 'ko' },
          { count: 6, label: 'en' },
        ],
      }),
    );

    expectRankingRow(cells, 'GitHub', 42);
    expectRankingRow(cells, 'LinkedIn', 17);
    expectRankingRow(cells, '이메일', 9);
    expectRankingRow(cells, '이력서', 5);
    expectRankingRow(cells, 'camerafi.com', 3);
    expectRankingRow(cells, '라이트', 21);
    expectRankingRow(cells, '다크', 13);
    expectRankingRow(cells, '한국어', 8);
    expectRankingRow(cells, '영어', 6);
  });

  it('keeps an unrecognised label as its raw value instead of dropping it', () => {
    const cells = cellTexts(
      renderPanel({
        outboundLinks: [{ count: 4, label: 'mastodon' }],
        themeToggles: [{ count: 2, label: 'sepia' }],
        localeSwitches: [{ count: 1, label: 'fr' }],
      }),
    );

    expectRankingRow(cells, 'mastodon', 4);
    expectRankingRow(cells, 'sepia', 2);
    expectRankingRow(cells, 'fr', 1);
  });

  it('states that only visitors who changed the theme are counted', () => {
    const text = textOf(renderPanel(EMPTY_RANKINGS));

    expect(text).toContain('설정을 바꾼 방문자만 집계');
    expect(text).toContain('기본 테마가 맞는지 판단하는 신호');
  });

  it('states that locale switches are not the better preference signal', () => {
    const text = textOf(renderPanel(EMPTY_RANKINGS));

    expect(text).toContain('언어를 바꾼 방문자만 집계된 전환 수');
    expect(text).toContain('Accept-Language');
    expect(text).toContain('더 정확한 신호');
  });
});
