import { describe, expect, it } from 'vitest';

import { parseContentOverrideRequest } from '@/lib/server/contentOverrideRequest';

describe('parseContentOverrideRequest', () => {
  it('accepts a valid home content override payload', () => {
    expect(
      parseContentOverrideRequest({
        area: 'home',
        locale: 'ko',
        payload: {
          githubLink: 'https://github.com/junwonp',
          linkedinLink: 'https://www.linkedin.com/in/junwonp',
          name: 'Junwon Park',
          role: 'Frontend Engineer',
          tagline: 'Updated',
        },
        targetKey: 'introduction',
      }),
    ).toEqual({
      ok: true,
      value: {
        area: 'home',
        locale: 'ko',
        payload: {
          githubLink: 'https://github.com/junwonp',
          linkedinLink: 'https://www.linkedin.com/in/junwonp',
          name: 'Junwon Park',
          role: 'Frontend Engineer',
          tagline: 'Updated',
        },
        overrides: [
          {
            area: 'home',
            locale: 'ko',
            payload: {
              githubLink: 'https://github.com/junwonp',
              linkedinLink: 'https://www.linkedin.com/in/junwonp',
              name: 'Junwon Park',
              role: 'Frontend Engineer',
              tagline: 'Updated',
            },
            targetKey: 'introduction',
          },
        ],
        targetKey: 'introduction',
      },
    });
  });

  it('accepts localized payloads in one content override request', () => {
    expect(
      parseContentOverrideRequest({
        area: 'home',
        locale: 'ko',
        payloadByLocale: {
          ko: { tagline: '한국어 소개' },
          en: { tagline: 'English intro' },
        },
        targetKey: 'introduction',
      }),
    ).toEqual({
      ok: true,
      value: {
        area: 'home',
        locale: 'ko',
        payload: { tagline: '한국어 소개' },
        targetKey: 'introduction',
        overrides: [
          {
            area: 'home',
            locale: 'ko',
            payload: { tagline: '한국어 소개' },
            targetKey: 'introduction',
          },
          {
            area: 'home',
            locale: 'en',
            payload: { tagline: 'English intro' },
            targetKey: 'introduction',
          },
        ],
      },
    });
  });

  it('rejects localized payloads with invalid locale keys or invalid localized data', () => {
    expect(
      parseContentOverrideRequest({
        area: 'home',
        locale: 'ko',
        payloadByLocale: {
          ko: { tagline: '한국어 소개' },
          ja: { tagline: 'Japanese intro' },
        },
        targetKey: 'introduction',
      }),
    ).toMatchObject({ ok: false });

    expect(
      parseContentOverrideRequest({
        area: 'home',
        locale: 'ko',
        payloadByLocale: {
          ko: { tagline: '한국어 소개' },
          en: { tagline: 42 },
        },
        targetKey: 'introduction',
      }),
    ).toMatchObject({ ok: false });
  });

  it('accepts company-level work experience payloads with nested project edits', () => {
    expect(
      parseContentOverrideRequest({
        area: 'home',
        locale: 'ko',
        payload: [
          {
            companyName: 'Example Inc.',
            titleBadge: 'Client',
            role: 'Frontend Engineer',
            dateFrom: '2024-01',
            dateTo: '',
            highlights: ['Built structured editing UI'],
            project: [
              {
                id: 'structured_editor',
                title: 'Structured Editor',
                description: 'Company-scoped editing workflow',
                dateFrom: '2024-01',
                dateTo: '',
                detailLink: '',
                detail: ['Edited as one project item'],
                featuredSkills: ['React'],
                skills: ['React', 'TypeScript'],
                metrics: [{ value: '1', label: 'Editor flow' }],
              },
            ],
          },
        ],
        targetKey: 'workExperiences',
      }),
    ).toMatchObject({ ok: true });
  });

  it('rejects unregistered skill chips in editable project payloads', () => {
    expect(
      parseContentOverrideRequest({
        area: 'home',
        locale: 'ko',
        payload: [
          {
            companyName: 'Example Inc.',
            role: 'Frontend Engineer',
            dateFrom: '2024-01',
            project: [
              {
                id: 'structured_editor',
                title: 'Structured Editor',
                description: 'Company-scoped editing workflow',
                dateFrom: '2024-01',
                detail: ['Edited as one project item'],
                featuredSkills: ['Unknown Runtime'],
                skills: ['React', 'Unknown Runtime'],
              },
            ],
          },
        ],
        targetKey: 'workExperiences',
      }),
    ).toMatchObject({ ok: false });

    expect(
      parseContentOverrideRequest({
        area: 'project-detail',
        locale: 'ko',
        payload: { list: ['React', 'Unknown Runtime'] },
        targetKey: 'my-project::techStack',
      }),
    ).toMatchObject({ ok: false });

    expect(
      parseContentOverrideRequest({
        area: 'project-detail',
        locale: 'ko',
        payload: { techStack: ['React', 'Unknown Runtime'] },
        targetKey: 'my-project::metadata',
      }),
    ).toMatchObject({ ok: false });
  });

  it('rejects malformed year-month values in editable date fields', () => {
    expect(
      parseContentOverrideRequest({
        area: 'home',
        locale: 'ko',
        payload: [
          {
            companyName: 'Example Inc.',
            role: 'Frontend Engineer',
            dateFrom: '2024-13',
            dateTo: '',
            highlights: [],
            project: [],
          },
        ],
        targetKey: 'workExperiences',
      }),
    ).toMatchObject({ ok: false });

    expect(
      parseContentOverrideRequest({
        area: 'home',
        locale: 'ko',
        payload: [
          {
            project: [
              {
                id: 'bad_project',
                title: 'Bad Project',
                description: 'Invalid month format',
                dateFrom: '2024-1',
                dateTo: '',
                detail: [],
              },
            ],
          },
        ],
        targetKey: 'archives',
      }),
    ).toMatchObject({ ok: false });
  });

  it('keeps existing year-only date values valid for legacy content', () => {
    expect(
      parseContentOverrideRequest({
        area: 'home',
        locale: 'ko',
        payload: [
          {
            project: [
              {
                id: 'legacy_project',
                title: 'Legacy Project',
                description: 'Existing year-only content',
                dateFrom: '2024',
                dateTo: '',
                detail: [],
              },
            ],
          },
        ],
        targetKey: 'archives',
      }),
    ).toMatchObject({ ok: true });
  });

  it('accepts valid project detail override payloads', () => {
    expect(
      parseContentOverrideRequest({
        area: 'project-detail',
        locale: 'ko',
        payload: { markdown: 'Updated section' },
        targetKey: 'my-project::overview',
      }),
    ).toMatchObject({ ok: true });

    expect(
      parseContentOverrideRequest({
        area: 'project-detail',
        locale: 'ko',
        payload: { list: ['React', 'TypeScript'] },
        targetKey: 'my-project::techStack',
      }),
    ).toMatchObject({ ok: true });

    expect(
      parseContentOverrideRequest({
        area: 'project-detail',
        locale: 'ko',
        payload: {
          image: '',
          title: 'Updated project',
          metrics: [{ value: '80%+', label: 'API load saved' }],
          techStack: ['React', 'TypeScript'],
        },
        targetKey: 'my-project::metadata',
      }),
    ).toMatchObject({ ok: true });

    expect(
      parseContentOverrideRequest({
        area: 'project-detail',
        locale: 'ko',
        payload: {
          blocks: [
            {
              id: 'overview',
              type: 'markdown',
              markdown: '## Overview\n\nUpdated section',
            },
            {
              id: 'stack',
              type: 'techStack',
            },
            {
              id: 'work',
              type: 'achievements',
              achievements: [
                {
                  tag: 'Performance',
                  accent: true,
                  title: 'Reduced API load',
                  detail: 'Cached upstream responses with **Redis**.',
                },
              ],
            },
            {
              id: 'screenshots',
              type: 'lightbox',
              variant: 'phone',
              images: [
                {
                  src: '/images/example/home.webp',
                  mobileSrc: '',
                  alt: 'Home screen',
                  caption: 'Main screen',
                },
              ],
            },
            {
              id: 'demo',
              type: 'mediaGallery',
              images: [
                {
                  src: '/images/example/demo.mp4',
                  alt: 'Demo video',
                },
              ],
            },
            {
              id: 'flow',
              type: 'mermaid',
              eyebrow: 'Flow',
              title: 'Data flow',
              chart: 'flowchart TD\nA --> B',
            },
          ],
        },
        targetKey: 'my-project::blocks',
      }),
    ).toMatchObject({ ok: true });
  });

  it('rejects invalid locale, area, or target keys before touching D1', () => {
    expect(
      parseContentOverrideRequest({
        area: 'bad',
        locale: 'ko',
        payload: {},
        targetKey: 'introduction',
      }),
    ).toMatchObject({ ok: false });

    expect(
      parseContentOverrideRequest({
        area: 'home',
        locale: 'ja',
        payload: {},
        targetKey: 'introduction',
      }),
    ).toMatchObject({ ok: false });

    expect(
      parseContentOverrideRequest({
        area: 'home',
        locale: 'ko',
        payload: {},
        targetKey: '../secret',
      }),
    ).toMatchObject({ ok: false });

    expect(
      parseContentOverrideRequest({
        area: 'home',
        locale: 'ko',
        payload: { tagline: 'Updated', extra: true },
        targetKey: 'introduction',
      }),
    ).toMatchObject({ ok: false });

    expect(
      parseContentOverrideRequest({
        area: 'project-detail',
        locale: 'ko',
        payload: { markdown: '' },
        targetKey: 'my-project::overview',
      }),
    ).toMatchObject({ ok: false });

    expect(
      parseContentOverrideRequest({
        area: 'project-detail',
        locale: 'ko',
        payload: {
          blocks: [],
        },
        targetKey: 'my-project::blocks',
      }),
    ).toMatchObject({ ok: false });

    expect(
      parseContentOverrideRequest({
        area: 'project-detail',
        locale: 'ko',
        payload: {
          blocks: [
            {
              id: 'bad',
              type: 'lightbox',
              images: [{ src: 'https://example.com/image.png', alt: 'External' }],
            },
          ],
        },
        targetKey: 'my-project::blocks',
      }),
    ).toMatchObject({ ok: false });
  });
});
