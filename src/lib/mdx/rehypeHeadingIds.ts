type MdxNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: MdxNode[];
  value?: string;
};

const collectText = (node: MdxNode): string => {
  if (typeof node.value === 'string') {
    return node.value;
  }

  if (!Array.isArray(node.children)) {
    return '';
  }

  return node.children.map(collectText).join('');
};

const slugify = (text: string, index: number): string => {
  const slug = text
    .toLowerCase()
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');

  return slug || `section-${String(index)}`;
};

export default function rehypeHeadingIds() {
  return (tree: MdxNode) => {
    let headingIndex = 0;

    const visit = (node: MdxNode) => {
      if (!node || typeof node !== 'object') {
        return;
      }

      if (node.tagName === 'h2') {
        node.properties ??= {};

        if (typeof node.properties.id !== 'string' || node.properties.id.length === 0) {
          const text = collectText(node).trim();
          node.properties.id = slugify(text, headingIndex);
        }

        headingIndex += 1;
      }

      if (Array.isArray(node.children)) {
        node.children.forEach(visit);
      }
    };

    visit(tree);
  };
}
