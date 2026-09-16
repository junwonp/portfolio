import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import PortfolioDocument from '@/components/portfolio-document/PortfolioDocument';
import { buildPortfolioDocument } from '@/lib/portfolio/documentProjection';

const locales = ['ko', 'en'] as const;

const textOf = (html: string): string =>
  html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const renderDocument = (locale: (typeof locales)[number]): string =>
  renderToStaticMarkup(<PortfolioDocument document={buildPortfolioDocument(locale)} />);

describe('PortfolioDocument', () => {
  it.each(locales)('renders every project of the %s document exactly once', (locale) => {
    const portfolioDocument = buildPortfolioDocument(locale);
    const html = renderDocument(locale);
    const text = textOf(html);
    const projects = portfolioDocument.sections.flatMap((section) => section.projects);

    for (const project of projects) {
      expect(text).toContain(project.title);
    }

    for (const group of portfolioDocument.skills) {
      expect(text).toContain(group.title);
    }

    for (const entry of portfolioDocument.education) {
      expect(text).toContain(entry.school);
    }

    // The sheet itself is the outer <article>, so project blocks are the rest.
    expect((html.match(/<article/g) ?? []).length).toBe(projects.length + 1);
    expect((html.match(/<img/g) ?? []).length).toBe(
      projects.reduce((total, project) => total + project.images.length, 0),
    );
  });

  it.each(locales)('renders per-project metadata in the %s document', (locale) => {
    const portfolioDocument = buildPortfolioDocument(locale);
    const html = renderDocument(locale);
    const text = textOf(html);
    const projects = portfolioDocument.sections.flatMap((section) => section.projects);

    for (const project of projects) {
      if (project.platforms.length > 0) {
        expect(text).toContain(project.platforms.join(' · '));
      }
    }

    // Printable URLs drop the scheme, and a repo-path frontmatter value becomes a full URL.
    expect(text).toContain('studio.camerafi.com');
    expect(html).toContain('href="https://studio.camerafi.com"');
    expect(text).toContain('github.com/junwonp/OnelineBank');
    expect(html).toContain('href="https://github.com/junwonp/OnelineBank"');
  });

  it.each(locales)('renders no raw markdown markers in the %s document', (locale) => {
    const text = textOf(renderDocument(locale));

    expect(text).not.toContain('**');
    expect(text).not.toContain('`');
  });

  it.each(locales)('renders the %s masthead name, role and tagline', (locale) => {
    const portfolioDocument = buildPortfolioDocument(locale);
    const text = textOf(renderDocument(locale));

    expect(text).toContain(portfolioDocument.name);
    expect(text).toContain(portfolioDocument.role);
    expect(text).toContain(portfolioDocument.tagline);
  });

  it.each(locales)('renders the %s cover pillars above the first section', (locale) => {
    const portfolioDocument = buildPortfolioDocument(locale);
    const { pillars } = portfolioDocument;
    const [firstPillar] = pillars;
    const firstSection = portfolioDocument.sections[0];
    const text = textOf(renderDocument(locale));

    expect(firstPillar).toBeDefined();
    expect(firstSection).toBeDefined();
    if (!firstPillar || !firstSection) return;

    for (const pillar of pillars) {
      expect(text).toContain(pillar.title);
      expect(text).toContain(pillar.description);
    }

    // The cover is the masthead plus pillars; the first section must still follow it.
    expect(text.indexOf(firstPillar.title)).toBeLessThan(text.indexOf(firstSection.title));
  });

  it.each(locales)('renders the %s sheet hook and the empty seam layer for PageSeams', (locale) => {
    const html = renderDocument(locale);

    // PageSeams measures the sheet by this attribute and draws nothing until it runs.
    expect(html).toContain('data-document-sheet');
    expect(html).toContain('data-page-count="0"');
  });
});
