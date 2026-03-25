import { describe, expect, it } from 'vitest';

import { parseMarkdownBold } from './markdown';

describe('parseMarkdownBold', () => {
  describe('no bold markers', () => {
    it('returns a single non-bold part for plain text', () => {
      expect(parseMarkdownBold('hello world')).toEqual([{ text: 'hello world', bold: false }]);
    });

    it('returns a single non-bold part for empty string', () => {
      expect(parseMarkdownBold('')).toEqual([{ text: '', bold: false }]);
    });
  });

  describe('** syntax', () => {
    it('parses a single bold segment', () => {
      expect(parseMarkdownBold('**bold**')).toEqual([{ text: 'bold', bold: true }]);
    });

    it('parses bold surrounded by plain text', () => {
      expect(parseMarkdownBold('before **bold** after')).toEqual([
        { text: 'before ', bold: false },
        { text: 'bold', bold: true },
        { text: ' after', bold: false },
      ]);
    });

    it('parses multiple bold segments', () => {
      expect(parseMarkdownBold('**a** and **b**')).toEqual([
        { text: 'a', bold: true },
        { text: ' and ', bold: false },
        { text: 'b', bold: true },
      ]);
    });
  });

  describe('__ syntax', () => {
    it('parses a single bold segment with underscores', () => {
      expect(parseMarkdownBold('__bold__')).toEqual([{ text: 'bold', bold: true }]);
    });

    it('parses bold surrounded by plain text with underscores', () => {
      expect(parseMarkdownBold('prefix __bold__ suffix')).toEqual([
        { text: 'prefix ', bold: false },
        { text: 'bold', bold: true },
        { text: ' suffix', bold: false },
      ]);
    });
  });

  describe('mixed syntax', () => {
    it('treats ** and __ as independent markers', () => {
      expect(parseMarkdownBold('**a** and __b__')).toEqual([
        { text: 'a', bold: true },
        { text: ' and ', bold: false },
        { text: 'b', bold: true },
      ]);
    });
  });

  describe('edge cases', () => {
    it('does not treat mismatched markers as bold', () => {
      const result = parseMarkdownBold('**bold__');
      expect(result).toEqual([{ text: '**bold__', bold: false }]);
    });

    it('returns only bold part when entire string is bold', () => {
      expect(parseMarkdownBold('**entire**')).toEqual([{ text: 'entire', bold: true }]);
    });

    it('handles bold-only with no trailing text', () => {
      expect(parseMarkdownBold('start **end**')).toEqual([
        { text: 'start ', bold: false },
        { text: 'end', bold: true },
      ]);
    });
  });
});
