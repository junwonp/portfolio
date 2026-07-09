import type { ResumeData } from '@/lib/data/resume';
import type { PostMetadata } from '@/lib/types/post';

export interface HomeContentOverride {
  archives?: ResumeData['archives'];
  education?: ResumeData['education'];
  introduction?: Partial<ResumeData['introduction']>;
  otherExperiences?: ResumeData['otherExperiences'];
  skills?: ResumeData['skills'];
  workExperiences?: ResumeData['workExperiences'];
}

export interface ProjectDetailAchievement {
  accent?: boolean;
  detail: string;
  tag: string;
  title: string;
}

export interface ProjectDetailImage {
  alt: string;
  caption?: string;
  height?: number;
  mobileSrc?: string;
  src: string;
  width?: number;
}

export type ProjectDetailBlock =
  | {
      id: string;
      markdown: string;
      type: 'markdown';
    }
  | {
      id: string;
      type: 'techStack';
    }
  | {
      achievements: ProjectDetailAchievement[];
      id: string;
      type: 'achievements';
    }
  | {
      id: string;
      images: ProjectDetailImage[];
      type: 'lightbox';
      variant?: 'default' | 'phone';
    }
  | {
      id: string;
      images: ProjectDetailImage[];
      type: 'mediaGallery';
    }
  | {
      chart: string;
      eyebrow?: string;
      id: string;
      title: string;
      type: 'mermaid';
    };

export interface ProjectDetailContent {
  blocks: ProjectDetailBlock[];
  metadata: PostMetadata;
}

export interface ProjectDetailContentOverride {
  blocks?: ProjectDetailBlock[];
  metadata?: Partial<PostMetadata>;
  techStack?: string[];
}

const escapeHtml = (value: string): string =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const renderInlineText = (value: string): string =>
  escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>');

const renderInlineMarkdown = (value: string): string => {
  const imagePattern = /!\[([^\]]*)\]\((\/images\/[^)\s]+)\)/g;
  let rendered = '';
  let lastIndex = 0;

  for (const match of value.matchAll(imagePattern)) {
    const index = match.index;
    const alt = match[1] ?? '';
    const src = match[2] ?? '';

    rendered += renderInlineText(value.slice(lastIndex, index));
    rendered += `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}">`;
    lastIndex = index + match[0].length;
  }

  rendered += renderInlineText(value.slice(lastIndex));
  return rendered;
};

const isTableSeparatorLine = (line: string): boolean =>
  /^\|\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line);

const readTableCells = (line: string): string[] =>
  line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());

const renderTable = (lines: string[]): string | null => {
  if (lines.length < 3 || !isTableSeparatorLine(lines[1])) {
    return null;
  }

  const headers = readTableCells(lines[0]);
  const rows = lines.slice(2).map(readTableCells);

  if (headers.length === 0 || rows.some((row) => row.length !== headers.length)) {
    return null;
  }

  return [
    '<table><thead><tr>',
    headers.map((cell) => `<th>${renderInlineMarkdown(cell)}</th>`).join(''),
    '</tr></thead><tbody>',
    rows
      .map(
        (row) =>
          `<tr>${row
            .map(
              (cell, index) =>
                `<td data-label="${escapeHtml(headers[index] ?? '')}">${renderInlineMarkdown(cell)}</td>`,
            )
            .join('')}</tr>`,
      )
      .join(''),
    '</tbody></table>',
  ].join('');
};

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

export const applyProjectDetailContentOverride = (
  base: ProjectDetailContent,
  override: ProjectDetailContentOverride | null | undefined,
): ProjectDetailContent => {
  if (!override) return base;

  return {
    blocks: override.blocks ?? base.blocks,
    metadata: {
      ...base.metadata,
      ...override.metadata,
      techStack: override.techStack ?? override.metadata?.techStack ?? base.metadata.techStack,
    },
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

      const isBlockquote = lines.every((line) => line.startsWith('>'));
      if (isBlockquote) {
        const innerLines = lines.map((line) => line.replace(/^>\s*/, ''));
        return `<blockquote>${innerLines.map(renderInlineMarkdown).join('<br>')}</blockquote>`;
      }

      const heading = block.match(/^(#{2,3})\s+(.+)$/);

      if (heading && lines.length === 1) {
        const level = heading[1].length;
        return `<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`;
      }

      const table = renderTable(lines);
      if (table) {
        return table;
      }

      const unorderedListPattern = /^[-*]\s+/;
      const listItems = lines
        .filter((line) => unorderedListPattern.test(line))
        .map((line) => `<li>${renderInlineMarkdown(line.replace(unorderedListPattern, ''))}</li>`);

      if (listItems.length === lines.length) {
        return `<ul>${listItems.join('')}</ul>`;
      }

      const orderedListItems = lines
        .filter((line) => /^\d+\.\s+/.test(line))
        .map((line) => `<li>${renderInlineMarkdown(line.replace(/^\d+\.\s+/, ''))}</li>`);

      if (orderedListItems.length === lines.length) {
        return `<ol>${orderedListItems.join('')}</ol>`;
      }

      return `<p>${lines.map(renderInlineMarkdown).join('<br>')}</p>`;
    })
    .join('');
};
