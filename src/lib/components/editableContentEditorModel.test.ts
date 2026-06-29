import { describe, expect, it } from 'vitest';

import {
  formatMarkdownListTextarea,
  isMarkdownListTextareaField,
  isMonthInputField,
  labelFor,
  parseMarkdownListTextarea,
  syncFeaturedSkillsWithSkills,
} from './editableContentEditorModel';

describe('markdown list textarea helpers', () => {
  it('parses markdown bullet lines into project detail items', () => {
    expect(
      parseMarkdownListTextarea(`
- **[Role]** Built the editor flow.
* Added skill picker reuse.

Plain follow-up line
`),
    ).toEqual([
      '**[Role]** Built the editor flow.',
      'Added skill picker reuse.',
      'Plain follow-up line',
    ]);
  });

  it('formats project detail items as markdown bullets for editing', () => {
    expect(formatMarkdownListTextarea(['**[Role]** Built the editor flow.', 'Plain line'])).toBe(
      '- **[Role]** Built the editor flow.\n- Plain line',
    );
  });

  it('uses markdown list textarea editing for details and highlights', () => {
    expect(isMarkdownListTextareaField('detail')).toBe(true);
    expect(isMarkdownListTextareaField('highlights')).toBe(true);
    expect(isMarkdownListTextareaField('skills')).toBe(false);
  });
});

describe('syncFeaturedSkillsWithSkills', () => {
  it('removes featured skills that are not part of the regular skills list', () => {
    expect(
      syncFeaturedSkillsWithSkills({
        title: 'Structured Editor',
        skills: ['React', 'TypeScript'],
        featuredSkills: ['React', 'Swift'],
      }),
    ).toEqual({
      title: 'Structured Editor',
      skills: ['React', 'TypeScript'],
      featuredSkills: ['React'],
    });
  });

  it('normalizes nested project records without mutating the input value', () => {
    const input = {
      workExperiences: [
        {
          companyName: 'Example',
          project: [
            {
              title: 'Nested',
              skills: ['Next.js'],
              featuredSkills: ['Next.js', 'React'],
            },
          ],
        },
      ],
    };

    const result = syncFeaturedSkillsWithSkills(input);

    expect(result).toEqual({
      workExperiences: [
        {
          companyName: 'Example',
          project: [
            {
              title: 'Nested',
              skills: ['Next.js'],
              featuredSkills: ['Next.js'],
            },
          ],
        },
      ],
    });
    expect(input.workExperiences[0]?.project[0]?.featuredSkills).toEqual(['Next.js', 'React']);
  });
});

describe('labelFor', () => {
  it('returns Korean labels for structured editor fields', () => {
    expect(labelFor('companyName')).toBe('회사명');
    expect(labelFor('dateFrom')).toBe('시작일');
    expect(labelFor('dateTo')).toBe('종료일');
    expect(labelFor('highlights')).toBe('하이라이트');
    expect(labelFor('featuredSkills')).toBe('대표 스킬');
    expect(labelFor('metrics')).toBe('지표');
  });
});

describe('isMonthInputField', () => {
  it('uses native month inputs for start and end month fields only', () => {
    expect(isMonthInputField('dateFrom')).toBe(true);
    expect(isMonthInputField('dateTo')).toBe(true);
    expect(isMonthInputField('date')).toBe(false);
    expect(isMonthInputField('title')).toBe(false);
  });
});
