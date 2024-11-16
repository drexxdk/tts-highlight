import { highlightSupport } from './highlight-browser-support';

export const clearHighlight = () => {
  if (highlightSupport()) {
    CSS.highlights.clear();
  }
};
