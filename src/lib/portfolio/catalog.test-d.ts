import { describe, expectTypeOf, it } from 'vitest';

import { projectCatalog } from '@/lib/portfolio/catalog';
import type { PostMetadata } from '@/lib/portfolio/projectTypes';
import {
  isRegisteredSkillName,
  registeredSkillNames,
  type SkillName,
} from '@/lib/portfolio/skills';
import { getProjectTechStackGroups, type ProjectTechStackGroup } from '@/lib/portfolio/techStack';
import type { ProjectContentEntry } from '@/lib/portfolio/types';

// Locks the MDX-frontmatter -> catalog -> registered-skill chain: a widened or narrowed link still compiles at call sites, so a runtime chip would silently drop.
describe('portfolio content contracts', () => {
  it('keeps MDX frontmatter techStack as untyped strings at the authoring boundary', () => {
    expectTypeOf<NonNullable<PostMetadata['techStack']>>().toEqualTypeOf<string[]>();
  });

  it('narrows catalog skills to registered skill names', () => {
    expectTypeOf<NonNullable<ProjectContentEntry['skills']>>().toEqualTypeOf<SkillName[]>();
    expectTypeOf<NonNullable<ProjectContentEntry['featuredSkills']>>().toEqualTypeOf<SkillName[]>();
    expectTypeOf(registeredSkillNames).toEqualTypeOf<SkillName[]>();
  });

  it('keeps SkillName a literal union rather than widening to string', () => {
    // Without `as const`, every chip accepts an arbitrary string and isRegisteredSkillName means nothing.
    expectTypeOf<SkillName>().toMatchTypeOf<string>();
    expectTypeOf<string>().not.toMatchTypeOf<SkillName>();
  });

  it('exposes isRegisteredSkillName as the guard that performs that narrowing', () => {
    expectTypeOf(isRegisteredSkillName).guards.toEqualTypeOf<SkillName>();
    expectTypeOf(isRegisteredSkillName).parameter(0).toEqualTypeOf<string>();
  });

  it('groups a project tech stack by registered SkillId categories', () => {
    expectTypeOf(getProjectTechStackGroups).returns.toEqualTypeOf<ProjectTechStackGroup[]>();
    expectTypeOf<ProjectTechStackGroup['id']>().toEqualTypeOf<
      import('@/lib/portfolio/skills').SkillId
    >();
  });

  it('derives the catalog section union from the same id constants the app uses', () => {
    expectTypeOf(projectCatalog).items.toHaveProperty('id');
    expectTypeOf(projectCatalog).items.toHaveProperty('section');
  });
});
