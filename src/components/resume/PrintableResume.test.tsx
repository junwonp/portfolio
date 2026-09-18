import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import PrintableResume from '@/components/resume/PrintableResume';
import * as styles from '@/components/resume/PrintableResume.css';
import {
  type PrintableResumeData,
  printableResume,
  type ResumePageSection,
  type ResumeProjectBlock,
  type ResumeSimpleItem,
  type ResumeTextPart,
  type ResumeWorkEntry,
} from '@/content/printableResume';

const strong = (text: string): ResumeTextPart => ({ strong: true, text });
const code = (text: string): ResumeTextPart => ({ code: true, text });

const renderResume = (overrides: Partial<PrintableResumeData> = {}): string => {
  const resume: PrintableResumeData = {
    name: '박준원 (테스트)',
    role: 'Frontend Engineer',
    contactItems: [],
    heroMetrics: [{ value: '15%', label: '번들 감량' }],
    summaryTitle: '요약 제목',
    summaryBullets: [],
    techKeywords: ['React', 'TypeScript'],
    pages: [{ sections: [] }],
    ...overrides,
  };

  return renderToStaticMarkup(<PrintableResume resume={resume} />);
};

const workSection = (entries: ResumeWorkEntry[], title?: string): ResumePageSection => ({
  type: 'work',
  title,
  entries,
});

const project = (overrides: Partial<ResumeProjectBlock> = {}): ResumeProjectBlock => ({
  title: '프로젝트',
  bullets: [],
  ...overrides,
});

const countOccurrences = (html: string, needle: string): number => html.split(needle).length - 1;

