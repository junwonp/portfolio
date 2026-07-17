import { describe, expect, it } from 'vitest';

import {
  createHomePageData,
  resolveHomeTailoredViewFromSearchParams,
} from '@/lib/portfolio/homePage';

describe('resolveHomeTailoredViewFromSearchParams', () => {
  it('applies role presets from public home query params', () => {
    const tailoredView = resolveHomeTailoredViewFromSearchParams({
      role: 'webFrontend',
    });

    expect(tailoredView).toEqual({
      summaryPreset: 'web',
      projectIds: ['camerafi_studio', 'today_weather', 'web_viewer', 'admin_dashboard'],
    });
  });

  it('supports the existing short query aliases without overriding canonical params', () => {
    const tailoredView = resolveHomeTailoredViewFromSearchParams({
      p: 'aira,today_weather',
      preset: 'ai',
      projects: 'web_viewer',
      summary: 'web',
      v: 'reactNative',
    });

    expect(tailoredView).toEqual({
      summaryPreset: 'web',
      projectIds: ['web_viewer'],
    });
  });
});

describe('createHomePageData', () => {
  it('uses selected projects by default when no tailored project ids are provided', () => {
    const data = createHomePageData({
      locale: 'ko',
      tailoredView: {
        summaryPreset: 'default',
        projectIds: [],
      },
    });

    expect(data.featuredProjectsMode).toBe('selected');
    expect(data.featuredWebProjects.map((experience) => experience.project[0].id)).toEqual([
      'aira',
      'today_weather',
      'nextjs_portfolio',
      'kftc_platform',
    ]);
    expect(data.navSections).toContainEqual({
      id: 'section-featured',
      label: '대표 프로젝트',
    });
  });

  it('builds featured project data and navigation from the resolved tailored view', () => {
    const data = createHomePageData({
      locale: 'ko',
      tailoredView: {
        summaryPreset: 'web',
        projectIds: ['today_weather', 'web_viewer'],
      },
    });

    expect(data.featuredWebProjects.map((experience) => experience.project[0].id)).toEqual([
      'today_weather',
      'web_viewer',
    ]);
    expect(data.featuredProjectsMode).toBe('role-fit');
    expect(data.summaryIntroduction.tagline).toContain('확장 가능한 웹 제품');
    expect(data.navSections).toContainEqual({
      id: 'section-featured',
      label: '직무 적합 프로젝트',
    });
  });

  it('resolves stored project slugs in tailored short-link data', () => {
    const data = createHomePageData({
      locale: 'ko',
      tailoredView: {
        summaryPreset: 'web',
        projectIds: ['aira', 'today-weather'],
      },
    });

    expect(data.featuredWebProjects.map((experience) => experience.project[0].id)).toEqual([
      'aira',
      'today_weather',
    ]);
  });

  it('returns only the public page data contract', () => {
    const data = createHomePageData({
      locale: 'en',
      tailoredView: {
        summaryPreset: 'default',
        projectIds: [],
      },
    });

    expect(Object.keys(data).sort()).toEqual([
      'featuredProjectsMode',
      'featuredWebProjects',
      'labels',
      'locale',
      'navSections',
      'resumeData',
      'summaryIntroduction',
    ]);
  });
});
