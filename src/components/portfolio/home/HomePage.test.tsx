import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

interface DynamicRender {
  name: 'BentoSkills' | 'WorkAccordion';
  props: Record<string, unknown>;
}

// Recording stubs keep the server render synchronous while proving HomePage wired the data in; loaders are invoked to assert they point at real modules.
const dynamicRenders = vi.hoisted(() => [] as DynamicRender[]);
const dynamicLoaders = vi.hoisted(() => [] as Array<Promise<unknown>>);

vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<unknown>) => {
    dynamicLoaders.push(loader());
    return (props: Record<string, unknown>) => {
      dynamicRenders.push({ name: 'skills' in props ? 'BentoSkills' : 'WorkAccordion', props });
      return null;
    };
  },
}));

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn() }),
}));

import HomePage from '@/components/portfolio/home/HomePage';
import { LocaleProvider } from '@/lib/contexts/LocaleContext';
import { createHomePageData } from '@/lib/portfolio/homePage';
import type { HomePageData } from '@/lib/portfolio/homeTypes';

const createData = (): HomePageData =>
  createHomePageData({
    locale: 'ko',
    tailoredView: { projectIds: [], summaryPreset: 'default' },
  });

const renderHome = (data: HomePageData): string =>
  renderToStaticMarkup(
    <LocaleProvider initialLocale={data.locale}>
      <HomePage data={data} />
    </LocaleProvider>,
  );

beforeEach(() => {
  dynamicRenders.length = 0;
});

describe('HomePage', () => {
  it('renders the intro, work, skills, awards, archives, and education sections for the default view', () => {
    const data = createData();
    const html = renderHome(data);

    expect(html).toContain('data-portfolio-layout="true"');
    expect(html).toContain('id="section-intro"');
    expect(html).toContain('id="section-featured"');
    expect(html).toContain('aria-labelledby="section-featured-heading"');
    expect(html).toContain('id="section-featured-heading"');
    expect(html).toContain('id="section-work"');
    expect(html).toContain('id="section-skills"');
    expect(html).toContain('id="section-projects"');
    expect(html).toContain('id="section-archives"');
    expect(html).toContain('id="section-education"');
    expect(html).toContain('Page sections');
    expect(html).toContain('Quick navigation header');
    expect(html).toMatch(/--enter-delay:\s*90ms/);
    expect(html).toMatch(/--enter-delay:\s*180ms/);
  });

  it('titles the featured section from the selected-projects label in the default view', () => {
    const data = createData();
    const html = renderHome(data);

    expect(data.featuredProjectsMode).toBe('selected');
    expect(html).toContain(data.labels.sectionSelectedProjects);
    expect(html).not.toContain(data.labels.sectionFeaturedProjects);
  });

  it('titles the featured section from the role-fit label when the view is tailored', () => {
    const data = createHomePageData({
      locale: 'ko',
      tailoredView: { projectIds: ['today_weather'], summaryPreset: 'default' },
    });
    const html = renderHome(data);

    expect(data.featuredProjectsMode).toBe('role-fit');
    expect(html).toContain(data.labels.sectionFeaturedProjects);
  });

  it('passes the resume data into the dynamic skills and work sections once', () => {
    const data = createData();
    renderHome(data);

    const bento = dynamicRenders.find((entry) => entry.name === 'BentoSkills');
    const accordion = dynamicRenders.find((entry) => entry.name === 'WorkAccordion');

    expect(bento?.props.locale).toBe('ko');
    expect(bento?.props.skills).toBe(data.resumeData.skills);
    expect(accordion?.props.locale).toBe('ko');
    expect(accordion?.props.experiences).toBe(data.resumeData.workExperiences);
  });

  it('resolves both dynamic section loaders to real component modules', async () => {
    renderHome(createData());

    const modules = await Promise.all(dynamicLoaders);

    expect(modules).toHaveLength(2);
    for (const module of modules) {
      expect(typeof (module as { default?: unknown }).default).toBe('function');
    }
    expect(dynamicRenders.map((entry) => entry.name).sort()).toEqual([
      'BentoSkills',
      'WorkAccordion',
    ]);
  });

  it('drops the work and featured sections when there are no work experiences', () => {
    const data = createData();
    const html = renderHome({
      ...data,
      resumeData: { ...data.resumeData, workExperiences: [] },
    });

    expect(html).not.toContain('id="section-work"');
    expect(html).not.toContain('id="section-featured"');
    expect(html).toContain('id="section-skills"');
    expect(dynamicRenders.some((entry) => entry.name === 'WorkAccordion')).toBe(false);
  });

  it('keeps the work section but drops the featured section when no featured projects are resolved', () => {
    const data = createData();
    const html = renderHome({ ...data, featuredWebProjects: [] });

    expect(html).not.toContain('id="section-featured"');
    expect(html).toContain('id="section-work"');
  });

  it('drops the awards and archives sections when those lists are empty', () => {
    const data = createData();
    const html = renderHome({
      ...data,
      resumeData: { ...data.resumeData, archives: [], otherExperiences: [] },
    });

    expect(html).not.toContain('id="section-projects"');
    expect(html).not.toContain('id="section-archives"');
    expect(html).toContain('id="section-education"');
  });

  it('renders the education entries from the resume data', () => {
    const data = createData();
    const html = renderHome(data);

    expect(data.resumeData.education.length).toBeGreaterThan(0);
    expect(html).toContain(data.resumeData.education[0].school);
    expect(html).toContain(data.summaryIntroduction.tagline);
  });
});