describe('PrintableResume', () => {
  it('renders the real resume data with a page frame per page and one hero', () => {
    const html = renderToStaticMarkup(<PrintableResume resume={printableResume} />);

    expect(html).toContain(printableResume.name);
    expect(html).toContain(printableResume.role);
    expect(html).toContain('오르카에이아이');
    expect(html).toContain('Skills Set');
    expect(html).toContain(`<code class="${styles.inlineCode}">orca.setup(websiteId)</code>`);
    expect(html).toContain(printableResume.heroMetrics[0].value);
    expect(countOccurrences(html, '<h1>')).toBe(1);
    expect(countOccurrences(html, 'aria-label="Resume page ')).toBe(printableResume.pages.length);
  });

  it('renders plain, strong and code text parts inside a summary bullet', () => {
    const html = renderResume({
      summaryBullets: [['평문 ', strong('강조'), ' 그리고 ', code('code()')]],
    });

    expect(html).toContain(`<ul class="${styles.bullets}">`);
    expect(html).toContain('<span>평문 </span>');
    expect(html).toContain('<strong>강조</strong>');
    expect(html).toContain('<span> 그리고 </span>');
    expect(html).toContain(`<code class="${styles.inlineCode}">code()</code>`);
  });

  it('omits bullet lists when there is nothing to list', () => {
    const html = renderResume({ summaryBullets: [] });

    expect(html).not.toContain(styles.bullets);
  });

  it('joins tech keywords and renders the hero metrics', () => {
    const html = renderResume({
      techKeywords: ['React', 'Next.js', 'TypeScript'],
      heroMetrics: [
        { value: '2.3만', label: '최고 MAU' },
        { value: '46분', label: '평균 세션' },
      ],
    });

    expect(html).toContain('<strong>Tech</strong> React · Next.js · TypeScript');
    expect(html).toContain(`<span class="${styles.metricValue}">2.3만</span>`);
    expect(html).toContain(`<span class="${styles.metricLabel}">최고 MAU</span>`);
    expect(countOccurrences(html, styles.metricValue)).toBe(2);
  });

  it('renders all contact rows for location, secure email, GitHub and portfolio', () => {
    const html = renderResume({
      contactItems: [
        { label: 'Location', value: 'Seoul, Korea' },
        { label: 'Email', value: 'me@example.com' },
        { label: 'GitHub', href: 'https://github.com/junwonp', value: 'github.com/junwonp' },
        {
          label: 'Portfolio',
          href: 'https://portfolio.example.dev',
          value: 'https://portfolio.example.dev',
        },
      ],
    });

    expect(html).toContain('<span>Seoul, Korea</span>');
    expect(html).toContain(`<span class="${styles.divider}">|</span>`);
    expect(html).toContain(`<span class="${styles.secureEmail}">`);
    expect(html).toContain('<span>me</span>');
    expect(html).toContain('<span>junwon.dev</span>');
    expect(html).toContain(
      '<strong>GitHub:</strong> <a href="https://github.com/junwonp">github.com/junwonp</a>',
    );
    expect(html).toContain(
      '<strong>Portfolio:</strong> <a href="https://portfolio.example.dev">portfolio.example.dev</a>',
    );
  });

  it('renders only the location row when email, GitHub and portfolio are absent', () => {
    const html = renderResume({
      contactItems: [{ label: 'Location', value: 'Seoul, Korea' }],
    });

    expect(html).toContain('<span>Seoul, Korea</span>');
    expect(html).not.toContain(styles.divider);
    expect(html).not.toContain(styles.secureEmail);
    expect(html).not.toContain('<strong>GitHub:</strong>');
    expect(html).not.toContain('<strong>Portfolio:</strong>');
  });

  it('renders the secure email without a divider when location is absent', () => {
    const html = renderResume({
      contactItems: [{ label: 'Email', value: 'me@example.com' }],
    });

    expect(html).toContain(styles.secureEmail);
    expect(html).not.toContain(styles.divider);
  });

  it('keeps the hero on the first page only', () => {
    const sections = [
      {
        type: 'simple-list',
        title: 'Awards',
        items: [{ title: '수상', period: '2024', bullets: [] }],
      },
    ] satisfies ResumePageSection[];
    const html = renderResume({ pages: [{ sections }, { sections }] });

    expect(html).toContain('aria-label="Resume page 1"');
    expect(html).toContain('aria-label="Resume page 2"');
    expect(countOccurrences(html, '<h1>')).toBe(1);
    expect(countOccurrences(html, '요약 제목')).toBe(1);
  });

  it('renders a full work entry header, project summary and bullet list', () => {
    const html = renderResume({
      pages: [
        {
          sections: [
            workSection(
              [
                {
                  companyName: '오르카에이아이',
                  role: 'Frontend Lead',
                  period: '2024.01 - 2026.07',
                  location: 'Seoul, Korea',
                  projects: [
                    project({
                      title: '아이라',
                      period: '2024.07 – 2025.12',
                      summary: ['요약 ', strong('강조')],
                      bullets: [['불릿 ', strong('핵심')]],
                    }),
                  ],
                },
              ],
              'Work Experience',
            ),
          ],
        },
      ],
    });

    expect(html).toContain('<h2>Work Experience</h2>');
    expect(html).toContain('<h3>오르카에이아이</h3>');
    expect(html).toContain(`<p class="${styles.role}">Frontend Lead</p>`);
    expect(html).toContain('<p>2024.01 - 2026.07</p>');
    expect(html).toContain('<p>Seoul, Korea</p>');
    expect(html).toContain('<h4>아이라</h4>');
    expect(html).toContain(`<p class="${styles.projectPeriod}">2024.07 – 2025.12</p>`);
    expect(html).toContain(
      `<p class="${styles.projectSummary}"><span>요약 </span><strong>강조</strong></p>`,
    );
    expect(html).toContain(`<li><span>불릿 </span><strong>핵심</strong></li>`);
  });

  it('omits the work section heading when the section has no title', () => {
    const html = renderResume({ pages: [{ sections: [workSection([])] }] });

    expect(html).not.toContain('Work Experience');
  });

  it('renders a company-less continuation entry without a header and promotes its project title', () => {
    const html = renderResume({
      pages: [
        {
          sections: [
            workSection([
              {
                period: '2020.08',
                location: 'Seoul, Korea',
                projects: [project({ title: '웹 기반 문서 뷰어' })],
              },
            ]),
          ],
        },
      ],
    });

    expect(html).not.toContain(styles.workHeader);
    expect(html).not.toContain(styles.periodBlock);
    expect(html).not.toContain('<h4>');
    expect(html).toContain('<h3>웹 기반 문서 뷰어</h3>');
  });

  it('renders a company entry that carries no role, period, location, summary or bullets', () => {
    const html = renderResume({
      pages: [
        {
          sections: [
            workSection([
              {
                companyName: '볼트마이크로',
                projects: [project({ title: 'CameraFi Studio' })],
              },
            ]),
          ],
        },
      ],
    });

    expect(html).toContain('<h3>볼트마이크로</h3>');
    expect(html).toContain('<h4>CameraFi Studio</h4>');
    expect(html).toContain(styles.periodBlock);
    expect(html).not.toContain(styles.role);
    expect(html).not.toContain(styles.projectPeriod);
    expect(html).not.toContain(styles.projectSummary);
    expect(html).not.toContain(styles.bullets);
  });

  it('renders each skill group as a definition row with joined values', () => {
    const html = renderResume({
      pages: [
        {
          sections: [
            {
              type: 'skills',
              title: 'Skills Set',
              groups: [
                { label: 'Languages', values: ['TypeScript', 'JavaScript'] },
                { label: 'Frontend', values: ['React'] },
              ],
            },
          ],
        },
      ],
    });

    expect(html).toContain('<h2>Skills Set</h2>');
    expect(html).toContain('<dt>Languages</dt>');
    expect(html).toContain('<dd>TypeScript, JavaScript</dd>');
    expect(html).toContain('<dt>Frontend</dt>');
    expect(html).toContain('<dd>React</dd>');
    expect(countOccurrences(html, styles.skillRow)).toBe(2);
  });

  it.each([
    { type: 'simple-list', title: 'Awards & Projects' },
    { type: 'education', title: 'Education' },
  ] as const)('renders $type items with their period and bullets', ({ type, title }) => {
    const items: ResumeSimpleItem[] = [
      { title: '금융결제원', period: '2026.04 – 2026.05', bullets: [['본문 ', strong('강조')]] },
      { title: '자격증', period: '', bullets: [] },
    ];
    const section: ResumePageSection = { type, title, items };
    const html = renderResume({ pages: [{ sections: [section] }] });

    expect(html).toContain(`<h2>${title.replace('&', '&amp;')}</h2>`);
    expect(html).toContain('<h3>금융결제원</h3>');
    expect(html).toContain('<p>2026.04 – 2026.05</p>');
    expect(countOccurrences(html, styles.simpleItem)).toBe(2);
    expect(html).toContain('<li><span>본문 </span><strong>강조</strong></li>');
    expect(countOccurrences(html, styles.bullets)).toBe(1);
  });
});
