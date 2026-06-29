import { describe, expect, it } from 'vitest';

import {
  applyHomeContentOverride,
  applyProjectDetailContentOverride,
  renderEditableMarkdown,
} from '@/lib/content/editableContent';
import type { ResumeData } from '@/lib/data/resume';
import type { PostMetadata } from '@/lib/types/post';

const baseResumeData: ResumeData = {
  archives: [],
  certificates: [],
  education: [{ school: 'Old School', dateFrom: '2020-01' }],
  introduction: {
    githubLink: 'https://github.com/example',
    linkedinLink: 'https://linkedin.com/in/example',
    name: 'Old Name',
    role: 'Frontend Engineer',
    tagline: 'Old tagline',
  },
  otherExperiences: [],
  skills: [],
  workExperiences: [],
};

describe('applyHomeContentOverride', () => {
  it('merges introduction overrides without mutating the base resume data', () => {
    const result = applyHomeContentOverride(baseResumeData, {
      introduction: {
        tagline: 'Updated tagline',
      },
    });

    expect(result.introduction.tagline).toBe('Updated tagline');
    expect(result.introduction.name).toBe('Old Name');
    expect(baseResumeData.introduction.tagline).toBe('Old tagline');
  });

  it('replaces section arrays when a section override is present', () => {
    const result = applyHomeContentOverride(baseResumeData, {
      education: [{ school: 'New School', dateFrom: '2024-01', major: 'Computer Science' }],
    });

    expect(result.education).toEqual([
      { school: 'New School', dateFrom: '2024-01', major: 'Computer Science' },
    ]);
    expect(baseResumeData.education).toEqual([{ school: 'Old School', dateFrom: '2020-01' }]);
  });
});

describe('renderEditableMarkdown', () => {
  it('renders basic markdown blocks and inline formatting', () => {
    expect(renderEditableMarkdown('Intro with **bold** and `code`.\n\n- First\n- Second')).toBe(
      '<p>Intro with <strong>bold</strong> and <code>code</code>.</p><ul><li>First</li><li>Second</li></ul>',
    );
  });

  it('escapes unsupported html while preserving safe local images', () => {
    expect(
      renderEditableMarkdown('<script>alert(1)</script>\n\n![Chart](/images/chart.webp)'),
    ).toBe(
      '<p>&lt;script&gt;alert(1)&lt;/script&gt;</p><p><img src="/images/chart.webp" alt="Chart"></p>',
    );
  });

  it('renders headings, ordered lists, unordered lists, and markdown tables', () => {
    expect(
      renderEditableMarkdown(
        '## Flow\n\n- First unordered\n* Second unordered\n\n1. First\n2. Second\n\n| Name | Value |\n| --- | --- |\n| API | 80% |',
      ),
    ).toBe(
      '<h2>Flow</h2><ul><li>First unordered</li><li>Second unordered</li></ul><ol><li>First</li><li>Second</li></ol><table><thead><tr><th>Name</th><th>Value</th></tr></thead><tbody><tr><td>API</td><td>80%</td></tr></tbody></table>',
    );
  });
});

describe('applyProjectDetailContentOverride', () => {
  const baseMetadata: PostMetadata = {
    title: 'Old title',
    description: 'Old description',
    techStack: ['React'],
  };

  it('merges metadata and tech stack overrides without mutating the base metadata', () => {
    const result = applyProjectDetailContentOverride(
      {
        blocks: [{ id: 'overview', type: 'markdown', markdown: 'Old' }],
        metadata: baseMetadata,
      },
      {
        metadata: { title: 'New title' },
        techStack: ['React', 'TypeScript'],
      },
    );

    expect(result.metadata).toEqual({
      title: 'New title',
      description: 'Old description',
      techStack: ['React', 'TypeScript'],
    });
    expect(baseMetadata.title).toBe('Old title');
  });

  it('replaces blocks when a block override is present', () => {
    const result = applyProjectDetailContentOverride(
      {
        blocks: [{ id: 'overview', type: 'markdown', markdown: 'Old' }],
        metadata: baseMetadata,
      },
      {
        blocks: [{ id: 'overview', type: 'markdown', markdown: 'New' }],
      },
    );

    expect(result.blocks).toEqual([{ id: 'overview', type: 'markdown', markdown: 'New' }]);
  });
});
