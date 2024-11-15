export const elementIsVisible = (element: HTMLElement | null) => {
  if (!element) {
    return false;
  }
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && style.visibility !== 'hidden';
};
