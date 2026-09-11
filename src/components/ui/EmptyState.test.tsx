import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import EmptyState from '@/components/ui/EmptyState';
import * as styles from '@/components/ui/EmptyState.css';

describe('EmptyState', () => {
  it('renders the message with the empty-state styling', () => {
    const html = renderToStaticMarkup(<EmptyState message="No sessions recorded" />);

    expect(html).toContain('No sessions recorded');
    expect(html).toContain(styles.empty);
    expect(html).toContain(styles.message);
  });

  it('renders optional children below the message', () => {
    const html = renderToStaticMarkup(
      <EmptyState message="No links yet">
        <button type="button">Create a link</button>
      </EmptyState>,
    );

    expect(html).toContain('No links yet');
    expect(html).toContain('Create a link');
  });
});
