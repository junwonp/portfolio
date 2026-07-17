import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import ProjectDetail from '@/app/(portfolio)/[locale]/projects/[slug]/page';
import AiraKo from '@/content/projects/aira/detail.ko.mdx';

const airaDetailSource = readFileSync(
  new URL('../../content/projects/aira/detail.ko.mdx', import.meta.url),
  'utf8',
);

describe('project detail MDX', () => {
  it('keeps prose in the MDX body instead of a serialized blocks export', () => {
    expect(airaDetailSource).not.toContain('export const blocks');
    expect(airaDetailSource).toContain('## 프로젝트 소개');
  });

  it('renders direct MDX prose with a heading id', () => {
    const html = renderToStaticMarkup(
      <AiraKo metadata={{ techStack: ['TypeScript'] }} locale="ko" />,
    );

    expect(html).toContain('2.3만 명이 사용한 AI 캐릭터 채팅 서비스');
    expect(html).toMatch(/<h2 id="[^"]+">프로젝트 소개<\/h2>/);
  });

  it('renders the catalog-selected MDX component inside the detail route', async () => {
    const page = await ProjectDetail({
      params: Promise.resolve({ locale: 'ko', slug: 'aira' }),
    });
    const html = renderToStaticMarkup(page);

    expect(html).toContain('2.3만 명이 사용한 AI 캐릭터 채팅 서비스');
    expect(html).toMatch(/<h2 id="[^"]+">프로젝트 소개<\/h2>/);
  });
});
