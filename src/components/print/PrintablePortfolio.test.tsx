import type { ComponentProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import PrintablePortfolio from '@/components/print/PrintablePortfolio';
import * as styles from '@/components/print/PrintablePortfolio.css';
import { GITHUB_PROFILE, LINKEDIN_PROFILE } from '@/config/site';

interface PrintProject {
  title: string;
  description: string;
  skills: string[];
}

const project = (overrides: Partial<PrintProject> = {}): PrintProject => ({
  title: '아이라',
  description: 'AI 캐릭터 채팅 플랫폼',
  skills: ['React', 'TypeScript'],
  ...overrides,
});

const renderPortfolio = (props: Partial<ComponentProps<typeof PrintablePortfolio>> = {}): string =>
  renderToStaticMarkup(
    <PrintablePortfolio projects={[project()]} portfolioUrl="https://junwon.dev/p48r" {...props} />,
  );

const countOccurrences = (html: string, needle: string): number => html.split(needle).length - 1;

describe('PrintablePortfolio', () => {
  it('falls back to the default role label and omits the company line', () => {
    const html = renderPortfolio();

    expect(html).toContain(`<p class="${styles.headerRole}">Frontend Engineer</p>`);
    expect(html).not.toContain('지원:');
  });

  it.each([
    ['ai', 'AI Engineer'],
    ['mobile', 'Mobile Developer'],
    ['web', 'Frontend Engineer'],
  ])('maps the %s role to the %s label', (role, expected) => {
    const html = renderPortfolio({ role });

    expect(html).toContain(`<p class="${styles.headerRole}">${expected}</p>`);
  });

  it('falls back to the default label for an unknown role key', () => {
    const html = renderPortfolio({ role: 'design' });

    expect(html).toContain(`<p class="${styles.headerRole}">Frontend Engineer</p>`);
    expect(html).not.toContain('design');
  });

  it('renders the application target when a company name is given', () => {
    const html = renderPortfolio({ companyName: '예시 주식회사' });

    expect(html).toContain(`<p class="${styles.headerCompany}">지원: 예시 주식회사</p>`);
  });

  it('renders both profile links from the site config', () => {
    const html = renderPortfolio();

    expect(html).toContain(`href="${GITHUB_PROFILE}"`);
    expect(html).toContain(`href="${LINKEDIN_PROFILE}"`);
    expect(countOccurrences(html, 'target="_blank"')).toBe(4);
  });

  it('renders one card per project with its description and skill tags', () => {
    const html = renderPortfolio({
      projects: [
        project({ title: '아이라', skills: ['React', 'TypeScript', 'Expo'] }),
        project({ title: '뷰어', description: '문서 뷰어', skills: ['React Table'] }),
      ],
    });

    expect(countOccurrences(html, styles.projectCard)).toBe(2);
    expect(html).toContain(`<h3 class="${styles.projectTitle}">아이라</h3>`);
    expect(html).toContain('문서 뷰어');
    expect(countOccurrences(html, styles.skillTag)).toBe(4);
    expect(html).toContain('>Expo<');
  });

  it('renders no project section when the list is empty', () => {
    const html = renderPortfolio({ projects: [] });

    expect(html).not.toContain('대표 프로젝트');
    expect(html).not.toContain(styles.projectsSection);
    expect(html).not.toContain(styles.projectCard);
  });

  it('caps the project list at four entries', () => {
    const projects = Array.from({ length: 5 }, (_, index) =>
      project({ title: `프로젝트 ${index + 1}` }),
    );
    const html = renderPortfolio({ projects });

    expect(countOccurrences(html, styles.projectCard)).toBe(4);
    expect(html).toContain('프로젝트 4');
    expect(html).not.toContain('프로젝트 5');
  });

  it('caps each skill list at five tags and drops the list when skills are empty', () => {
    const many = renderPortfolio({
      projects: [
        project({
          skills: ['1', '2', '3', '4', '5', '6'],
        }),
      ],
    });
    const none = renderPortfolio({ projects: [project({ skills: [] })] });

    expect(countOccurrences(many, styles.skillTag)).toBe(5);
    expect(many).not.toContain('>6<');
    expect(none).not.toContain(styles.skillTags);
  });

  it('points every call to action at the portfolio URL and stamps the current year', () => {
    const html = renderPortfolio({ portfolioUrl: 'https://junwon.dev/abcd' });
    const year = new Date().getFullYear();

    expect(countOccurrences(html, 'href="https://junwon.dev/abcd"')).toBe(2);
    expect(html).toContain('>https://junwon.dev/abcd</a>');
    expect(html).toContain('포트폴리오 방문하기');
    expect(html).toContain(`© 2021 - ${year} Junwon Park. All rights reserved.`);
  });
});
