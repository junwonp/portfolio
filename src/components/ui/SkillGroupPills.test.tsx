import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import SkillGroupPills from '@/components/ui/SkillGroupPills';

import * as styles from './SkillGroupPills.css';

const escapeForRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const countOccurrences = (html: string, className: string): number =>
  html.split(escapeForRegExp(className)).length - 1;

describe('SkillGroupPills', () => {
  it('groups a 2+ same-category run into one tinted pill', () => {
    const html = renderToStaticMarkup(<SkillGroupPills skills={['React', 'Expo']} />);

    expect(countOccurrences(html, styles.skillGroupPill)).toBe(1);
    expect(html).toContain('React');
    expect(html).toContain('Expo');
    expect(html).toContain('var(--color-cat-frameworks)');
  });

  it('renders a single-skill category as a flat chip', () => {
    const html = renderToStaticMarkup(<SkillGroupPills skills={['TypeScript']} />);

    expect(countOccurrences(html, styles.skillGroupPill)).toBe(0);
    expect(html).toContain('TypeScript');
  });

  it('never groups unregistered skills', () => {
    const html = renderToStaticMarkup(
      <SkillGroupPills skills={['React', 'Unknown A', 'Unknown B']} />,
    );

    expect(countOccurrences(html, styles.skillGroupPill)).toBe(0);
  });

  it('groups only the qualifying runs in a mixed list', () => {
    const html = renderToStaticMarkup(<SkillGroupPills skills={['TypeScript', 'React', 'Expo']} />);

    expect(countOccurrences(html, styles.skillGroupPill)).toBe(1);
  });

  it('renders nothing for an empty skill list', () => {
    expect(renderToStaticMarkup(<SkillGroupPills skills={[]} />)).toBe('');
  });
});
