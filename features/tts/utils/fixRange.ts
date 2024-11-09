export const fixRange = (range: Range) => {
  let rangeString = range.toString();
  try {
    while (rangeString[0].trim().length) {
      range.setStart(range.startContainer, range.startOffset - 1);
      rangeString = range.toString();
    }
    const leadingSpaces = rangeString.length - rangeString.trimStart().length;
    range.setStart(range.startContainer, range.startOffset + leadingSpaces);
  } catch {}
  try {
    while (rangeString[rangeString.length - 1].trim().length) {
      range.setEnd(range.endContainer, range.endOffset + 1);
      rangeString = range.toString();
    }
    const trailingSpaces = rangeString.length - rangeString.trimEnd().length;
    range.setEnd(range.endContainer, range.endOffset - trailingSpaces);
  } catch {}
  return range;
};
