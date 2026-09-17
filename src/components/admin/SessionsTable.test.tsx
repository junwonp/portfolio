// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';

// SessionFilters reads the app-router context through these hooks, and vitest
// renders without a router mounted, so stub them to render the real filters.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

import { SessionsTable } from '@/components/admin/SessionsTable';
import type { SessionRow } from '@/lib/server/admin/dashboardData';

const textOf = (html: string): string =>
  html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

// A session row renders nine <td> cells, in the order of the column headers.
const cellTexts = (html: string): string[] =>
  Array.from(html.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g), (match) => textOf(match[1] ?? ''));

const baseSession: SessionRow = {
  acceptLanguage: 'ko-KR',
  applicationLinkLabel: 'Oneline',
  applicationLinkSlug: 'oneline',
  browser: 'Chrome',
  city: 'Seoul',
  classification: 'human',
  colo: 'ICN',
  createdAt: '2026-01-02T03:04:05.000Z',
  deviceType: 'desktop',
  id: 'session-1',
  ipCountry: 'KR',
  isBot: 0,
  os: 'macOS',
  pageViewsCount: 3,
  referrer: 'google.com',
  regionCode: 'KR',
  timezone: 'Asia/Seoul',
};

const renderTable = (sessions: SessionRow[], totalCount = sessions.length): string =>
  renderToStaticMarkup(
    <SessionsTable sessions={sessions} totalCount={totalCount} sessionDetails={{}} />,
  );

afterEach(() => {
  // Vitest globals are off, so RTL's auto-cleanup never registers; unmount explicitly.
  cleanup();
});

describe('SessionsTable', () => {
  it('renders all nine session column headers', () => {
    const html = renderTable([baseSession]);
    const text = textOf(html);

    for (const header of [
      '접속 시각',
      '유형',
      '단축 링크',
      '국가',
      '유입 경로',
      '조회',
      '기기',
      '위치',
      '언어',
    ]) {
      expect(text).toContain(header);
    }

    expect((html.match(/<th scope="col"/g) ?? []).length).toBe(9);
  });

  it('renders the device, location, timezone and language of a populated row', () => {
    const html = renderTable([baseSession]);
    const cells = cellTexts(html);

    expect(cells).toHaveLength(9);
    expect(cells[0]).toContain('2026-01-02 03:04');
    expect(cells[1]).toContain('사람');
    expect(cells[2]).toContain('/oneline');
    expect(html).toContain('href="/oneline"');
    expect(cells[3]).toBe('KR');
    expect(cells[4]).toBe('google.com');
    expect(cells[5]).toBe('3');
    expect(cells[6]).toContain('Desktop');
    expect(cells[6]).toContain('Chrome / MacOS');
    expect(cells[7]).toContain('Seoul, KR');
    expect(cells[7]).toContain('Asia/Seoul');
    expect(cells[8]).toBe('ko-KR');
  });

  it('renders a row with missing legacy fields without leaking "unknown"', () => {
    const legacySession: SessionRow = {
      ...baseSession,
      acceptLanguage: 'unknown',
      browser: '',
      city: '',
      colo: 'unknown',
      deviceType: '',
      id: 'session-legacy',
      os: '',
      regionCode: '',
      timezone: 'unknown',
    };

    const html = renderTable([legacySession]);
    const cells = cellTexts(html);

    expect(cells).toHaveLength(9);
    expect(cells[6]).toContain('알 수 없음');
    expect(cells[7]).toBe('-');
    expect(cells[8]).toContain('알 수 없음');
    expect(textOf(html)).not.toContain('unknown');
  });

  it('renders the empty state when no session matches', () => {
    const html = renderTable([], 0);
    const text = textOf(html);

    expect(text).toContain('조건에 맞는 세션 정보가 없습니다');
    expect(text).toContain('0개 세션');
    expect(html).not.toContain('<table');
  });
});

// The detail row only exists while the client-side expanded session id matches,
// so a live DOM is required to reach it; the static renders above cannot.
describe('SessionsTable detail row', () => {
  const toggleName = /2026-01-02 03:04/;

  const renderSingleSession = (session: SessionRow): void => {
    render(<SessionsTable sessions={[session]} totalCount={1} sessionDetails={{}} />);
  };

  const expandToggle = (): HTMLElement => screen.getByRole('button', { name: toggleName });

  const expectExpanded = (expanded: boolean): void => {
    expect(expandToggle().getAttribute('aria-expanded')).toBe(String(expanded));
  };

  it('keeps the detail row and colo note out of the document while collapsed', () => {
    renderSingleSession(baseSession);

    expectExpanded(false);
    expect(screen.queryByText(/Cloudflare 엣지/)).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('reveals the colo note in a colspan=9 detail cell after activating the toggle', () => {
    renderSingleSession(baseSession);

    fireEvent.click(expandToggle());

    expectExpanded(true);
    expect(screen.getByRole('status').textContent).toContain('페이지 뷰 기록이 없습니다');

    const note = screen.getByText(/Cloudflare 엣지/);
    expect(note.textContent).toContain('ICN');
    expect(note.closest('td')?.getAttribute('colspan')).toBe('9');
  });

  it('hides the detail row again when the toggle is activated twice', () => {
    renderSingleSession(baseSession);
    const toggle = expandToggle();

    fireEvent.click(toggle);
    fireEvent.click(toggle);

    expectExpanded(false);
    expect(screen.queryByText(/Cloudflare 엣지/)).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('omits the colo note when the expanded session has no recorded edge colo', () => {
    renderSingleSession({ ...baseSession, colo: 'unknown' });

    fireEvent.click(expandToggle());

    expectExpanded(true);
    expect(screen.queryByText(/Cloudflare 엣지/)).toBeNull();
  });
});
