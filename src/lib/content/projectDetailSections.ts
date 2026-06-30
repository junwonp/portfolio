import type { ProjectDetailBlock } from '@/lib/content/editableContent';

export interface ProjectDetailSectionHeading {
  level: 2 | 3;
  text: string;
}

export interface ProjectDetailBlockSection {
  blocks: ProjectDetailBlock[];
  heading?: ProjectDetailSectionHeading;
  id: string;
  startIndex: number;
}

const headingPattern = /^(#{2,3})\s+(.+)$/m;

export const getLeadingMarkdownHeading = (
  block: ProjectDetailBlock,
): ProjectDetailSectionHeading | undefined => {
  if (block.type !== 'markdown') {
    return undefined;
  }

  const firstLine = block.markdown.trimStart().split('\n')[0]?.trim() ?? '';
  const match = firstLine.match(headingPattern);

  if (!match) {
    return undefined;
  }

  return {
    level: match[1]?.length === 3 ? 3 : 2,
    text: match[2] ?? '',
  };
};

export const stripLeadingMarkdownHeading = (block: ProjectDetailBlock): ProjectDetailBlock => {
  const heading = getLeadingMarkdownHeading(block);

  if (block.type !== 'markdown' || !heading) {
    return block;
  }

  return {
    ...block,
    markdown: block.markdown
      .trimStart()
      .replace(headingPattern, '')
      .replace(/^\n+/, ''),
  };
};

export const createProjectDetailBlockSections = (
  blocks: ProjectDetailBlock[],
): ProjectDetailBlockSection[] => {
  const sections: ProjectDetailBlockSection[] = [];

  for (const [index, block] of blocks.entries()) {
    const heading = getLeadingMarkdownHeading(block);
    const startsSection = heading?.level === 2;

    if (startsSection || sections.length === 0) {
      sections.push({
        blocks: [block],
        heading,
        id: block.id,
        startIndex: index,
      });
      continue;
    }

    const previous = sections.at(-1);
    if (previous) {
      previous.blocks = [...previous.blocks, block];
    }
  }

  return sections;
};
