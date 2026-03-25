import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';

import SideList from '$lib/components/SideList.svelte';

describe('SideList', () => {
  it('renders the title', () => {
    const { getByRole } = render(SideList, { title: 'Skills', list: [] });
    expect(getByRole('heading', { name: 'Skills' })).toBeInTheDocument();
  });

  it('renders each list item', () => {
    const { getAllByRole } = render(SideList, {
      title: 'Languages',
      list: ['TypeScript', 'Rust', 'Go'],
    });
    const items = getAllByRole('listitem');
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toBe('TypeScript');
    expect(items[1].textContent).toBe('Rust');
    expect(items[2].textContent).toBe('Go');
  });

  it('renders no list items for an empty list', () => {
    const { queryAllByRole } = render(SideList, { title: 'Empty', list: [] });
    expect(queryAllByRole('listitem')).toHaveLength(0);
  });

  it('renders a single list item', () => {
    const { getAllByRole } = render(SideList, { title: 'Solo', list: ['Only item'] });
    const items = getAllByRole('listitem');
    expect(items).toHaveLength(1);
    expect(items[0].textContent).toBe('Only item');
  });
});
