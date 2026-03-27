import { render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';

vi.mock('$app/state', () => ({
  page: { data: { locale: 'en' } },
}));

vi.mock('$app/environment', () => ({ browser: false }));

vi.mock('$app/navigation', () => ({
  invalidateAll: vi.fn(),
  goto: vi.fn(),
}));

import Page from '../../routes/+page.svelte';

const baseData = { locale: 'en' as const };

describe('+page (home)', () => {
  it('renders without crashing', () => {
    const { container } = render(Page, { data: baseData });
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('renders all section headings', () => {
    const { getAllByRole } = render(Page, { data: baseData });
    const headings = getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
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
});
