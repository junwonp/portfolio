import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { PillarItem } from '@/lib/portfolio/homeTypes';

import Title from './Title';
import * as styles from './Title.css';

const roleText = 'Frontend Engineer';
const emptyRole = '';

const pillars: PillarItem[] = [
  {
    index: '01',
    title: 'Production Frontend Systems',
    description: 'Building production UI and server-state for React products.',
  },
  {
    index: '02',
    title: 'Cross-Platform Delivery',
    description: 'Shipping Android, iOS, and Web from one architecture.',
  },
];

describe('Title', () => {
  it('renders the name, role, tagline, and every pillar in index order', () => {
    const html = renderToStaticMarkup(
      <Title
        name="박준원"
        role={roleText}
        tagline="제품의 시작부터 성장까지 직접 경험한 프론트엔드 엔지니어"
        pillars={pillars}
      />,
    );

    expect(html).toContain('<h1');
    expect(html).toContain('박준원');
    expect(html).toContain('<h2');
    expect(html).toContain('Frontend Engineer');
    expect(html).toContain('제품의 시작부터 성장까지 직접 경험한 프론트엔드 엔지니어');

    expect(html).toContain(styles.pillars);
    expect(html.indexOf('01')).toBeLessThan(html.indexOf('02'));
    expect(html.indexOf('Production Frontend Systems')).toBeLessThan(
      html.indexOf('Cross-Platform Delivery'),
    );
    expect(html).toContain('Building production UI and server-state for React products.');
    expect(html).toContain('Shipping Android, iOS, and Web from one architecture.');
  });

  it('omits the role heading when the role is an empty string', () => {
    const html = renderToStaticMarkup(
      <Title name="Junwon Park" role={emptyRole} tagline="A tagline" pillars={pillars} />,
    );

    expect(html).not.toContain('<h2');
    expect(html).not.toContain(styles.role);
    expect(html).toContain('<h1');
    expect(html).toContain('A tagline');
  });

  it('omits the pillar list when pillars are not provided', () => {
    const html = renderToStaticMarkup(<Title name="Junwon Park" role={roleText} tagline="Tag" />);

    expect(html).not.toContain(styles.pillars);
    expect(html).not.toContain(styles.pillarIndex);
  });

  it('omits the pillar list when pillars is an empty array', () => {
    const html = renderToStaticMarkup(
      <Title name="Junwon Park" role={roleText} tagline="Tag" pillars={[]} />,
    );

    expect(html).not.toContain(styles.pillars);
  });
});
