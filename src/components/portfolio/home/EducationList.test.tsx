import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { EducationProps } from '@/lib/portfolio/homeTypes';

import EducationList from './EducationList';
import * as styles from './EducationList.css';

const education: EducationProps[] = [
  {
    school: '한국대학교',
    major: '컴퓨터공학',
    dateFrom: '2014-03',
    dateTo: '2020-02',
  },
  {
    school: 'Self-taught',
    dateFrom: '2020',
  },
];

describe('EducationList', () => {
  it('renders every entry in order with its school and formatted period', () => {
    const html = renderToStaticMarkup(<EducationList education={education} />);

    expect(html).toContain(styles.educationList);
    expect(html.indexOf('한국대학교')).toBeLessThan(html.indexOf('Self-taught'));
    expect(html).toContain('2014. 03');
    expect(html).toContain('2020. 02');
    expect(html).toContain('2020-02');
  });

  it('renders the major paragraph only for entries that declare one', () => {
    const html = renderToStaticMarkup(<EducationList education={education} />);

    expect(html).toContain(styles.major);
    expect(html.match(new RegExp(styles.major, 'g'))).toHaveLength(1);
    expect(html).toContain('컴퓨터공학');
  });

  it('renders a single period without a second date when dateTo is absent', () => {
    const html = renderToStaticMarkup(
      <EducationList education={[{ school: 'Bootcamp', dateFrom: '2020' }]} />,
    );

    expect(html).toContain('2020');
    expect(html).not.toContain('~');
    expect(html.match(/<time/g)).toHaveLength(1);
  });

  it('renders an empty list when there is no education data', () => {
    const html = renderToStaticMarkup(<EducationList education={[]} />);

    expect(html).toContain(styles.educationList);
    expect(html).not.toContain('<li');
  });
});
