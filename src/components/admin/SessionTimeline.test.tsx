import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { SessionTimeline } from '@/components/admin/SessionTimeline';
import * as styles from '@/components/admin/SessionTimeline.css';
import type { SessionDetail } from '@/lib/server/admin/dashboardData';

type PageView = SessionDetail['pageViews'][number];
type Interaction = SessionDetail['interactions'][number];

const pageView = (overrides: Partial<PageView> = {}): PageView => ({
  activeTime: 0,
  articleProgress: 0,
  createdAt: '2026-01-01T10:00:00.000Z',
  dwellTime: 0,
  path: '/',
  previousPath: null,
  scrollDepth: 0,
  sectionLabel: null,
  ...overrides,
});

const interaction = (overrides: Partial<Interaction> = {}): Interaction => ({
  action: 'open',
  createdAt: '2026-01-01T10:05:00.000Z',
  id: 1,
  interactionLabel: '경력 섹션',
  interactionType: 'accordion',
  path: '/projects/oneline',
  sessionId: 'session-1',
  ...overrides,
});

const textOf = (html: string): string =>
  html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const renderTimeline = (detail: SessionDetail): string =>
  renderToStaticMarkup(<SessionTimeline detail={detail} />);

describe('SessionTimeline', () => {
  it('renders an empty ordered list when the session has no recorded activity', () => {
    const html = renderTimeline({ interactions: [], pageViews: [] });

    expect(html).toContain(styles.timeline);
    expect(html).not.toContain('<li');
  });

  it('labels the home page as 홈 and strips the leading slash from other paths', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [
        pageView({ path: '/' }),
        pageView({ path: '/privacy', createdAt: '2026-01-01T10:01:00.000Z' }),
      ],
    });
    const text = textOf(html);

    expect(text).toContain('홈');
    expect(text).toContain('privacy');
    expect(text).not.toContain('/privacy');
    expect((html.match(new RegExp(styles.timelineItem, 'g')) ?? []).length).toBe(2);
  });

  it('prefixes project page views with project/ and drops the projects/ segment', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [pageView({ path: '/projects/oneline' })],
    });

    expect(html).toContain(styles.timelinePathPrefix);
    expect(html).toContain('project/');
    expect(textOf(html)).toContain('oneline');
    expect(textOf(html)).not.toContain('projects/oneline');
    expect(html).toContain('title="/projects/oneline"');
  });

  it('renders the navigation arrow from the previous page when the visitor moved between pages', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [pageView({ path: '/projects/cafe', previousPath: '/' })],
    });

    expect(html).toContain(styles.timelineNavArrow);
    expect(html).toContain(styles.timelineNavFrom);
    expect(html).toContain(styles.timelineNavSymbol);
    expect(textOf(html)).toContain('홈');
    expect(textOf(html)).toContain('↓');
  });

  it('shortens a project previous path in the navigation arrow too', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [
        pageView({
          createdAt: '2026-01-01T10:02:00.000Z',
          path: '/privacy',
          previousPath: '/projects/oneline',
        }),
      ],
    });
    const text = textOf(html);

    expect(text).toContain('oneline');
    expect(text).not.toContain('projects/oneline');
  });

  it('omits the navigation arrow when the previous path equals the current path', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [pageView({ path: '/privacy', previousPath: '/privacy' })],
    });

    expect(html).not.toContain(styles.timelineNavArrow);
  });

  it('formats dwell times under a minute as seconds and longer ones as minutes', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [
        pageView({ dwellTime: 45, path: '/privacy' }),
        pageView({
          createdAt: '2026-01-01T10:02:00.000Z',
          dwellTime: 125,
          path: '/projects/oneline',
        }),
      ],
    });

    expect(html).toContain(styles.timelineDwell);
    expect(textOf(html)).toContain('45초');
    expect(textOf(html)).toContain('2분 5초');
  });

  it('hides the dwell chip for a page view with no recorded dwell time', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [pageView({ path: '/privacy' })],
    });

    expect(html).not.toContain(styles.timelineDwell);
  });

  it('renders only the scroll bar when article progress was never recorded', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [pageView({ path: '/privacy', scrollDepth: 60 })],
    });

    expect(html).toContain(styles.timelineBars);
    expect(html).toContain('스크롤');
    expect(html).not.toContain('본문');
    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="60"');
    expect(html).toContain('width:60%');
    expect(textOf(html)).toContain('60%');
  });

  it('renders the article bar, the recorded section label and both tones when progress exists', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [
        pageView({
          articleProgress: 40,
          path: '/privacy',
          scrollDepth: 80,
          sectionLabel: 'About',
        }),
      ],
    });

    expect(html).toContain('스크롤');
    expect(html).toContain('본문');
    expect(html).toContain('aria-valuenow="80"');
    expect(html).toContain('aria-valuenow="40"');
    expect(html).toContain('마지막 섹션: About');
    expect(html).toContain(styles.timelineSection);
  });

  it('keeps the progress block out of the document when neither scroll nor progress was recorded', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [pageView({ path: '/privacy', sectionLabel: 'About' })],
    });

    expect(html).not.toContain(styles.timelineBars);
    expect(html).not.toContain('마지막 섹션: About');
  });

  it('shows the active-time note only when active time differs from dwell time', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [
        pageView({ activeTime: 12, dwellTime: 30, path: '/privacy' }),
        pageView({
          activeTime: 30,
          createdAt: '2026-01-01T10:02:00.000Z',
          dwellTime: 30,
          path: '/projects/oneline',
        }),
        pageView({ activeTime: 0, createdAt: '2026-01-01T10:03:00.000Z', path: '/projects/cafe' }),
      ],
    });

    expect((html.match(new RegExp(styles.timelineActive, 'g')) ?? []).length).toBe(1);
    expect(textOf(html)).toContain('활성 12초');
  });

  it('renders open interactions with the 열기 verb and close interactions with 닫기', () => {
    const html = renderTimeline({
      interactions: [
        interaction({ action: 'open', id: 1, interactionLabel: '경력 섹션' }),
        interaction({ action: 'close', id: 2, interactionLabel: '프로젝트 섹션' }),
      ],
      pageViews: [],
    });
    const text = textOf(html);

    expect(text).toContain('열기');
    expect(text).toContain('닫기');
    expect(text).toContain('경력 섹션');
    expect(text).toContain('프로젝트 섹션');
    expect(html).toContain(styles.actionOpen);
    expect(html).toContain(styles.actionClose);
    expect(html).toContain(styles.timelineDotSmall);
  });

  it('merges page views and interactions into chronological order', () => {
    const html = renderTimeline({
      interactions: [
        interaction({
          action: 'open',
          createdAt: '2026-01-01T10:05:00.000Z',
          interactionLabel: '중간',
        }),
      ],
      pageViews: [
        pageView({ createdAt: '2026-01-01T10:00:00.000Z', path: '/first' }),
        pageView({ createdAt: '2026-01-01T10:10:00.000Z', path: '/third' }),
      ],
    });
    const text = textOf(html);

    expect(text.indexOf('first')).toBeLessThan(text.indexOf('중간'));
    expect(text.indexOf('중간')).toBeLessThan(text.indexOf('third'));
  });

  it('sums the dwell of every page view into a total row', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [
        pageView({ dwellTime: 45, path: '/privacy' }),
        pageView({
          createdAt: '2026-01-01T10:02:00.000Z',
          dwellTime: 125,
          path: '/projects/oneline',
        }),
      ],
    });

    expect(html).toContain(styles.timelineTotalItem);
    expect(html).toContain(styles.timelineTotal);
    expect(textOf(html)).toContain('총 체류 시간: 2분 50초');
  });

  it('omits the total row when every page view has zero dwell', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [pageView({ path: '/privacy' })],
    });

    expect(html).not.toContain(styles.timelineTotalItem);
  });

  it('formats a total under a minute in seconds', () => {
    const html = renderTimeline({
      interactions: [],
      pageViews: [pageView({ dwellTime: 45, path: '/privacy' })],
    });

    expect(textOf(html)).toContain('총 체류 시간: 45초');
  });
});
