type HastNode = {
  type?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
  value?: string;
};

const collectText = (node: HastNode): string => {
  if (typeof node.value === 'string') {
    return node.value;
  }

  if (!Array.isArray(node.children)) {
    return '';
  }

  return node.children.map(collectText).join('');
};

/**
 * Copies table header texts into each cell as data-label so the mobile
 * card transformation can render column names without the thead.
 */
export function addTableLabels(tree: HastNode): void {
  if (tree.type === 'element' && tree.tagName === 'table') {
    const thead = tree.children?.find((child) => child.tagName === 'thead');
    const headerRow = thead?.children?.find((child) => child.tagName === 'tr');
    const headers =
      headerRow?.children
        ?.filter((child) => child.tagName === 'th')
        .map(collectText) ?? [];

    if (headers.length > 0) {
      for (const tbody of tree.children?.filter((child) => child.tagName === 'tbody') ?? []) {
        for (const row of tbody.children ?? []) {
          const cells = row.children?.filter((child) => child.tagName === 'td') ?? [];
          cells.forEach((cell, index) => {
            const label = headers[index];
            if (label !== undefined) {
              cell.properties = { ...(cell.properties ?? {}), dataLabel: label };
            }
          });
        }
      }
    }
  }

  for (const child of tree.children ?? []) {
    addTableLabels(child);
  }
}

export default function rehypeTableLabels() {
  return (tree: HastNode) => {
    addTableLabels(tree);
  };
}
