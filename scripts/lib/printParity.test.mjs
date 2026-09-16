import { describe, expect, it } from 'vitest';

import { compareProjectSurfaces, evaluateParity, normalizeUrl } from './printParity.mjs';

const block = (overrides = {}) => ({
  links: [],
  period: '2026-03 ~ 2026-06',
  role: 'Frontend Engineer (Freelance)',
  title: 'KFTC FinCert Marketing Platform',
  ...overrides,
});

const detail = (overrides = {}) => ({
  badges: [
    { text: 'Frontend Engineer (Freelance)', variant: 'primary' },
    { text: '2026-03 ~ 2026-06', variant: 'sub' },
  ],
  links: [],
  period: '2026-03 ~ 2026-06',
  role: 'Frontend Engineer (Freelance)',
  title: 'KFTC FinCert Marketing Platform',
  ...overrides,
});

const compare = (blockOverrides, detailOverrides) =>
  compareProjectSurfaces({
    block: block(blockOverrides),
    detail: detail(detailOverrides),
    slug: 'kftc-platform',
  });

describe('normalizeUrl', () => {
  it('treats a trailing slash as navigation noise', () => {
    expect(normalizeUrl('https://github.com/junwonp/ ')).toBe('https://github.com/junwonp');
  });
});

describe('compareProjectSurfaces', () => {
  it('passes when both surfaces agree on role, period and links', () => {
    expect(compare()).toEqual({ failures: [], notes: [] });
  });

  it('names the project, field and both values when the company role is injected', () => {
    const result = compare({ role: 'Frontend Developer' });

    expect(result.failures).toEqual([
      'kftc-platform · role · the detail page renders “Frontend Engineer (Freelance)” but the document renders “Frontend Developer”',
    ]);
  });

  it('names both values when the period comes from a different date field', () => {
    const result = compare({ period: '2024-01 ~ 2026-07' });

    expect(result.failures).toEqual([
      'kftc-platform · period · the detail page renders “2026-03 ~ 2026-06” but the document renders “2024-01 ~ 2026-07”',
    ]);
  });

  it('fails when the document drops a field the detail page renders', () => {
    const result = compare({ role: null });

    expect(result.failures).toEqual([
      'kftc-platform · role · the detail page renders “Frontend Engineer (Freelance)” but the document renders nothing',
    ]);
  });

  it('reports a projection fallback as a note when the detail page renders no field', () => {
    const result = compare({ role: 'Frontend Developer' }, { badges: [], role: null });

    expect(result.failures).toEqual([]);
    expect(result.notes).toEqual([
      'kftc-platform · role · the document shows “Frontend Developer” while the detail page renders no role badge (projection fallback)',
    ]);
  });

  it('fails when the field text moves to a badge the check does not treat as that field', () => {
    const result = compare(
      {},
      { badges: [{ text: 'Frontend Engineer (Freelance)', variant: 'orange' }], role: null },
    );

    expect(result.failures).toEqual([
      'kftc-platform · role · the document renders “Frontend Engineer (Freelance)” but no role badge carries it on the detail page (badges: [orange=Frontend Engineer (Freelance)])',
    ]);
  });

  it('fails when the hero badge contract gains an unknown variant', () => {
    const result = compare(
      {},
      {
        badges: [
          { text: 'Frontend Engineer (Freelance)', variant: 'primary' },
          { text: '2026-03 ~ 2026-06', variant: 'teal' },
        ],
      },
    );

    expect(result.failures).toEqual([
      'kftc-platform · badges · the detail hero renders an unrecognised badge variant ([teal]) — the badge contract this check reads changed',
    ]);
  });

  it('fails on link drift in either direction', () => {
    const documentSide = compare({ links: ['https://github.com/junwonp/kftc'] });
    const detailSide = compare({}, { links: ['https://github.com/junwonp/kftc'] });

    expect(documentSide.failures).toEqual([
      'kftc-platform · links · the detail page renders [] but the document renders [https://github.com/junwonp/kftc]',
    ]);
    expect(detailSide.failures).toEqual([
      'kftc-platform · links · the detail page renders [https://github.com/junwonp/kftc] but the document renders []',
    ]);
  });

  it('fails when a link is rendered twice', () => {
    const result = compare({ links: ['https://a.example', 'https://a.example'] });

    expect(result.failures).toEqual([
      'kftc-platform · links · the detail page renders [] but the document renders [https://a.example, https://a.example]',
    ]);
  });

  it('accepts the same link written with a trailing slash', () => {
    const result = compare({ links: ['https://a.example'] }, { links: ['https://a.example/'] });

    expect(result).toEqual({ failures: [], notes: [] });
  });
});

