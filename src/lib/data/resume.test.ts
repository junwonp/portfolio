import { describe, expect, it } from 'vitest';

import {
  getFeaturedWebProjects,
  getResumeData,
  getSummaryIntroduction,
  resolveFeaturedProjectIds,
  resolveSummaryPreset,
} from '$lib/data/resume';

describe('resume data for web frontend applications', () => {
  it('keeps the previous product-growth summary as the default introduction', () => {
    const resume = getResumeData('ko');
    const metricLabels = resume.introduction.metrics?.map((metric) => metric.label) ?? [];

    expect(resume.introduction.tagline).toContain('제품의 시작부터 성장까지');
    expect(metricLabels).toContain('MAU (최대)');
    expect(metricLabels).toContain('평균 체류시간');
    expect(metricLabels).toContain('구글 플레이');
  });

  it('surfaces web frontend metrics in the ops-data summary preset', () => {
    const summary = getSummaryIntroduction('ko', 'ops-data');
    const metricLabels = summary.metrics?.map((metric) => metric.label) ?? [];

    expect(summary.tagline).toContain('데이터 중심 웹 시스템');
    expect(metricLabels).toContain('행/로그 처리');
    expect(metricLabels).toContain('번들 절감');
    expect(metricLabels).toContain('API 부하 절감');
  });

  it('omits role-fit projects by default', () => {
    expect(getFeaturedWebProjects('ko')).toEqual([]);
  });

  it('returns role-fit projects in the requested order', () => {
    const featured = getFeaturedWebProjects('ko', [
      'today_weather',
      'web_viewer',
      'admin_dashboard',
    ]);

    expect(featured.map((exp) => exp.project[0].id)).toEqual([
      'today_weather',
      'web_viewer',
      'admin_dashboard',
    ]);
    expect(featured[2].project[0].detailLink).toBeUndefined();
    expect(featured[2].project[0].featuredSkills).toEqual([
      'TypeScript',
      'React',
      'React Table',
      'Chart.js',
      'TanStack Query',
      'MUI',
    ]);
  });

  it('resolves role-fit project ids from query params', () => {
    const params = new URLSearchParams(
      'projects=today_weather,web_viewer&projectIds=admin_dashboard&projectId=aira&projectId=today_weather',
    );

    expect(resolveFeaturedProjectIds(params)).toEqual([
      'today_weather',
      'web_viewer',
      'admin_dashboard',
      'aira',
    ]);
  });

  it('resolves summary presets for the opening intro', () => {
    expect(resolveSummaryPreset(null)).toBe('default');
    expect(resolveSummaryPreset('opsData')).toBe('ops-data');
    expect(resolveSummaryPreset('webRn')).toBe('web-rn');
    expect(resolveSummaryPreset('invalid')).toBe('default');

    const defaultSummary = getSummaryIntroduction('ko');
    const defaultMetricLabels = defaultSummary.metrics?.map((metric) => metric.label) ?? [];

    expect(defaultSummary.tagline).toContain('제품의 시작부터 성장까지');
    expect(defaultSummary.pillars?.[0].title).toBe('제품 오너십 및 성장');
    expect(defaultMetricLabels).toContain('MAU (최대)');
    expect(defaultMetricLabels).toContain('평균 체류시간');
    expect(defaultMetricLabels).toContain('구글 플레이');
    expect(getSummaryIntroduction('ko', 'ops-data').pillars?.[0].title).toBe('운영 웹 시스템');
    expect(getSummaryIntroduction('ko', 'web').pillars?.[0].title).toBe('제품형 UI 시스템');
    expect(getSummaryIntroduction('en', 'rn').pillars?.[0].title).toBe('Cross-Platform Mobile');
    expect(getSummaryIntroduction('en', 'web-rn').pillars?.[0].title).toBe(
      'Shared Code Architecture',
    );
  });
});
