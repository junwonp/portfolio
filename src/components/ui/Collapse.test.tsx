import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import Collapse from './Collapse';
import * as styles from './Collapse.css';

describe('Collapse', () => {
  it('keeps collapsed content rendered but inert and closed', () => {
    const html = renderToStaticMarkup(
      <Collapse isOpen={false}>
        <a href="/project">Project</a>
      </Collapse>,
    );
    expect(html).toContain('inert=""');
    expect(html).not.toContain('hidden=');
    expect(html).toContain(styles.collapse);
    expect(html).not.toContain(styles.open);
  });

  it('opens via the grid-row class without measured inline height', () => {
    const html = renderToStaticMarkup(
      <Collapse isOpen>
        <a href="/project">Project</a>
      </Collapse>,
    );
    expect(html).not.toContain('inert=');
    expect(html).not.toContain('hidden=');
    expect(html).not.toContain('--collapse-height');
    expect(html).toContain(styles.open);
  });
});
