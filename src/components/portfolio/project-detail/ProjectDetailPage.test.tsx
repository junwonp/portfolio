import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import ProjectDetailPage from '@/components/portfolio/project-detail/ProjectDetailPage';

const projectDetailStyles = readFileSync(
  new URL('./ProjectDetailPage.css.ts', import.meta.url),
  'utf8',
);

describe('ProjectDetailPage legacy editor cleanup', () => {
  it('does not retain project detail editor selectors after content editing is removed', () => {
    expect(projectDetailStyles).not.toContain('.editor-toolbar');
    expect(projectDetailStyles).not.toContain('.editable-detail-section');
    expect(projectDetailStyles).not.toContain('.editable-section-heading');
    expect(projectDetailStyles).not.toContain('.section-fallback-title');
  });

  it('renders server-provided MDX content inside the project article', () => {
    const html = renderToStaticMarkup(
      <ProjectDetailPage
        slug="aira"
        locale="ko"
        metadata={{ title: '아이라' }}
      >
        <h2 id="mdx-prose">MDX prose marker</h2>
      </ProjectDetailPage>,
    );

    expect(html).toContain('MDX prose marker');
    expect(html).toContain('id="mdx-prose"');
  });
});
