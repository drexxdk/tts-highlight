'use client';

import { useEffect } from 'react';
import { ADD_PUNCTUATION_FOR_HTML_ELEMENT_TYPES } from '../const/add-punctuation-for-html-element-types';
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
import { useRangeIfReady } from './useRangeIfReady';

// Polly don't support these characters within word
// Split the word where on these characters
const SPLIT_ON_SUPPORTED = new RegExp(/(?=[&!?._<>#%=/\\])|(?<=[&!?._<>#%=/\\])/g);

const IGNORE_ELEMENTS_SELECTOR: string[] = ['[data-tts-ignore]', 'input[type="text"]', 'textarea'];
const REPLACE_ELEMENTS_WITH_DATA_ATTRIBUTE = 'data-tts-replace';

// Polly only support these characters when they are within word
const IGNORE_TEXT_NODE_IF_ONLY_CONTAINS = new RegExp(/^['\-]+$/);

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

    const supported = selectedLanguage.supported.join('');
    // These characters is supported by Polly
    const SUPPORTED_CHARS = new RegExp(`[^${supported}']`, 'g');

    // Polly don't support these characters at all
    // Split the word on these characters
    const SPLIT_ON_UNSUPPORTED = new RegExp(`(?![${supported}'])|(?<![${supported}'])`, 'g');
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

    let words: TextSelectionWord[] = [];
    const replacedElements: HTMLElement[] = [];
    while (currentNode) {
      if (
        nodes.find(
          (node) =>
            // Only check the node if its in range
            node === currentNode &&
            currentNode.nodeValue &&
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

        const punctuationParentElement =
          currentNode.parentElement?.closest<HTMLElement>(ADD_PUNCTUATION_FOR_HTML_ELEMENT_TYPES.toString()) ||
          undefined;

        // TextNode can contain multiple words
        // Polly's marks are for each individual word
        // We split the textNode to match with Polly's marks
        let tempWords: string[] = [];
        if (replaceElement) {
          if (!replacedElements.some((item) => item === replaceElement)) {
            replacedElements.push(replaceElement);
            // We can trim this text because we don't care about the offsets since this text won't be highlighted
            // the parent element will be highlighed when this is being read
            tempWords = replaceElement.dataset.ttsReplace?.trim().split(' ') || [];
          }
        } else {
          tempWords = currentNode.nodeValue?.substring(startOffset, endOffset).split(' ') || [];
        }

        tempWords.forEach((tempWord) => {
          const splitOnUnsupported = tempWord.split(SPLIT_ON_UNSUPPORTED);

          splitOnUnsupported.forEach((unsupportedWord) => {
            const splitOnSupported = unsupportedWord.split(SPLIT_ON_SUPPORTED);

            splitOnSupported.forEach((supportedWord) => {
              let finalWord = supportedWord.trimStart();
              selectedLanguage.definitions.forEach((definition) => {
                finalWord = finalWord.replaceAll(definition.char, definition.name);
              });
              finalWord = finalWord.replaceAll(SUPPORTED_CHARS, '');

              if (!ignoreElements.find((item) => item.contains(currentNode?.parentElement as HTMLElement))) {
                if (IGNORE_TEXT_NODE_IF_ONLY_CONTAINS.test(supportedWord)) {
                  // This is supported, but not by itself
                } else if (POLLY_PUNCTUATION.some((value) => value === supportedWord)) {
                  const previousWord = words.length ? words[words.length - 1] : undefined;
                  if (previousWord && !previousWord.text.endsWith('.')) {
                    previousWord.text += '.';
                  }
                } else if (finalWord.length) {
                  words.push({
                    startOffset:
                      startOffset + (replaceElement ? 0 : supportedWord.length - supportedWord.trimStart().length),
                    endOffset: startOffset + (replaceElement ? replaceElement.childNodes.length : supportedWord.length),
                    node: replaceElement ? replaceElement : (currentNode as Node),
                    text: finalWord,
                    punctuationParentElement: punctuationParentElement,
                  });
                }
              }
              if (!replaceElement) {
                startOffset += supportedWord.length;
              }
            });
          });
          if (!replaceElement) {
            startOffset += 1;
          }
        });
        if (replaceElement) {
          startOffset += 1;
        }
      }

      currentNode = treeWalker.nextNode();
    }

    words = words.map((word, i) => {
      const otherWords = words.find(
        (otherWord, j) =>
          otherWord.punctuationParentElement === word.punctuationParentElement && otherWord !== word && j > i,
      );
      return {
        ...word,
        text: otherWords || word.text.endsWith('.') ? word.text : word.text + '.',
      };
    });

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
            inputText: words.map((word) => word.text).join(' '),
          }
        : undefined,
    );

    if (hasWords) {
      highlightSelection({ words });
      highlightWords({ words });
      highlightSelectedWord({ word: words[0] });
    } else {
      clearHighlight();
    }
  }, [range, selectedLanguage, setTextSelection]);
};
