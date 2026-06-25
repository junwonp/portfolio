import type { ResumeData } from '@/lib/data/resume';

export interface HomeContentOverride {
  archives?: ResumeData['archives'];
  education?: ResumeData['education'];
  introduction?: Partial<ResumeData['introduction']>;
  otherExperiences?: ResumeData['otherExperiences'];
  skills?: ResumeData['skills'];
  workExperiences?: ResumeData['workExperiences'];
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderInlineMarkdown = (value: string): string =>
  escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/!\[([^\]]*)\]\((\/images\/[^)\s]+)\)/g, '<img src="$2" alt="$1">');

export const applyHomeContentOverride = (
  base: ResumeData,
  override: HomeContentOverride | null | undefined,
): ResumeData => {
  if (!override) return base;

  return {
    ...base,
    archives: override.archives ?? base.archives,
    certificates: base.certificates,
    education: override.education ?? base.education,
    introduction: {
      ...base.introduction,
      ...override.introduction,
    },
    otherExperiences: override.otherExperiences ?? base.otherExperiences,
    skills: override.skills ?? base.skills,
    workExperiences: override.workExperiences ?? base.workExperiences,
  };
};

export const renderEditableMarkdown = (markdown: string): string => {
  const blocks = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks
    .map((block) => {
      const lines = block.split('\n').map((line) => line.trim());
      const listItems = lines
        .filter((line) => line.startsWith('- '))
        .map((line) => `<li>${renderInlineMarkdown(line.slice(2))}</li>`);

      if (listItems.length === lines.length) {
        return `<ul>${listItems.join('')}</ul>`;
      }

      return `<p>${renderInlineMarkdown(lines.join('<br>'))}</p>`;
    })
    .join('');
};
