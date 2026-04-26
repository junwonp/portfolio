export interface TextPart {
  text: string;
  type: 'bold' | 'code' | 'text';
}

/**
 * Basic markdown parser for bold (**) and inline code (`) syntax.
 */
export function parseMarkdown(text: string): TextPart[] {
  const parts: TextPart[] = [];
  const regex = /(\*\*|__)(.+?)\1|`(.+?)`/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add preceding text
    if (match.index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        type: 'text',
      });
    }

    if (match[1]) {
      // Bold match: **text** or __text__
      parts.push({
        text: match[2],
        type: 'bold',
      });
    } else if (match[3]) {
      // Code match: `text`
      parts.push({
        text: match[3],
        type: 'code',
      });
    }

    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      type: 'text',
    });
  }

  if (parts.length === 0) {
    parts.push({ text, type: 'text' });
  }

  return parts;
}

export function parseHeading(text: string) {
  const emojiMatch = text.match(/^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji})/u);
  const emoji = emojiMatch ? emojiMatch[0] : '';
  const rest = text.replace(emoji, '').trim();
  const [main, ...subParts] = rest.split(':');
  const sub = subParts.join(':').trim();

  return {
    emoji,
    main: main.trim(),
    sub,
  };
}

/**
 * Generates a URL-friendly slug from text.
 * Removes emojis and special characters, converts to lowercase, and replaces spaces with hyphens.
 */
export function slugify(text: string, index: number): string {
  const slug = text
    .toLowerCase()
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
  return slug || `section-${String(index)}`;
}
