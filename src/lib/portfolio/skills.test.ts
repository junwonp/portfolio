import { describe, expect, it } from 'vitest';

import {
  getSkillCategory,
  isRegisteredSkillName,
  registeredSkillNames,
  SKILL,
  skillGroups,
  skillGroupTitles,
} from '@/lib/portfolio/skills';

const skillGroupIds = [
  'languages',
  'frameworks',
  'ui',
  'state',
  'performance',
  'backend',
  'devops',
] as const;

// The display labels are the contract MDX frontmatter and the catalog validate against, so they are pinned by value rather than re-derived.
const expectedSkillGroupLists: Record<(typeof skillGroupIds)[number], string[]> = {
  languages: ['TypeScript', 'JavaScript', 'Swift'],
  frameworks: ['React', 'Next.js', 'React Native', 'Expo', 'SwiftUI'],
  ui: ['styled-components', 'MUI', 'Ant Design', 'Tailwind CSS', 'shadcn/ui'],
  state: ['TanStack Query', 'Zod', 'Zustand', 'Redux', 'GraphQL'],
  performance: ['Reanimated', 'FlashList', 'react-window', 'react-virtualized'],
  backend: ['Firebase', 'Supabase', 'Upstash', 'AWS', 'Socket.IO'],
  devops: ['GitHub Actions', 'Cloudflare', 'Sentry', 'Vitest', 'EAS', 'Webpack'],
};

const expectedSkillGroupTitles: Record<
  'en' | 'ko',
  Record<(typeof skillGroupIds)[number], string>
> = {
  en: {
    languages: 'Languages',
    frameworks: 'Frameworks',
    ui: 'UI & Design System',
    state: 'State & Data',
    performance: 'Animation & Performance',
    backend: 'Backend & Cloud',
    devops: 'DevOps & Infra',
  },
  ko: {
    languages: '언어',
    frameworks: '프레임워크',
    ui: 'UI 및 디자인 시스템',
    state: '상태 및 데이터',
    performance: '애니메이션 및 성능',
    backend: '백엔드 및 클라우드',
    devops: '데브옵스 및 인프라',
  },
};

describe('skill catalog', () => {
  it('keeps ordered localized groups limited to registered skill names', () => {
    const registeredSkillNames = new Set(Object.values(SKILL).flatMap(Object.values));

    expect(skillGroups.map((group) => group.id)).toEqual(skillGroupIds);
    expect(Object.keys(skillGroupTitles.en)).toEqual(skillGroupIds);
    expect(Object.keys(skillGroupTitles.ko)).toEqual(skillGroupIds);
    expect(skillGroupTitles.en).toMatchObject({
      backend: 'Backend & Cloud',
      languages: 'Languages',
      ui: 'UI & Design System',
    });
    expect(skillGroupTitles.ko).toMatchObject({
      backend: '백엔드 및 클라우드',
      languages: '언어',
      ui: 'UI 및 디자인 시스템',
    });
    expect(
      skillGroups.every((group) => group.list.every((skill) => registeredSkillNames.has(skill))),
    ).toBe(true);
  });

  it.each(skillGroupIds)('keeps the %s group in its displayed order', (id) => {
    const group = skillGroups.find((candidate) => candidate.id === id);

    expect(group?.list).toEqual(expectedSkillGroupLists[id]);
  });

  it.each(['en', 'ko'] as const)('keeps every %s skill group title', (locale) => {
    expect(skillGroupTitles[locale]).toEqual(expectedSkillGroupTitles[locale]);
  });

  it('exposes every group entry through registeredSkillNames without duplicates', () => {
    const expectedNames = skillGroupIds.flatMap((id) => expectedSkillGroupLists[id]);

    expect(registeredSkillNames).toEqual(expectedNames);
    expect(new Set(registeredSkillNames).size).toBe(registeredSkillNames.length);
  });

  it('counts exactly the registered label set as registered', () => {
    const expectedNames = new Set(skillGroupIds.flatMap((id) => expectedSkillGroupLists[id]));

    for (const skill of Object.values(SKILL).flatMap(Object.values)) {
      expect(isRegisteredSkillName(skill)).toBe(expectedNames.has(skill));
    }
    expect(isRegisteredSkillName('Unknown Runtime')).toBe(false);
  });

  it.each(skillGroupIds)('classifies every %s skill under its own group id', (id) => {
    for (const skill of expectedSkillGroupLists[id]) {
      expect(getSkillCategory(skill)).toBe(id);
    }
  });

  it('falls back to the default category for an unregistered skill', () => {
    expect(getSkillCategory('Unknown Runtime')).toBe('default');
  });
});
