import { highlightSupport } from '../../const/highlight-browser-support';
import { TextSelectionWord } from '../../interfaces/TextSelectionWord';

export const highlightSelectedWord = ({ word }: { word: TextSelectionWord }) => {
  if (highlightSupport()) {
    const range = document.createRange();
    range.setStart(word.node, word.startOffset);
    range.setEnd(word.node, word.endOffset);
    CSS.highlights.set('selected-word', new Highlight(range));
  }
};
