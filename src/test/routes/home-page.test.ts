import { render } from '@testing-library/svelte';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { pageState } = vi.hoisted(() => ({
  pageState: {
    data: { locale: 'en' as const },
    url: new URL('http://localhost/'),
  },
}));

vi.mock('$app/state', () => ({
  page: pageState,
}));

vi.mock('$app/environment', () => ({ browser: false }));

vi.mock('$app/navigation', () => ({
  afterNavigate: vi.fn(),
  beforeNavigate: vi.fn(),
  invalidateAll: vi.fn(),
  goto: vi.fn(),
}));

class IntersectionObserverMock {
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock);

import Page from '../../routes/+page.svelte';

const baseData = { locale: 'en' as const };

describe('+page (home)', () => {
  beforeEach(() => {
    pageState.url = new URL('http://localhost/');
  });

  it('renders without crashing', () => {
    const { container } = render(Page, { data: baseData });
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('renders all section headings', () => {
    const { getAllByRole, queryByText } = render(Page, { data: baseData });
    const headings = getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(queryByText('Role-Fit Projects')).not.toBeInTheDocument();
    expect(headings).toContain('Work Experience');
    expect(headings).toContain('Skills Set');
    expect(headings).toContain('Awards & Projects');
    expect(headings).toContain('Education');
    expect(headings).toContain('Archives');
  });

  it('renders the name as h1', () => {
    const { getByRole } = render(Page, { data: baseData });
    expect(getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders role-fit projects when project ids are provided in the query string', () => {
    pageState.url = new URL('http://localhost/?projects=today_weather,web_viewer');

    const { getAllByText, getByRole } = render(Page, { data: baseData });

    expect(getByRole('heading', { level: 2, name: 'Role-Fit Projects' })).toBeInTheDocument();
    expect(
      getAllByText("Today's Weather — Personalized Weather & Lifestyle Guide").length,
    ).toBeGreaterThan(0);
    expect(getAllByText('Web-based Document Viewer').length).toBeGreaterThan(0);
  });
});
