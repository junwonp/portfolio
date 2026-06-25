import { describe, expect, it } from 'vitest';

import { applyHomeContentOverride, renderEditableMarkdown } from '@/lib/content/editableContent';
import type { ResumeData } from '@/lib/data/resume';

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
});
