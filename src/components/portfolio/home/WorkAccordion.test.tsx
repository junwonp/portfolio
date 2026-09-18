import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import type { WorkExperienceProps } from '@/lib/portfolio/homeTypes';
import { labelsMap } from '@/lib/portfolio/labels';

import WorkAccordion from './WorkAccordion';
import * as styles from './WorkAccordion.css';

const experiences: WorkExperienceProps[] = [
  {
    id: 'career-a',
    companyName: '회사 에이',
    role: 'Frontend Engineer',
    dateFrom: '2022-03',
    project: [
      {
        id: 'project-a',
        title: '프로젝트 에이',
        dateFrom: '2022-03',
        description: '에이 프로젝트 설명',
        detail: [],
      },
    ],
  },
  {
    id: 'career-b',
    companyName: '회사 비',
    role: 'Frontend Engineer',
    dateFrom: '2019-01',
    dateTo: '2022-02',
    project: [
      {
        id: 'project-b',
        title: '프로젝트 비',
        dateFrom: '2019-01',
        description: '비 프로젝트 설명',
        detail: [],
      },
    ],
  },
];

describe('WorkAccordion', () => {
  it('renders one collapsed company card per experience in the caller order', () => {
    const html = renderToStaticMarkup(<WorkAccordion experiences={experiences} locale="ko" />);

    expect(html).toContain(styles.accordion);
    expect(html.indexOf('회사 에이')).toBeLessThan(html.indexOf('회사 비'));
    expect(html.match(/aria-expanded="false"/g)).toHaveLength(2);
    expect(html).toContain('프로젝트 에이');
    expect(html).toContain('프로젝트 비');
  });

  it('localizes the expand affordance and the present badge through the locale labels', () => {
    const koHtml = renderToStaticMarkup(<WorkAccordion experiences={experiences} locale="ko" />);
    const enHtml = renderToStaticMarkup(<WorkAccordion experiences={experiences} locale="en" />);

    expect(koHtml).toContain(labelsMap.ko.showDetails);
    expect(koHtml).toContain(labelsMap.ko.present);
    expect(enHtml).toContain(labelsMap.en.showDetails);
    expect(enHtml).toContain(labelsMap.en.present);
    expect(enHtml).not.toContain(labelsMap.ko.showDetails);
  });

  it('renders an empty accordion when there are no work experiences', () => {
    const html = renderToStaticMarkup(<WorkAccordion experiences={[]} locale="ko" />);

    expect(html).toContain(styles.accordion);
    expect(html).not.toContain('<li');
  });
});