describe('evaluateParity', () => {
  const project = (slug, surface) => ({ detail: detail(surface), slug });
  const skipped = ['campus-town', 'day-planner', 'mnd-dashboard'];

  it('pairs a detail surface with the document block carrying the same title', () => {
    const result = evaluateParity({
      blocks: [block()],
      projects: [project('kftc-platform', {})],
      skippedSlugs: [],
    });

    expect(result.failures).toEqual([]);
    expect(result.matched).toBe(1);
    expect(result.orphans).toEqual([]);
  });

  it('fails when the document has no block for a routed project', () => {
    const result = evaluateParity({
      blocks: [],
      projects: [project('aira', {})],
      skippedSlugs: [],
    });

    expect(result.failures).toEqual([
      'aira · title · the detail page renders “KFTC FinCert Marketing Platform” but no document block carries that title',
    ]);
  });

  it('fails on two blocks sharing a title', () => {
    const result = evaluateParity({
      blocks: [block(), block()],
      projects: [],
      skippedSlugs: [],
    });

    expect(result.failures).toContain(
      'two document blocks carry the title “KFTC FinCert Marketing Platform” — projects must be distinguishable',
    );
  });

  it('accepts one unrouted block per 404 route and reports them as skipped', () => {
    const unrouted = skipped.map((_slug, index) =>
      block({ period: '2024-01 ~ 2024-02', title: `Unrouted ${index}` }),
    );
    const routed = project('kftc-platform', {});
    const result = evaluateParity({
      blocks: [block(), ...unrouted],
      projects: [routed],
      skippedSlugs: skipped,
    });

    expect(result.failures).toEqual([]);
    expect(result.matched).toBe(1);
    expect(result.skipped).toEqual(skipped);
    expect(result.orphans.map((orphan) => orphan.title)).toEqual([
      'Unrouted 0',
      'Unrouted 1',
      'Unrouted 2',
    ]);
  });

  it('fails when the content tree and the document disagree about unrouted projects', () => {
    const result = evaluateParity({
      blocks: [block(), block({ title: 'Campus Town' })],
      projects: [project('kftc-platform', {})],
      skippedSlugs: skipped,
    });

    expect(result.failures).toEqual([
      'the content tree and the document disagree about unrouted projects: route(s) 404 — [campus-town, day-planner, mnd-dashboard] — but block(s) match no route — [“Campus Town”]',
    ]);
  });

  it('fails on a block that carries no title', () => {
    const result = evaluateParity({
      blocks: [block(), block({ title: '' })],
      projects: [],
      skippedSlugs: [],
    });

    expect(result.failures).toContain(
      'a document block carries no title (role: “Frontend Engineer (Freelance)”)',
    );
  });

  it('fails when no compared route rendered a role or a period at all', () => {
    const result = evaluateParity({
      blocks: [block()],
      projects: [project('kftc-platform', { badges: [], period: null, role: null })],
      skippedSlugs: [],
    });

    expect(result.failures).toEqual([
      'no detail page rendered a role (1 route(s) read) — the hero field this check compares is gone',
      'no detail page rendered a period (1 route(s) read) — the hero field this check compares is gone',
    ]);
    expect(result.notes).toHaveLength(2);
  });
});
