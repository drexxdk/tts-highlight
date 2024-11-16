import { TextSelectionWord } from '../../interfaces/TextSelectionWord';
import { highlightSupport } from './highlight-browser-support';

export const highlightSelectedWord = ({ word }: { word: TextSelectionWord }) => {
  if (highlightSupport()) {
    try {
      const range = document.createRange();
      range.setStart(word.node, word.startOffset);
      range.setEnd(word.node, word.endOffset);
      CSS.highlights.set('selected-word', new Highlight(range));
    } catch (e) {
      console.warn('highlightSelectedWord', e);
    }
  }
};
