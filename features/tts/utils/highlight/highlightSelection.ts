import { highlightSupport } from '../../const/highlight-browser-support';
import { TextSelectionWord } from '../../interfaces/TextSelectionWord';

export const highlightSelection = ({ words }: { words: TextSelectionWord[] }) => {
  if (highlightSupport() && words.length) {
    const range = document.createRange();
    range.setStart(words[0].node, words[0].startOffset);
    range.setEnd(words[words.length - 1].node, words[words.length - 1].endOffset);
    const highlight = new Highlight(range);
    CSS.highlights.set('selection', highlight);
  }
};
