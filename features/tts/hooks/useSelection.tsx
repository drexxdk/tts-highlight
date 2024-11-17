'use client';

import { useEffect } from 'react';
import { POLLY_PUNCTUATION } from '../const/polly-punctuation';
import { TextSelectionWord } from '../interfaces/TextSelectionWord';
import { useTTSWithHighlightStore } from '../stores/useTTSWithHighlightStore';
import { elementIsVisible } from '../utils/elementIsVisible';
import { clearHighlight } from '../utils/highlight/clearHighlight';
import { highlightSupport } from '../utils/highlight/highlight-browser-support';
import { highlightSelectedWord } from '../utils/highlight/highlightSelectedWord';
import { highlightSelection } from '../utils/highlight/highlightSelection';
import { highlightWords } from '../utils/highlight/highlightWords';
import { nodesInRange } from '../utils/range/nodesInRange';
import { shouldAddPunctuation } from '../utils/shouldAddPunctuation';
import { useRangeIfReady } from './useRangeIfReady';

// If word contains these characters then add whitespace around each of them.
// Polly can't handle them within a word.
const SPLIT_IN_WORD = new RegExp(/(?=[!?._<>#%=/])|(?<=[!?._<>#%=/])/g);

// Polly will remove these characters if they stand alone.
// We need to ignore them in our selection.
const IGNORE_TEXT_NODE_IF_ONLY_CONTAINS = new RegExp(/^[\-!?.\¨\[\]]+$/);

const IGNORE_ELEMENTS_SELECTOR: string[] = ['data-tts-ignore', 'input[type="text"]', 'textarea'];
const REPLACE_ELEMENTS_WITH_DATA_ATTRIBUTE = 'data-tts-replace';

export const useSelection = () => {
  const setTextSelection = useTTSWithHighlightStore((state) => state.setTextSelection);
  const selectedLanguage = useTTSWithHighlightStore((state) => state.selectedLanguage);
  const { range } = useRangeIfReady();

  useEffect(() => {
    if (!range || !selectedLanguage) {
      return;
    }

    const ignoreElements = Array.from<HTMLElement>(document.querySelectorAll(IGNORE_ELEMENTS_SELECTOR.toString()));
    const replaceElements = Array.from<HTMLElement>(
      document.querySelectorAll(`[${REPLACE_ELEMENTS_WITH_DATA_ATTRIBUTE}]`),
    );
    setTextSelection(undefined);

    const SUPPORTED_CHARS_REGEX = new RegExp(`[^${selectedLanguage.chars.join('')}]`, 'g');
    const nodes = nodesInRange(range);
    const treeWalker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT);
    let currentNode: Node | null;

    // if the node that is being selected is both the start and the end node then just use that
    // TreeWalker starts with common ancestor if startContainer !== endContainer
    // We need to loop through the treeWalker
    if (range.startContainer === range.endContainer) {
      currentNode = range.startContainer;
    } else {
      currentNode = treeWalker.nextNode();
    }

    const words: TextSelectionWord[] = [];
    const replacedElements: HTMLElement[] = [];
    while (currentNode) {
      if (
        nodes.find(
          (node) =>
            // Only check the node if its in range
            node === currentNode &&
            currentNode.nodeValue &&
            // Don't include text nodes that only contains characters that Polly doesn't support
            !IGNORE_TEXT_NODE_IF_ONLY_CONTAINS.test(currentNode.nodeValue) &&
            // Don't include text nodes that are hidden/invisible
            elementIsVisible(currentNode.parentElement),
        )
      ) {
        // If this node's parentElement is or within data-tts-replace element,
        // then highlight the whole data-tts-ignore as one word,
        // while each word in the replacement is being read
        const replaceElement = replaceElements.find((item) => item.contains(currentNode?.parentElement as HTMLElement));

        // startContainer can have on offset based on the selection
        let startOffset = currentNode === range.startContainer && !replaceElement ? range.startOffset : 0;
        const endOffset = currentNode === range.endContainer && !replaceElement ? range.endOffset : undefined;

        if (replaceElement) {
          if (!replacedElements.some((item) => item === replaceElement)) {
            replacedElements.push(replaceElement);
            const tempWords = replaceElement.dataset.ttsReplace?.trim().split(' ') || [];
            tempWords.forEach((tempWord, i) => {
              const splitWords = tempWord.split(SPLIT_IN_WORD);
              splitWords.forEach((splitWord, i) => {
                const finalWord = splitWord.replaceAll(SUPPORTED_CHARS_REGEX, '').trimStart();
                if (!ignoreElements.find((item) => item.contains(currentNode?.parentElement as HTMLElement))) {
                  if (IGNORE_TEXT_NODE_IF_ONLY_CONTAINS.test(splitWord)) {
                    if (
                      POLLY_PUNCTUATION.some((value) => value === splitWord) &&
                      !words[words.length - 1].word.endsWith('.')
                    ) {
                      words[words.length - 1].word += '.';
                    }
                  } else if (finalWord.length) {
                    words.push({
                      startOffset: startOffset,
                      endOffset: startOffset + replaceElement.childNodes.length,
                      node: replaceElement,
                      word: finalWord,
                    });
                  }
                }
              });
            });
          }
          startOffset += 1;
        } else {
          // TextNode can contain multiple words
          // Polly's marks are for each individual word
          // This splits the textNode to match with Polly's marks
          const tempWords = currentNode.nodeValue?.substring(startOffset, endOffset).split(' ') || [];
          tempWords.forEach((tempWord, i) => {
            const addPunctuation = shouldAddPunctuation({
              index: i,
              words: tempWords,
              node: currentNode,
              word: tempWord,
            });
            const splitWords = tempWord.split(SPLIT_IN_WORD);
            splitWords.forEach((splitWord, i) => {
              const leadingSplitWordWhitespaces = splitWord.length - splitWord.trimStart().length;
              const finalWord = splitWord.replaceAll(SUPPORTED_CHARS_REGEX, '').trimStart();
              if (!ignoreElements.find((item) => item.contains(currentNode?.parentElement as HTMLElement))) {
                if (IGNORE_TEXT_NODE_IF_ONLY_CONTAINS.test(splitWord)) {
                  if (
                    (POLLY_PUNCTUATION.some((value) => value === splitWord) ||
                      (addPunctuation && i + 1 === splitWords.length)) &&
                    !words[words.length - 1].word.endsWith('.')
                  ) {
                    words[words.length - 1].word += '.';
                  }
                } else if (finalWord.length) {
                  words.push({
                    startOffset: startOffset + leadingSplitWordWhitespaces,
                    endOffset: startOffset + splitWord.length,
                    node: currentNode as Node,
                    word: finalWord + (addPunctuation && i + 1 === splitWords.length ? '.' : ''),
                  });
                }
              }
              startOffset += splitWord.length;
            });
            startOffset += 1;
          });
        }
      }
      currentNode = treeWalker.nextNode();
    }

    const hasWords = words.length > 0;

    if (highlightSupport() && !('ontouchend' in document) && hasWords) {
      // We dont want to keep the browser selection on desktop if that desktop supports Highlight API
      // Firefox will keep the selection
      const selection = window.getSelection();
      selection?.empty();
    }

    setTextSelection(
      hasWords
        ? {
            words: words,
            inputText: words.map((word) => word.word).join(' '),
          }
        : undefined,
    );
    console.log('words', words);

    if (hasWords) {
      highlightSelection({ words });
      highlightWords({ words });
      highlightSelectedWord({ word: words[0] });
    } else {
      clearHighlight();
    }
  }, [range, selectedLanguage]);
};
