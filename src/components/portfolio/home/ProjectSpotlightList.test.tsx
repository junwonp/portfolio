import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { OtherExperienceProps, ProjectItem } from '@/lib/portfolio/homeTypes';
import { labelsMap } from '@/lib/portfolio/labels';
import * as contentStyles from './ProjectContent.css';
import ProjectSpotlightList from './ProjectSpotlightList';
import * as styles from './ProjectSpotlightList.css';

const baseProject: ProjectItem = {
  id: 'aira',
  title: '아이라',
  dateFrom: '2022-03',
  description: 'Built Aira end to end.',
  detail: [],
  skills: ['Expo'],
};

const iconThumbnail: NonNullable<ProjectItem['thumbnail']> = {
  src: '/images/projects/aira-icon.png',
  alt: '아이라 아이콘',
  kind: 'icon',
};

const screenshotThumbnail: NonNullable<ProjectItem['thumbnail']> = {
  src: '/images/projects/aira-preview.png',
  alt: '아이라 대표 화면',
  kind: 'screenshot',
};

const experience = (project: ProjectItem): OtherExperienceProps => ({ project: [project] });

const render = (
  experiences: OtherExperienceProps[],
  options: { variant?: 'spotlight' | 'resume'; skillLimit?: number } = {},
): string =>
  renderToStaticMarkup(
    <ProjectSpotlightList
      experiences={experiences}
      labels={labelsMap.ko}
      variant={options.variant}
      skillLimit={options.skillLimit}
    />,
  );

describe('ProjectSpotlightList spotlight variant', () => {
  it('renders a linked card with the icon thumbnail frame for a project with a detail link', () => {
    const html = render([
      experience({ ...baseProject, detailLink: '/projects/aira', thumbnail: iconThumbnail }),
    ]);

    expect(html).toContain(styles.spotlightList);
    expect(html).toContain('data-project-link-card="true"');
    expect(html).toContain('data-project-surface="spotlight"');
    expect(html).toContain(`href="/projects/aira"`);
    expect(html).toContain(styles.isLink);
    expect(html).toContain(styles.hasThumbnail);
    expect(html).toContain(styles.thumbnailFrameIcon);
    expect(html).toContain(styles.thumbnailIcon);
    expect(html).toContain('alt="아이라 아이콘"');
    expect(html).toContain('/images/projects/aira-icon.png');
    expect(html).toContain('Built Aira end to end.');
  });

  it('renders a screenshot-thumbnail card without a detail link as a plain list item', () => {
    const html = render([experience({ ...baseProject, thumbnail: screenshotThumbnail })]);

    expect(html).not.toContain('data-project-link-card');
    expect(html).not.toContain('<a');
    expect(html).toContain('data-project-surface="spotlight"');
    expect(html).toContain(styles.thumbnailFrameScreenshot);
    expect(html).toContain(styles.thumbnailScreenshot);
    expect(html).toContain('alt="아이라 대표 화면"');
  });

  it('omits the thumbnail frame and its has-thumbnail modifier when there is no thumbnail', () => {
    const html = render([experience(baseProject)]);

    expect(html).not.toContain(styles.hasThumbnail);
    expect(html).not.toContain(styles.thumbnailFrameIcon);
    expect(html).not.toContain('<img');
  });

  it('skips experiences whose project list is empty', () => {
    const html = render([{ project: [] }, experience(baseProject)]);

    expect(html.match(/data-project-surface="spotlight"/g)).toHaveLength(1);
    expect(html).toContain('아이라');
  });

  it('keeps every experience in the order it was provided', () => {
    const html = render([
      experience({ ...baseProject, id: 'first', title: '첫 번째' }),
      experience({ ...baseProject, id: 'second', title: '두 번째' }),
    ]);

    expect(html.indexOf('첫 번째')).toBeLessThan(html.indexOf('두 번째'));
  });

  it('defaults the spotlight skill limit to six and shows the hidden-skill counter', () => {
    const manySkills = [
      'TypeScript',
      'React',
      'Next.js',
      'Expo',
      'Swift',
      'Zod',
      'Redux',
      'Sentry',
    ];
    const html = render([experience({ ...baseProject, skills: manySkills })]);

    expect(html).toContain(contentStyles.moreChip);
    expect(html).toContain('+2');
  });
});

describe('ProjectSpotlightList resume variant', () => {
  it('renders resume rows with the detail link and no collapsible body', () => {
    const html = render([experience({ ...baseProject, detailLink: '/projects/aira' })], {
      variant: 'resume',
    });

    expect(html).toContain(styles.resumeList);
    expect(html).not.toContain(styles.spotlightList);
    expect(html).toContain('data-project-surface="resume"');
    expect(html).toContain('href="/projects/aira"');
    expect(html).not.toContain('inert=');
    expect(html).toContain(contentStyles.resumeBody);
    expect(html).not.toContain('data-project-link-card');
  });

  it('keeps every skill visible when the resume variant is given no skill limit', () => {
    const html = render([experience({ ...baseProject, skills: ['Expo', 'TypeScript'] })], {
      variant: 'resume',
    });

    expect(html).not.toContain(contentStyles.moreChip);
    expect(html).toContain('Expo');
    expect(html).toContain('TypeScript');
  });

  it('honors an explicit resume skill limit with the hidden-skill counter', () => {
    const html = render([experience({ ...baseProject, skills: ['Expo', 'TypeScript', 'Swift'] })], {
      variant: 'resume',
      skillLimit: 1,
    });

    expect(html).toContain('+2');
    expect(html).toContain('title="Swift, Expo"');
  });
});
