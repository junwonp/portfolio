import { describe, expect, it } from 'vitest';

import { getFeaturedWebProjects, getResumeData, roleFitProjectPresets } from '$lib/data/resume';

describe('resume data for web frontend applications', () => {
  it('surfaces web frontend metrics in the introduction', () => {
    const resume = getResumeData('ko');
    const metricLabels = resume.introduction.metrics?.map((metric) => metric.label) ?? [];

    expect(resume.introduction.tagline).toContain('데이터 중심 웹 시스템');
    expect(metricLabels).toContain('행/로그 처리');
    expect(metricLabels).toContain('번들 절감');
    expect(metricLabels).toContain('API 부하 절감');
  });

  it('prioritizes representative web frontend projects', () => {
    const featured = getFeaturedWebProjects('ko');

    expect(featured.map((exp) => exp.project[0].id)).toEqual([
      'web_viewer',
      'admin_dashboard',
      'camerafi_studio',
      'today_weather',
      'aira',
    ]);
    expect(featured[1].project[0].detailLink).toBeUndefined();
    expect(featured[1].project[0].featuredSkills).toEqual([
      'TypeScript',
      'React',
      'React Table',
      'Chart.js',
      'TanStack Query',
      'MUI',
    ]);
  });

  it('keeps role-fit project presets grouped by use case', () => {
    expect(roleFitProjectPresets.web).toEqual([
      'camerafi_studio',
      'admin_dashboard',
      'web_viewer',
      'today_weather',
      'sveltekit_portfolio',
    ]);
    expect(roleFitProjectPresets.rn).toEqual([
      'aira',
      'today_weather',
      'onelinebank_rebuild',
      'day_planner',
    ]);
    expect(roleFitProjectPresets.webRn).toEqual([
      'today_weather',
      'aira',
      'onelinebank_rebuild',
      'camerafi_studio',
      'admin_dashboard',
    ]);
    expect(getFeaturedWebProjects('ko', 'rn').map((exp) => exp.project[0].id)).toEqual([
      'aira',
      'today_weather',
      'onelinebank_rebuild',
      'day_planner',
    ]);
  });
});
