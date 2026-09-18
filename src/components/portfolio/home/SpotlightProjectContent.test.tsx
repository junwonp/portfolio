import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { ProjectItem } from '@/lib/portfolio/homeTypes';
import { labelsMap } from '@/lib/portfolio/labels';
import type { ResolvedProjectSkills } from '@/lib/portfolio/projectSkills';
import * as styles from './ProjectContent.css';
import SpotlightProjectContent from './SpotlightProjectContent';

const project: ProjectItem = {
  id: 'aira',
  title: '아이라',
  dateFrom: '2022-03',
  description: 'Built **Aira** with `Expo`.',
  detail: [],
  skills: ['Expo', 'TypeScript'],
};

const resolvedSkills: ResolvedProjectSkills = {
  visibleSkills: ['Expo', 'TypeScript'],
  hiddenSkillCount: 0,
  hiddenSkillsSummary: '',
};

interface RenderOverrides {
  project?: ProjectItem;
  resolvedSkills?: ResolvedProjectSkills;
  titleBadge?: string;
}

const render = ({
  project: projectOverride,
  resolvedSkills: skills,
  titleBadge,
}: RenderOverrides = {}) =>
  renderToStaticMarkup(
    <SpotlightProjectContent
      labels={labelsMap.ko}
      project={projectOverride ?? project}
      resolvedSkills={skills ?? resolvedSkills}
      titleBadge={titleBadge}
    />,
  );

describe('SpotlightProjectContent', () => {
  it('renders the title, badge, detail-link mock, markdown description, and skill chips', () => {
    const html = render({
      titleBadge: '2022',
      project: { ...project, detailLink: '/projects/aira' },
    });

    expect(html).toContain(styles.spotlightContent);
    expect(html).toContain('<h3');
    expect(html).toContain('아이라');
    expect(html).toContain('2022');
    expect(html).toContain(styles.linkMock);
    expect(html).toContain(labelsMap.ko.viewProjectDetails);
    expect(html).toContain('<strong>Aira</strong>');
    expect(html).toContain('<code>Expo</code>');
    expect(html).toContain(styles.skills);
    expect(html).toContain('TypeScript');
  });

  it('omits the badge and detail-link mock when the project has neither', () => {
    const html = render();

    expect(html).not.toContain(styles.badge);
    expect(html).not.toContain(styles.linkMock);
    expect(html).not.toContain(labelsMap.ko.viewProjectDetails);
  });

  it('renders a hidden-skill counter chip titled with the remaining skill summary', () => {
    const html = render({
      resolvedSkills: {
        visibleSkills: ['Expo'],
        hiddenSkillCount: 2,
        hiddenSkillsSummary: 'React Native, Swift',
      },
    });

    expect(html).toContain(styles.moreChip);
    expect(html).toContain('+2');
    expect(html).toContain('title="React Native, Swift"');
  });

  it('renders no skill row when the resolved skill list is empty', () => {
    const html = render({
      project: { ...project, skills: [] },
      resolvedSkills: { visibleSkills: [], hiddenSkillCount: 0, hiddenSkillsSummary: '' },
    });

    expect(html).not.toContain(styles.skills);
    expect(html).not.toContain(styles.moreChip);
  });
});
