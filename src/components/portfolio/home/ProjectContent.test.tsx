import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ProjectContent from '@/components/portfolio/home/ProjectContent';
import type { ProjectItem } from '@/lib/portfolio/homeTypes';
import { labelsMap } from '@/lib/portfolio/labels';

import * as styles from './ProjectContent.css';

const project: ProjectItem = {
  id: 'aira',
  title: '아이라',
  dateFrom: '2022.03',
  description: 'Built the app from planning to launch.',
  detail: [],
  skills: ['TypeScript', 'Expo'],
};

const renderResume = (): string =>
  renderToStaticMarkup(<ProjectContent project={project} variant="resume" labels={labelsMap.ko} />);

const renderResumeWithToggle = (expanded: boolean): string =>
  renderToStaticMarkup(
    <ProjectContent
      project={project}
      variant="resume"
      toggle={{ expanded, onToggle: () => {} }}
      labels={labelsMap.ko}
    />,
  );

const escapeForRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const extractDescriptionParagraph = (html: string): string => {
  const pattern = new RegExp(
    `<p[^>]*${escapeForRegExp(styles.resumeDescription)}[^>]*>([\\s\\S]*?)</p>`,
  );
  const match = html.match(pattern);
  if (!match) throw new Error('resume description paragraph not found in markup');
  return match[1];
};

describe('ProjectContent resume variant', () => {
  it('keeps the tech stack out of the one-line description paragraph', () => {
    const paragraph = extractDescriptionParagraph(renderResume());

    expect(paragraph).toContain('Built the app from planning to launch.');
    expect(paragraph).not.toContain('·');
    expect(paragraph).not.toContain('TypeScript');
    expect(paragraph).not.toContain('Expo');
  });

  it('renders the tech stack as skill chips below the description', () => {
    const html = renderResume();

    expect(html).toContain('TypeScript');
    expect(html).toContain('Expo');
  });

  it('renders tech stack grouped by category with a divider between different categories', () => {
    const html = renderResume();

    expect(html).toContain('TypeScript');
    expect(html).toContain('Expo');
    expect(html).toContain('/');
  });

  it('renders an interactive header button reflecting the toggle expanded state', () => {
    expect(renderResumeWithToggle(true)).toContain('aria-expanded="true"');
    expect(renderResumeWithToggle(false)).toContain('aria-expanded="false"');
  });

  it('renders the static header without a toggle button when toggle is omitted', () => {
    const html = renderResume();

    expect(html).not.toContain('<button');
    expect(html).not.toContain('aria-expanded');
  });
});
