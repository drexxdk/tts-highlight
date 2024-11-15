import { highlightSupport } from '../../const/highlight-browser-support';

export const clearHighlight = () => {
  if (highlightSupport()) {
    CSS.highlights.clear();
  }
};
