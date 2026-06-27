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
        targetKey: 'introduction',
      },
    });
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
  });
});
