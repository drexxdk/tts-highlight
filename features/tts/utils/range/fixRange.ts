import { isBackwards } from './isBackwards';

export const fixRange = (selection: Selection) => {
  const range = document.createRange();
  if (isBackwards()) {
    range.setStart(selection.focusNode as Node, selection.focusOffset);
    range.setEnd(selection.anchorNode as Node, selection.anchorOffset);
  } else {
    range.setStart(selection.anchorNode as Node, selection.anchorOffset);
    range.setEnd(selection.focusNode as Node, selection.focusOffset);
  }

  let rangeString = range.toString();
  try {
    while (rangeString[0].trim().length) {
      range.setStart(range.startContainer, range.startOffset - 1);
      rangeString = range.toString();
    }
    const leadingWhitespaces = rangeString.length - rangeString.trimStart().length;
    range.setStart(range.startContainer, range.startOffset + leadingWhitespaces);
  } catch {}
  try {
    while (rangeString[rangeString.length - 1].trim().length) {
      range.setEnd(range.endContainer, range.endOffset + 1);
      rangeString = range.toString();
    }
    const trailingWhitespaces = rangeString.length - rangeString.trimEnd().length;
    range.setEnd(range.endContainer, range.endOffset - trailingWhitespaces);
  } catch {}
  return range;
};
