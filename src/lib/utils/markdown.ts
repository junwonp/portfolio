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
