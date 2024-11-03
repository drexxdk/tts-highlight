export const fixRange = (range: Range) => {
  let rangeString = range.toString();
  try {
    while (rangeString[0] != " ") {
      range.setStart(range.startContainer, range.startOffset - 1);
      rangeString = range.toString();
    }
    range.setStart(range.startContainer, range.startOffset + 1);
  } catch {}
  try {
    while (rangeString[rangeString.length - 1] != " ") {
      range.setEnd(range.endContainer, range.endOffset + 1);
      rangeString = range.toString();
    }
    range.setEnd(range.endContainer, range.endOffset - 1);
  } catch {}
  return range;
};
