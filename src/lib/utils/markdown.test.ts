import { describe, expect, it } from 'vitest';

import { parseMarkdown } from '$lib/utils/markdown';

describe('parseMarkdown', () => {
  describe('plain text', () => {
    it('returns a single text part for plain text', () => {
      expect(parseMarkdown('hello world')).toEqual([{ text: 'hello world', type: 'text' }]);
    });

    it('returns a single text part for empty string', () => {
      expect(parseMarkdown('')).toEqual([{ text: '', type: 'text' }]);
    });
  });

  describe('** bold syntax', () => {
    it('parses a single bold segment', () => {
      expect(parseMarkdown('**bold**')).toEqual([{ text: 'bold', type: 'bold' }]);
    });

    it('parses bold surrounded by plain text', () => {
      expect(parseMarkdown('before **bold** after')).toEqual([
        { text: 'before ', type: 'text' },
        { text: 'bold', type: 'bold' },
        { text: ' after', type: 'text' },
      ]);
    });

    it('parses multiple bold segments', () => {
      expect(parseMarkdown('**a** and **b**')).toEqual([
        { text: 'a', type: 'bold' },
        { text: ' and ', type: 'text' },
        { text: 'b', type: 'bold' },
      ]);
    });
  });

  describe('__ bold syntax', () => {
    it('parses a single bold segment with underscores', () => {
      expect(parseMarkdown('__bold__')).toEqual([{ text: 'bold', type: 'bold' }]);
    });

    it('parses bold surrounded by plain text with underscores', () => {
      expect(parseMarkdown('prefix __bold__ suffix')).toEqual([
        { text: 'prefix ', type: 'text' },
        { text: 'bold', type: 'bold' },
        { text: ' suffix', type: 'text' },
      ]);
    });
  });

  describe('inline code syntax', () => {
    it('parses a single code segment', () => {
      expect(parseMarkdown('`code`')).toEqual([{ text: 'code', type: 'code' }]);
    });

    it('parses code surrounded by plain text', () => {
      expect(parseMarkdown('run `npm install` first')).toEqual([
        { text: 'run ', type: 'text' },
        { text: 'npm install', type: 'code' },
        { text: ' first', type: 'text' },
      ]);
    });
  });

  describe('mixed syntax', () => {
    it('treats ** and __ as independent markers', () => {
      expect(parseMarkdown('**a** and __b__')).toEqual([
        { text: 'a', type: 'bold' },
        { text: ' and ', type: 'text' },
        { text: 'b', type: 'bold' },
      ]);
    });

    it('parses bold and code in the same string', () => {
      expect(parseMarkdown('use **bold** and `code`')).toEqual([
        { text: 'use ', type: 'text' },
        { text: 'bold', type: 'bold' },
        { text: ' and ', type: 'text' },
        { text: 'code', type: 'code' },
      ]);
    });
  });

  describe('edge cases', () => {
    it('does not treat mismatched markers as bold', () => {
      expect(parseMarkdown('**bold__')).toEqual([{ text: '**bold__', type: 'text' }]);
    });

    it('returns only bold part when entire string is bold', () => {
      expect(parseMarkdown('**entire**')).toEqual([{ text: 'entire', type: 'bold' }]);
    });

    it('handles bold at end of string with no trailing text', () => {
      expect(parseMarkdown('start **end**')).toEqual([
        { text: 'start ', type: 'text' },
        { text: 'end', type: 'bold' },
      ]);
    });
  });
});
