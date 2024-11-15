import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { fixRange } from '../utils/fixRange';

const CHECK_SELECTION_DEBOUNCE_DELAY = 500;

export const useRangeIfReady = () => {
  const [range, setRange] = useState<Range>();
  // const selection = window.getSelection();
  const checkSelection = useDebouncedCallback(() => {
    const selection = window.getSelection();
    if (selection?.type === 'Range' && selection.toString().trim().length) {
      // This ensures that selecttion starts at the beginning of a word and ends at the ending of a word,
      // no matter how the selection is made
      const range = fixRange(selection);
      const originalRange = selection.getRangeAt(0);

      // We don't want to do any highlighting work until the selections range is perfect
      if (
        range.startOffset === originalRange.startOffset &&
        range.startContainer === originalRange.startContainer &&
        range.endOffset === originalRange.endOffset &&
        range.endContainer === originalRange.endContainer
      ) {
        setRange(range);
      } else {
        // Remove the selection the user have made
        selection.removeAllRanges();
        // Change the range into the fixed range
        selection.addRange(range);
      }
    }
  }, CHECK_SELECTION_DEBOUNCE_DELAY);

  useEffect(() => {
    document.addEventListener('selectionchange', checkSelection);

    return () => {
      document.removeEventListener('selectionchange', checkSelection);
    };
  }, [checkSelection]);

  return { range };
};
