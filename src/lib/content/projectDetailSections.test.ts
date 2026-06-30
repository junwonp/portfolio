import { describe, expect, it } from 'vitest';

import type { ProjectDetailBlock } from '@/lib/content/editableContent';

import {
  createProjectDetailBlockSections,
  stripLeadingMarkdownHeading,
} from './projectDetailSections';

const blocks = [
  { id: 'intro-title', type: 'markdown', markdown: '## Project overview\n\nIntro body' },
  { id: 'tech', type: 'techStack' },
  { id: 'work-title', type: 'markdown', markdown: '## Key work' },
  {
    achievements: [{ detail: 'Built it', tag: 'Frontend', title: 'Work item' }],
    id: 'work-items',
    type: 'achievements',
  },
  { id: 'screenshots-title', type: 'markdown', markdown: '## Screenshots' },
  {
    id: 'screenshots',
    images: [{ alt: 'Main', caption: 'Main screen', src: '/images/main.webp' }],
    type: 'lightbox',
  },
] satisfies ProjectDetailBlock[];

describe('createProjectDetailBlockSections', () => {
  it('groups detail blocks from one h2 heading to the next h2 heading', () => {
    expect(createProjectDetailBlockSections(blocks)).toEqual([
      {
        blocks: [blocks[0], blocks[1]],
        heading: { level: 2, text: 'Project overview' },
        id: 'intro-title',
        startIndex: 0,
      },
      {
        blocks: [blocks[2], blocks[3]],
        heading: { level: 2, text: 'Key work' },
        id: 'work-title',
        startIndex: 2,
      },
      {
        blocks: [blocks[4], blocks[5]],
        heading: { level: 2, text: 'Screenshots' },
        id: 'screenshots-title',
        startIndex: 4,
      },
    ]);
  });
});

describe('stripLeadingMarkdownHeading', () => {
  it('removes the displayed section heading from markdown rendering', () => {
    expect(stripLeadingMarkdownHeading(blocks[0])).toEqual({
      id: 'intro-title',
      markdown: 'Intro body',
      type: 'markdown',
    });
  });

  it('keeps non-markdown blocks unchanged', () => {
    expect(stripLeadingMarkdownHeading(blocks[1])).toBe(blocks[1]);
  });
});
