import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { SkillProps } from '@/lib/portfolio/homeTypes';
import { labelsMap } from '@/lib/portfolio/labels';

import BentoSkills from './BentoSkills';
import * as styles from './BentoSkills.css';

const uiSkill: SkillProps = {
  id: 'ui',
  title: 'UI & Design System',
  list: ['shadcn/ui', 'Tailwind CSS'],
  description: 'Design tokens and component libraries.',
  detailLink: '/projects/design-system',
  detailLabel: '설계 살펴보기',
};

const listOnlySkill: SkillProps = {
  id: 'backend',
  title: 'Backend & Cloud',
  list: ['Supabase'],
};

const fallbackLabelSkill: SkillProps = {
  id: 'languages',
  title: '언어',
  list: ['TypeScript'],
  detailLink: '/projects/languages',
};

const renderSkills = (skills: SkillProps[], locale: 'ko' | 'en' = 'ko'): string =>
  renderToStaticMarkup(<BentoSkills locale={locale} skills={skills} />);

describe('BentoSkills', () => {
  it('renders each skill group as a category-colored card with its chips in listed order', () => {
    const html = renderSkills([uiSkill, listOnlySkill]);

    expect(html).toContain(styles.bentoGrid);
    expect(html).toContain('UI &amp; Design System');
    expect(html).toContain('Backend &amp; Cloud');
    expect(html).toMatch(/--cat-color:\s*var\(--color-cat-ui\)/);
    expect(html).toMatch(/--cat-color:\s*var\(--color-cat-backend\)/);
    expect(html.indexOf('shadcn/ui')).toBeLessThan(html.indexOf('Tailwind CSS'));
    expect(html).toContain('Supabase');
  });

  it('applies the span-two modifier only to the ui group', () => {
    const html = renderSkills([uiSkill, listOnlySkill]);

    expect(html.match(new RegExp(styles.span2, 'g'))).toHaveLength(1);
  });

  it('renders the described detail footer with the explicit detail label', () => {
    const html = renderSkills([uiSkill]);

    expect(html).toContain(styles.cardFooter);
    expect(html).toContain(styles.cardProse);
    expect(html).toContain('Design tokens and component libraries.');
    expect(html).toContain('href="/projects/design-system"');
    expect(html).toContain('설계 살펴보기');
  });

  it('falls back to the localized view-project label and skips the prose when description is absent', () => {
    const html = renderSkills([fallbackLabelSkill], 'en');

    expect(html).not.toContain(styles.cardProse);
    expect(html).toContain('href="/projects/languages"');
    expect(html).toContain(labelsMap.en.viewProjectDetails);
    expect(html).not.toContain(labelsMap.ko.viewProjectDetails);
  });

  it('renders no footer for a group without a detail link', () => {
    const html = renderSkills([listOnlySkill]);

    expect(html).not.toContain(styles.cardFooter);
    expect(html).not.toContain('<a');
  });

  it('renders an empty grid when no skill groups are provided', () => {
    const html = renderSkills([]);

    expect(html).toContain(styles.bentoGrid);
    expect(html).not.toContain(styles.card);
  });
});
