export const isBackwards = () => {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  const range = document.createRange();
  range.setStart(selection.anchorNode as Node, selection.anchorOffset);
  range.setEnd(selection.focusNode as Node, selection.focusOffset);
  range.detach();
  return range.collapsed;
};
