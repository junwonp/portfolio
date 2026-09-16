import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GITHUB_PROFILE, LINKEDIN_PROFILE } from '@/config/site';
import generatedImages from '@/lib/generated/images.json';
import generatedProjectImages from '@/lib/generated/projectImages.json';
import { projectCatalog } from '@/lib/portfolio/catalog';
import {
  buildPortfolioDocument,
  type DocumentProjectBlock,
  type DocumentProjectSection,
  type DocumentSection,
  formatPeriod,
  type PortfolioDocument,
} from '@/lib/portfolio/documentProjection';
import { getLabels } from '@/lib/portfolio/labels';
import * as resume from '@/lib/portfolio/resume';
import { getResumeData } from '@/lib/portfolio/resume';
import { PROJECT_ID, type ProjectContentEntry } from '@/lib/portfolio/types';

import {
  extractDeclaredImages,
  extractProjectImages,
  MAX_PROJECT_IMAGES,
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

const isProjectSection = (section: DocumentSection): section is DocumentProjectSection =>
  section.kind !== 'skills' && section.kind !== 'education';

const collectBlocks = (document: PortfolioDocument): DocumentProjectBlock[] =>
  document.sections.flatMap((section) => (isProjectSection(section) ? section.projects : []));

describe('buildPortfolioDocument', () => {
  afterEach(() => vi.restoreAllMocks());

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

  it('carries the skills groups and education entries on their own sections', () => {
    for (const lang of locales) {
      const { education, skills } = getResumeData(lang);
      const sections = buildPortfolioDocument(lang).sections;

      expect(sections[0]).toEqual({
        groups: skills.map((skill) => ({ title: skill.title, list: [...skill.list] })),
        kind: 'skills',
        title: getLabels(lang).sectionSkills,
      });
      expect(sections.at(-1)).toEqual({
        entries: [...education],
        kind: 'education',
        title: getLabels(lang).sectionEducation,
      });
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

  it.each(locales)('uses each project role before the career role in %s', (lang) => {
    const blocks = collectBlocks(buildPortfolioDocument(lang));
    const careers = getResumeData(lang).workExperiences;
    for (const project of projectCatalog) {
      const companyRole = careers.find((career) =>
        career.project.some((item) => item.id === project.id),
      )?.role;
      expect(blocks.find((block) => block.id === project.id)?.role, project.slug).toBe(
        project.content[lang].detailMetadata?.role || companyRole,
      );
    }
  });

  it.each(['hanyang-chatbot', 'kftc-platform', 'election-aggregator'])(
    'preserves the localized MDX role for %s',
    (slug) => {
      const project = projectCatalog.find((entry) => entry.slug === slug);
      expect(project).toBeDefined();
      for (const lang of locales) {
        const source = project?.content[lang].detailMetadata?.role;
        expect(source).toBeTruthy();
        expect(
          collectBlocks(buildPortfolioDocument(lang)).find((block) => block.id === project?.id)
            ?.role,
        ).toBe(source);
      }
    },
  );

  it.each(locales)('uses the detail-page date verbatim, including KFTC, in %s', (lang) => {
    const blocks = collectBlocks(buildPortfolioDocument(lang));
    for (const project of projectCatalog) {
      const date = project.content[lang].detailMetadata?.date;
      // ProjectDetailPage passes this field directly to its date badge.
      if (date)
        expect(blocks.find((block) => block.id === project.id)?.period, project.slug).toBe(date);
    }
  });

  it.each(locales)(
    'renders the normalized mnd-dashboard date in the shared scheme in %s',
    (lang) => {
      const block = collectBlocks(buildPortfolioDocument(lang)).find(
        (project) => project.id === PROJECT_ID.mndDashboard,
      );
      expect(
        catalogProjectById.get(PROJECT_ID.mndDashboard)?.content[lang].detailMetadata?.date,
      ).toBe('2019-06 ~ 2019-09');
      expect(block?.period).toBe('2019-06 ~ 2019-09');
    },
  );

  it.each(locales)('renders every project period in the shared scheme in %s', (lang) => {
    const { present } = getLabels(lang);
    // A project without a canonical date used to fall back to a dotted en-dash style; this locks
    // one scheme for the whole document, with the ongoing word localized.
    const shared = new RegExp(`^\\d{4}(?:-\\d{2})?(?: ~ (?:\\d{4}(?:-\\d{2})?|${present}))?$`);

    for (const block of collectBlocks(buildPortfolioDocument(lang))) {
      expect(block.period, block.id).toMatch(shared);
    }
  });

  it.each([
    // Frontmatter carries the canonical `date`, but the projection still needs a fallback for a
    // project that omits it; the fallback has to match the canonical scheme, not invented months.
    ['2019-06', '2019-09', '현재', '2019-06 ~ 2019-09'],
    ['2024', undefined, '현재', '2024 ~ 현재'],
    ['2026-04', undefined, 'Present', '2026-04 ~ Present'],
    ['2021-11', '2021-11', 'Present', '2021-11'],
    ['2026-04-22', '2026-05-03', 'Present', '2026-04 ~ 2026-05'],
    ['', '2019-09', 'Present', ''],
  ])(
    'formats structured dates (%s, %s) as the fallback period',
    (dateFrom, dateTo, presentLabel, expected) => {
      expect(formatPeriod(dateFrom, dateTo, presentLabel)).toBe(expected);
    },
  );

  it.each(locales)('emits directly usable absolute contact URLs in %s', (lang) => {
    const { contact } = buildPortfolioDocument(lang);
    expect(contact).toEqual({ githubLink: GITHUB_PROFILE, linkedinLink: LINKEDIN_PROFILE });
    for (const link of Object.values(contact)) {
      expect(new URL(link).protocol).toBe('https:');
    }
  });

  it('preserves replacement absolute contact URLs and hides empty contacts', () => {
    const source = getResumeData('ko');
    const contact = { githubLink: 'https://github.com/example', linkedinLink: '' };
    vi.spyOn(resume, 'getResumeData').mockReturnValue({
      ...source,
      introduction: { ...source.introduction, ...contact },
    });
    expect(buildPortfolioDocument('ko').contact).toEqual(contact);
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

  it('exposes per-locale platforms and resolved links', () => {
    const aira = collectBlocks(buildPortfolioDocument('ko')).find(
      (block) => block.id === PROJECT_ID.aira,
    );

    expect(aira?.platforms).toEqual(['Android', 'iOS', 'Web']);

    for (const lang of locales) {
      for (const block of collectBlocks(buildPortfolioDocument(lang))) {
        const project = catalogProjectById.get(block.id);

        expect(block.platforms).toEqual(project?.content[lang].detailMetadata?.platforms ?? []);
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

        expect(block.images.length).toBeLessThanOrEqual(MAX_PROJECT_IMAGES);
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
