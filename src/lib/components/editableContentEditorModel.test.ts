import { describe, expect, it } from 'vitest';

import {
  formatMarkdownListTextarea,
  isMarkdownListTextareaField,
  isMonthInputField,
  isSharedEditablePath,
  labelFor,
  parseMarkdownListTextarea,
  replaceEditableArrayItem,
  replaceEditableArrayRange,
  syncFeaturedSkillsWithSkills,
  syncSharedEditableValuesFromLocale,
  updateValuesByLocaleAtPath,
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

describe('shared multilingual editor fields', () => {
  it('updates common project fields in every locale when edited from one tab', () => {
    const valuesByLocale = {
      ko: {
        id: 'aira',
        title: '한국어 제목',
        dateFrom: '2024-01',
        dateTo: '',
        detailLink: '/projects/aira',
        skills: ['React'],
      },
      en: {
        id: 'aira',
        title: 'English title',
        dateFrom: '2024-01',
        dateTo: '',
        detailLink: '/projects/aira',
        skills: ['React'],
      },
    };

    const next = updateValuesByLocaleAtPath({
      activeLocale: 'ko',
      enabledLocales: ['ko', 'en'],
      fallbackValue: {},
      nextValue: '2024-03',
      path: ['dateFrom'],
      targetKey: 'workExperiences',
      valuesByLocale,
    });

    expect(next.ko).toMatchObject({ dateFrom: '2024-03' });
    expect(next.en).toMatchObject({ dateFrom: '2024-03' });
    expect(valuesByLocale.en.dateFrom).toBe('2024-01');
  });

  it('keeps translated copy isolated to the active locale', () => {
    const valuesByLocale = {
      ko: { id: 'aira', title: '한국어 제목' },
      en: { id: 'aira', title: 'English title' },
    };

    const next = updateValuesByLocaleAtPath({
      activeLocale: 'ko',
      enabledLocales: ['ko', 'en'],
      fallbackValue: {},
      nextValue: '새 제목',
      path: ['title'],
      targetKey: 'workExperiences',
      valuesByLocale,
    });

    expect(next.ko).toMatchObject({ title: '새 제목' });
    expect(next.en).toMatchObject({ title: 'English title' });
  });

  it('treats skills and project links as shared fields', () => {
    expect(isSharedEditablePath('workExperiences', ['project', 0, 'skills'])).toBe(true);
    expect(isSharedEditablePath('workExperiences', ['project', 0, 'detailLink'])).toBe(true);
    expect(isSharedEditablePath('skills', [0, 'list'])).toBe(true);
    expect(isSharedEditablePath('project-slug::metadata', ['githubLink'])).toBe(true);
    expect(isSharedEditablePath('project-slug::metadata', ['tagline'])).toBe(false);
  });

  it('normalizes shared fields from the active locale before editing', () => {
    const next = syncSharedEditableValuesFromLocale({
      enabledLocales: ['ko', 'en'],
      fallbackValue: {},
      sourceLocale: 'ko',
      targetKey: 'workExperiences',
      valuesByLocale: {
        ko: {
          id: 'common-id',
          title: '한국어 제목',
          dateFrom: '2024-03',
          skills: ['React', 'TypeScript'],
        },
        en: {
          id: 'stale-id',
          title: 'English title',
          dateFrom: '2023-01',
          skills: ['Swift'],
        },
      },
    });

    expect(next.en).toEqual({
      id: 'common-id',
      title: 'English title',
      dateFrom: '2024-03',
      skills: ['React', 'TypeScript'],
    });
  });
});

describe('replaceEditableArrayItem', () => {
  it('replaces one item without mutating the original array', () => {
    const original = [
      { id: 'intro', type: 'markdown', markdown: 'Intro' },
      { id: 'work', type: 'markdown', markdown: 'Work' },
    ];

    const next = replaceEditableArrayItem(original, 1, {
      id: 'work',
      type: 'markdown',
      markdown: 'Updated work',
    });

    expect(next).toEqual([
      { id: 'intro', type: 'markdown', markdown: 'Intro' },
      { id: 'work', type: 'markdown', markdown: 'Updated work' },
    ]);
    expect(original[1]?.markdown).toBe('Work');
  });

  it('replaces a section range without mutating the original array', () => {
    const original = [
      { id: 'intro-title', type: 'markdown', markdown: '## Intro' },
      { id: 'intro-body', type: 'markdown', markdown: 'Intro body' },
      { id: 'work-title', type: 'markdown', markdown: '## Work' },
    ];

    const next = replaceEditableArrayRange(original, 0, 2, [
      { id: 'intro-title', type: 'markdown', markdown: '## Updated Intro' },
    ]);

    expect(next).toEqual([
      { id: 'intro-title', type: 'markdown', markdown: '## Updated Intro' },
      { id: 'work-title', type: 'markdown', markdown: '## Work' },
    ]);
    expect(original).toHaveLength(3);
  });
});
