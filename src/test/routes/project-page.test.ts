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

import type { Component } from 'svelte';

import Page from '../../routes/projects/[slug]/+page.svelte';

const baseMetadata = {
  title: 'Test Project',
  description: 'A test project description',
  role: 'Developer',
};

const baseData = {
  slug: 'test-project',
  locale: 'en' as const,
  metadata: baseMetadata,
  component: undefined as unknown as Component,
};

describe('+page (project detail)', () => {
  it('renders without crashing', () => {
    const { container } = render(Page, { data: baseData });
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('shows project title as heading', () => {
    const { getByRole } = render(Page, { data: baseData });
    expect(getByRole('heading', { name: 'Test Project' })).toBeInTheDocument();
  });

  it('shows content load error when no component is provided', () => {
    const { getByText } = render(Page, { data: baseData });
    expect(getByText('Unable to load content.')).toBeInTheDocument();
  });

  it('renders the project description as tagline', () => {
    const { getByText } = render(Page, { data: baseData });
    expect(getByText('A test project description')).toBeInTheDocument();
  });
});
