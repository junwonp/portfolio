import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import SkillGroups from '@/components/ui/SkillGroups';
import * as styles from './SkillGroups.css';

const escapeForRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const countOccurrences = (html: string, className: string): number =>
  html.split(escapeForRegExp(className)).length - 1;

describe('SkillGroups', () => {
  it('renders nothing for an empty skills list', () => {
    expect(renderToStaticMarkup(<SkillGroups skills={[]} />)).toBe('');
  });

  it('renders a single skill without any divider', () => {
    const html = renderToStaticMarkup(<SkillGroups skills={['TypeScript']} />);

    expect(html).toContain('TypeScript');
    expect(countOccurrences(html, styles.divider)).toBe(0);
  });

  it('renders same-category skills in a group without a divider between them', () => {
    const html = renderToStaticMarkup(<SkillGroups skills={['React', 'Expo']} />);

    expect(html).toContain('React');
    expect(html).toContain('Expo');
    expect(countOccurrences(html, styles.divider)).toBe(0);
    expect(countOccurrences(html, styles.skillGroup)).toBe(1);
  });

  it('renders a divider between different categories but not after the last', () => {
    const html = renderToStaticMarkup(
      <SkillGroups skills={['TypeScript', 'React', 'Expo', 'Cloudflare']} />,
    );

    expect(html).toContain('TypeScript');
    expect(html).toContain('React');
    expect(html).toContain('Expo');
    expect(html).toContain('Cloudflare');
    // 3 categories: languages, frameworks, devops -> 2 dividers
    expect(countOccurrences(html, styles.divider)).toBe(2);
    expect(countOccurrences(html, styles.skillGroup)).toBe(3);
  });

  it('never renders a divider between consecutive unregistered skills', () => {
    const html = renderToStaticMarkup(<SkillGroups skills={['React', 'Unknown A', 'Unknown B']} />);

    // 1 divider between 'React' (frameworks) and the unregistered skills
    expect(countOccurrences(html, styles.divider)).toBe(1);
  });
});
