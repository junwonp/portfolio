import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import generatedImages from '@/lib/generated/images.json';
import generatedProjectImages from '@/lib/generated/projectImages.json';
import { projectCatalog } from '@/lib/portfolio/catalog';
import {
  buildPortfolioDocument,
  type DocumentProjectBlock,
  type PortfolioDocument,
} from '@/lib/portfolio/documentProjection';
import { getLabels } from '@/lib/portfolio/labels';
import { getResumeData } from '@/lib/portfolio/resume';
import { PROJECT_ID, type ProjectContentEntry } from '@/lib/portfolio/types';

import {
  extractDeclaredImages,
  extractProjectImages,
} from '../../../scripts/lib/projectImages.mjs';

const locales = ['ko', 'en'] as const;

const expectedSectionOrder = ['skills', 'work', 'other', 'archive', 'education'];

const projectContentDirectory = fileURLToPath(new URL('../../content/projects', import.meta.url));

const projectSlugs = (): string[] =>
  readdirSync(projectContentDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

const readProjectDetail = (slug: string, locale: (typeof locales)[number]): string =>
  readFileSync(path.join(projectContentDirectory, slug, `detail.${locale}.mdx`), 'utf8');

const catalogProjectById = new Map<string, ProjectContentEntry>(
  projectCatalog.map((project) => [project.id, project]),
);

const collectBlocks = (document: PortfolioDocument): DocumentProjectBlock[] =>
  document.sections.flatMap((section) => section.projects);

describe('buildPortfolioDocument', () => {
  it('orders sections skills → work → other → archive → education in every locale', () => {
    for (const lang of locales) {
      const document = buildPortfolioDocument(lang);

      expect(document.sections.map((section) => section.kind)).toEqual(expectedSectionOrder);
      expect(document.locale).toBe(lang);
    }
  });

  it('numbers the skills section 01 and education 05 in every locale', () => {
    for (const lang of locales) {
      const kinds = buildPortfolioDocument(lang).sections.map((section) => section.kind);

      // The renderer derives the numbers from this order; the labels carry no number.
      expect(kinds.indexOf('skills')).toBe(0);
      expect(kinds.indexOf('education')).toBe(kinds.length - 1);
    }
  });

  it('titles the other-projects section as projects in every locale', () => {
    for (const lang of locales) {
      const otherSection = buildPortfolioDocument(lang).sections.find(
        (section) => section.kind === 'other',
      );
      const labels = getLabels(lang);

      // The other group holds projects only; the awards label belongs to the home page.
      expect(otherSection?.title).toBe(labels.sectionProjects);
      expect(otherSection?.title).not.toBe(labels.sectionAwards);
    }
  });

  it('gives every project block a non-empty title and period', () => {
    for (const lang of locales) {
      const blocks = collectBlocks(buildPortfolioDocument(lang));

      expect(blocks.length).toBeGreaterThan(0);
      for (const block of blocks) {
        expect(block.title.trim()).not.toBe('');
        expect(block.period.trim()).not.toBe('');
      }
    }
  });

  it('carries the experience role on every work block', () => {
    const workSection = buildPortfolioDocument('ko').sections.find(
      (section) => section.kind === 'work',
    );

    expect(workSection?.projects.length).toBeGreaterThan(0);
    for (const block of workSection?.projects ?? []) {
      expect((block.role ?? '').trim()).not.toBe('');
    }
  });

  it('caps bullets at six whole strings and keeps their raw markdown', () => {
    for (const lang of locales) {
      for (const block of collectBlocks(buildPortfolioDocument(lang))) {
        const source = catalogProjectById.get(block.id)?.content[lang].summaryDetails ?? [];

        expect(block.bullets.length).toBeLessThanOrEqual(6);
        // Whole-bullet slicing keeps bold/code markers balanced for the renderer's parser.
        expect(block.bullets).toEqual(source.slice(0, 6));
      }
    }
  });

  it('exposes per-locale platforms, paradigm, and resolved links', () => {
    const aira = collectBlocks(buildPortfolioDocument('ko')).find(
      (block) => block.id === PROJECT_ID.aira,
    );

    expect(aira?.platforms).toEqual(['Android', 'iOS', 'Web']);
    expect(aira?.paradigm).toBe('assisted');

    for (const lang of locales) {
      for (const block of collectBlocks(buildPortfolioDocument(lang))) {
        const project = catalogProjectById.get(block.id);

        expect(block.platforms).toEqual(project?.content[lang].detailMetadata?.platforms ?? []);
        // paradigm is shared across locales, so both documents must agree.
        expect(block.paradigm).toBe(project?.paradigm);
      }
    }

    const camerafi = collectBlocks(buildPortfolioDocument('ko')).find(
      (block) => block.id === PROJECT_ID.camerafiStudio,
    );
    const onelineBank = collectBlocks(buildPortfolioDocument('ko')).find(
      (block) => block.id === PROJECT_ID.onelineBank,
    );

    expect(camerafi?.productLink).toBe('https://studio.camerafi.com');
    // The frontmatter carries a repo path, not a URL.
    expect(onelineBank?.githubLink).toBe('https://github.com/junwonp/OnelineBank');
  });

  it('localizes titles per locale while covering the same projects', () => {
    const koBlocks = collectBlocks(buildPortfolioDocument('ko'));
    const enBlocks = collectBlocks(buildPortfolioDocument('en'));

    expect(enBlocks.map((block) => block.id)).toEqual(koBlocks.map((block) => block.id));
    expect(enBlocks.map((block) => block.title)).not.toEqual(koBlocks.map((block) => block.title));
  });

  it('is deterministic across repeated calls', () => {
    for (const lang of locales) {
      expect(buildPortfolioDocument(lang)).toEqual(buildPortfolioDocument(lang));
    }
  });

  it('exposes the profile pillars verbatim for the cover page in every locale', () => {
    for (const lang of locales) {
      const { pillars } = buildPortfolioDocument(lang);
      const source = getResumeData(lang).introduction.pillars ?? [];

      expect(pillars.length).toBeGreaterThan(0);
      expect(pillars).toEqual(source);
      for (const pillar of pillars) {
        expect(pillar.index.trim()).not.toBe('');
        expect(pillar.title.trim()).not.toBe('');
        expect(pillar.description.trim()).not.toBe('');
      }
    }
  });

  it('lists up to three images per project with the representative shot first', () => {
    for (const lang of locales) {
      const blocks = collectBlocks(buildPortfolioDocument(lang));

      expect(blocks.filter((block) => block.images.length > 0).length).toBeGreaterThan(0);

      for (const block of blocks) {
        const project = catalogProjectById.get(block.id);
        const screenshot = project?.content[lang].detailMetadata?.image;
        const hasScreenshot = Boolean(screenshot) && screenshot !== 'null';

        expect(block.images.length).toBeLessThanOrEqual(3);
        expect(new Set(block.images).size).toBe(block.images.length);
        expect(block.images.every((image) => image.startsWith('/images/'))).toBe(true);
        // ProjectItem.thumbnail prefers the icon; the document never shows it.
        expect(block.images).not.toContain(project?.icon);

        // Frontmatter is the chosen representative shot, so it leads the row.
        if (hasScreenshot) expect(block.images[0]).toBe(screenshot);
      }
    }
  });

  it('leaves every project that declares no screenshot without a figure', () => {
    const imagelessIds: readonly string[] = [
      PROJECT_ID.adminDashboard,
      PROJECT_ID.agenticWorkflow,
      PROJECT_ID.camerafiStudio,
      PROJECT_ID.campusTown,
      PROJECT_ID.dayPlanner,
      PROJECT_ID.kftcPlatform,
      PROJECT_ID.mndDashboard,
      PROJECT_ID.webViewer,
    ];

    for (const lang of locales) {
      const imageless = collectBlocks(buildPortfolioDocument(lang)).filter((block) =>
        imagelessIds.includes(block.id),
      );

      expect(imageless.map((block) => block.id).sort()).toEqual([...imagelessIds].sort());
      for (const block of imageless) {
        expect(block.images).toEqual([]);
      }
    }
  });
});

describe('generated project images', () => {
  it('keeps the checked-in manifest in step with the MDX bodies', () => {
    const expected: Record<string, string[]> = {};

    for (const slug of projectSlugs()) {
      const images = extractProjectImages(readProjectDetail(slug, 'ko'));
      if (images.length > 0) expected[slug] = images;
    }

    // A stale manifest would silently feed the document an older curation.
    expect(generatedProjectImages).toEqual(expected);
  });

  it('declares the same screenshots in both locales so one manifest feeds both documents', () => {
    for (const slug of projectSlugs()) {
      expect(extractDeclaredImages(readProjectDetail(slug, 'en')), `${slug}/en`).toEqual(
        extractDeclaredImages(readProjectDetail(slug, 'ko')),
      );
    }
  });

  it('records an intrinsic size for every listed screenshot, so its row can be measured', () => {
    const sizes: Readonly<Record<string, unknown>> = generatedImages;

    for (const [slug, images] of Object.entries(generatedProjectImages)) {
      for (const image of images) {
        expect(sizes[image], `${slug} ${image}`).toBeDefined();
      }
    }
  });
});
