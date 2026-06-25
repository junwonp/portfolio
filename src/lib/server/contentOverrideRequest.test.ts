import { describe, expect, it } from 'vitest';

import { parseContentOverrideRequest } from '@/lib/server/contentOverrideRequest';

describe('parseContentOverrideRequest', () => {
  it('accepts a valid home content override payload', () => {
    expect(
      parseContentOverrideRequest({
        area: 'home',
        locale: 'ko',
        payload: { introduction: { tagline: 'Updated' } },
        targetKey: 'introduction',
      }),
    ).toEqual({
      ok: true,
      value: {
        area: 'home',
        locale: 'ko',
        payload: { introduction: { tagline: 'Updated' } },
        targetKey: 'introduction',
      },
    });
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
  });
});
