export interface TextPart {
  text: string;
  type: 'bold' | 'text';
}

export function parseMarkdownBold(text: string): TextPart[] {
  const parts: TextPart[] = [];
  const remaining = text;
  let lastIndex = 0;

  const boldRegex = /(\*\*|__)(.+?)\1/g;
  let match;

  while ((match = boldRegex.exec(remaining)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        text: remaining.slice(lastIndex, match.index),
        type: 'text',
      });
    }

    parts.push({
      text: match[2],
      type: 'bold',
    });

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < remaining.length) {
    parts.push({
      text: remaining.slice(lastIndex),
      type: 'text',
    });
  }

  if (parts.length === 0) {
    parts.push({ text, type: 'text' });
  }

  return parts;
}
