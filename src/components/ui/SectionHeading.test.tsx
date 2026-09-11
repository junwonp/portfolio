import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import SectionHeading from '@/components/ui/SectionHeading';
import * as styles from '@/components/ui/SectionHeading.css';

describe('SectionHeading', () => {
  it('renders an h2 title with subtitle and action slots', () => {
    const html = renderToStaticMarkup(
      <SectionHeading
        title="Featured"
        subtitle="Recent work"
        action={<button type="button">More</button>}
      />,
    );

    expect(html).toContain('<h2>Featured</h2>');
    expect(html).toContain('Recent work');
    expect(html).toContain('More');
    expect(html).toContain(styles.row);
    expect(html).toContain(styles.subtitle);
    expect(html).toContain(styles.action);
  });

  it('renders an h3 when level is 3 and omits optional slots', () => {
    const html = renderToStaticMarkup(<SectionHeading title="Traffic" level={3} />);

    expect(html).toContain('<h3>Traffic</h3>');
    expect(html).not.toContain('<h2>');
    expect(html).not.toContain(styles.subtitle);
    expect(html).not.toContain(styles.action);
  });
});
