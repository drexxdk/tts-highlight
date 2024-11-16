import { TextSelectionWord } from '../../interfaces/TextSelectionWord';
import { highlightSupport } from './highlight-browser-support';

export const highlightWords = ({ words }: { words: TextSelectionWord[] }) => {
  if (highlightSupport() && words.length) {
    const highlight = new Highlight();
    words.forEach((word) => {
      const range = document.createRange();
      range.setStart(word.node, word.startOffset);
      range.setEnd(word.node, word.endOffset);
      highlight.add(range);
    });
    CSS.highlights.set('word', highlight);
  }
};
