import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProgressBar from '@/components/ui/ProgressBar';
import * as styles from '@/components/ui/ProgressBar.css';

describe('ProgressBar', () => {
  it('renders a progressbar with aria values and inline width', () => {
    const html = renderToStaticMarkup(<ProgressBar value={42} />);

    expect(html).toContain('role="progressbar"');
    expect(html).toContain('aria-valuenow="42"');
    expect(html).toContain('aria-valuemin="0"');
    expect(html).toContain('aria-valuemax="100"');
    expect(html).toContain('width:42%');
    expect(html).toContain(styles.tone.primary);
  });

  it('clamps out-of-range values into the 0-100 track', () => {
    const high = renderToStaticMarkup(<ProgressBar value={150} />);
    const low = renderToStaticMarkup(<ProgressBar value={-10} />);

    expect(high).toContain('aria-valuenow="100"');
    expect(high).toContain('width:100%');
    expect(low).toContain('aria-valuenow="0"');
    expect(low).toContain('width:0%');
  });

  it('applies the requested tone class', () => {
    const html = renderToStaticMarkup(<ProgressBar value={70} tone="success" />);

    expect(html).toContain(styles.tone.success);
    expect(html).not.toContain(styles.tone.primary);
  });
});
