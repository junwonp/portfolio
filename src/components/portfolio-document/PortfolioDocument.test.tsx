import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import PortfolioDocument from '@/components/portfolio-document/PortfolioDocument';
import PrintToolbar from '@/components/print/PrintToolbar';
import {
  buildPortfolioDocument,
  type DocumentProjectBlock,
  type DocumentProjectSection,
  type DocumentSection,
  type PortfolioDocument as PortfolioDocumentData,
} from '@/lib/portfolio/documentProjection';

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

const isProjectSection = (section: DocumentSection): section is DocumentProjectSection =>
  section.kind !== 'skills' && section.kind !== 'education';

const projectBlocks = (document: PortfolioDocumentData): DocumentProjectBlock[] =>
  document.sections.flatMap((section) => (isProjectSection(section) ? section.projects : []));

const renderDocument = (locale: (typeof locales)[number]): string =>
  renderToStaticMarkup(<PortfolioDocument document={buildPortfolioDocument(locale)} />);

describe('PortfolioDocument', () => {
  it.each(locales)('sets the %s document language and print button', (locale) => {
    const html = renderDocument(locale);
    expect(html).toMatch(new RegExp(`<main[^>]*lang="${locale}"`));
    expect(textOf(html)).toContain(locale === 'en' ? 'Save PDF / Print' : 'PDF 저장 / 인쇄');
  });

  it('preserves the shared toolbar default', () => {
    expect(textOf(renderToStaticMarkup(<PrintToolbar />))).toBe('PDF 저장 / 인쇄');
  });

  it.each(locales)('renders every project of the %s document exactly once', (locale) => {
    const portfolioDocument = buildPortfolioDocument(locale);
    const html = renderDocument(locale);
    const text = textOf(html);
    const projects = projectBlocks(portfolioDocument);
    const skillsGroups = portfolioDocument.sections.flatMap((section) =>
      section.kind === 'skills' ? section.groups : [],
    );
    const educationEntries = portfolioDocument.sections.flatMap((section) =>
      section.kind === 'education' ? section.entries : [],
    );

    for (const project of projects) {
      expect(text).toContain(project.title);
    }

    for (const group of skillsGroups) {
      expect(text).toContain(group.title);
    }

    for (const entry of educationEntries) {
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
    const projects = projectBlocks(portfolioDocument);

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

  it.each(locales)('renders the %s masthead contact from the passed document', (locale) => {
    const portfolioDocument = buildPortfolioDocument(locale);
    const contact = {
      githubLink: 'https://github.com/example-org',
      linkedinLink: 'https://www.linkedin.com/in/example-person',
    };
    const html = renderToStaticMarkup(
      <PortfolioDocument document={{ ...portfolioDocument, contact }} />,
    );
    const text = textOf(html);

    expect(html).toContain('href="https://github.com/example-org"');
    expect(text).toContain('github.com/example-org');
    expect(html).toContain('href="https://www.linkedin.com/in/example-person"');
    expect(text).toContain('linkedin.com/in/example-person');
    // A regression to the global profile constants would drop these values entirely.
    expect(html).not.toContain('href="https://github.com/junwonp"');
  });

  it.each(locales)('renders only the passed GitHub contact when LinkedIn is absent', (locale) => {
    const portfolioDocument = buildPortfolioDocument(locale);
    const contact = { githubLink: 'https://github.com/example-org', linkedinLink: '' };
    const html = renderToStaticMarkup(
      <PortfolioDocument document={{ ...portfolioDocument, contact }} />,
    );

    expect(html).toContain('href="https://github.com/example-org"');
    expect(textOf(html)).toContain('github.com/example-org');
    expect(html).not.toContain('https://www.linkedin.com');
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
