'use client';

import { useEffect } from 'react';
import { ADD_PUNCTUATION_FOR_HTML_ELEMENT_TYPES } from '../const/add-punctuation-for-html-element-types';
import { TextSelectionWord } from '../interfaces/TextSelectionWord';
import { useTTSWithHighlightStore } from '../stores/useTTSWithHighlightStore';
import { elementIsVisible } from '../utils/elementIsVisible';
import { nodesInRange } from '../utils/nodesInRange';
import { useRangeIfReady } from './useRangeIfReady';

// If word contains these characters then add whitespace around each of them.
// Polly can't handle them within a word.
const SPLIT_IN_WORD = new RegExp(/(?=[?_.<>#%=/])|(?<=[?_.<>#%=/])/g);

// Polly will remove these characters if they stand alone.
// We need to ignore them in our selection.
const IGNORE_TEXT_NODE_IF_ONLY_CONTAINS = new RegExp(/^[!?.\¨\[\]]+$/);

// These symbols count as sentence endings for Polly.
const DONT_ADD_PUNCTION_FOR_ELEMENTS_ENDING_WITH: string[] = ['.', '!', '?'];

const IGNORE_ELEMENTS_WITH_DATA_ATTRIBUTE = 'data-tts-ignore';
const REPLACE_ELEMENTS_WITH_DATA_ATTRIBUTE = 'data-tts-replace';

export const useSelection = () => {
  const setTextSelection = useTTSWithHighlightStore((state) => state.setTextSelection);
  const selectedLanguage = useTTSWithHighlightStore((state) => state.selectedLanguage);
  const { range } = useRangeIfReady();

  useEffect(() => {
    if (!range || !selectedLanguage) {
      return;
    }

    const ignoreElements = Array.from<HTMLElement>(
      document.querySelectorAll(`[${IGNORE_ELEMENTS_WITH_DATA_ATTRIBUTE}]`),
    );
    const replaceElements = Array.from<HTMLElement>(
      document.querySelectorAll(`[${REPLACE_ELEMENTS_WITH_DATA_ATTRIBUTE}]`),
    );
    setTextSelection(undefined);

    const SUPPORTED_CHARS_REGEX = new RegExp(`[^${selectedLanguage.chars.join('')}]`, 'g');

    if ('Highlight' in window && !('ontouchend' in document)) {
      // We dont want to keep the browser selection on desktop if that desktop supports Highlight API
      // Firefox will keep the selection
      const selection = window.getSelection();
      selection?.empty();
    }
    const nodes = nodesInRange(range);
    const treeWalker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT);
    let currentNode: Node | null;

    if (range.startContainer === range.endContainer) {
      currentNode = range.startContainer;
    } else {
      currentNode = treeWalker.nextNode();
    }

    const words: TextSelectionWord[] = [];
    while (currentNode) {
      if (
        nodes.find(
          (node) =>
            node === currentNode &&
            currentNode.nodeValue &&
            !IGNORE_TEXT_NODE_IF_ONLY_CONTAINS.test(currentNode.nodeValue) &&
            elementIsVisible(currentNode.parentElement),
        )
      ) {
        let startOffset = currentNode === range.startContainer ? range.startOffset : 0;
        const endOffset = currentNode === range.endContainer ? range.endOffset : undefined;

        const replaceElement = replaceElements.find((item) => item.contains(currentNode?.parentElement as HTMLElement));
        if (replaceElement) {
          const usedHtmlElement = replaceElement.querySelector<HTMLElement>(':scope > span:last-child') || undefined;

          if (usedHtmlElement) {
            const usedNode = usedHtmlElement.innerText.trim();
            const tempWords = usedNode.replaceAll(SUPPORTED_CHARS_REGEX, '').trim().split(' ');
            tempWords?.forEach((tempWord) => {
              if (IGNORE_TEXT_NODE_IF_ONLY_CONTAINS.test(tempWord) || tempWord.length === 0) {
                return;
              }
              const word: TextSelectionWord = {
                startOffset: startOffset,
                endOffset: startOffset + 1,
                node: replaceElement,
                word: tempWord,
              };
              if (
                words.find(
                  (item) =>
                    item.startOffset === word.startOffset &&
                    item.endOffset === word.endOffset &&
                    item.word === word.word &&
                    item.node === word.node,
                )
              ) {
                return;
              }
              words.push(word);
            });
            startOffset += 1;
          }
        } else {
          // TextNode can contain multiple words
          // Nolly's marks are for each individual word
          // This splits the textNode to match with Polly's marks
          const tempWords = currentNode.nodeValue?.substring(startOffset, endOffset).split(' ');
          tempWords?.forEach((tempWord, i) => {
            // Polly will ignore words that only consists of the these characters
            // This ensures that our selection also ignores these characters
            // These characters still exist, so we need to account for them
            // Empty words are in reality spaces that needs to be accounted for
            if (IGNORE_TEXT_NODE_IF_ONLY_CONTAINS.test(tempWord) || tempWord.length === 0) {
              startOffset += tempWord.length + 1;
              return;
            }

            // Polly can't handle these characters
            // If the word contains these, it would cause unpredictable breaks in sentences and words
            // tempWord = tempWord.replaceAll(REMOVE_CHARACTERS_FROM_TEXT_TO_POLLY, '');

            let addSentenceEnding = false;

            // If this word is the last in the TextNode
            // If this TextNode does not have any siblings after itself
            if (i + 1 === tempWords.length && !currentNode?.nextSibling) {
              let parentElement = currentNode?.parentNode;

              // This ensures that we add punctuation at the end of sentence
              // It goes from parentElement to parentElement and checks if it is a type that is within ADD_PUNCTUATION_FOR_ELEMENT_TYPES
              // It also checks that this TextNode doesn't already end with a sentence ender within DONT_ADD_PUNCTION_FOR_ELEMENT_ENDING_WITH
              while (parentElement) {
                if (
                  DONT_ADD_PUNCTION_FOR_ELEMENTS_ENDING_WITH.some(
                    (value) => value === tempWord.substring(tempWord.length - 1, tempWord.length),
                  )
                ) {
                  break;
                } else if (
                  ADD_PUNCTUATION_FOR_HTML_ELEMENT_TYPES.some(
                    (value) => value === parentElement?.nodeName.toLowerCase(),
                  )
                ) {
                  addSentenceEnding = true;
                  break;
                } else if (parentElement.nextSibling) {
                  // Stop looping through parentElement
                  break;
                } else {
                  // Check next parent element
                  parentElement = parentElement.parentElement;
                }
              }
            }

            // A TextNode can start with any number of whitespaces
            // We need to account for them, but not visually highlight them
            const leadingWhitespaces = tempWord.length - tempWord.trimStart().length;
            if (leadingWhitespaces) {
              startOffset += leadingWhitespaces;
            }

            const splitWords = tempWord.split(SPLIT_IN_WORD);
            splitWords.forEach((splitWord, i) => {
              const leadingSplitWordWhitespaces = splitWord.length - splitWord.trimStart().length;
              const finalWord = splitWord.replaceAll(SUPPORTED_CHARS_REGEX, '').trimStart();
              if (
                finalWord.length &&
                !IGNORE_TEXT_NODE_IF_ONLY_CONTAINS.test(finalWord) &&
                !ignoreElements.find((item) => item.contains(currentNode?.parentElement as HTMLElement))
              ) {
                words.push({
                  startOffset: startOffset,
                  endOffset: startOffset - leadingSplitWordWhitespaces + splitWord.length,
                  node: currentNode as Node,
                  word: finalWord + (addSentenceEnding && i + 1 === splitWords.length ? '.' : ''),
                });
              }
              startOffset += splitWord.length;
            });
            startOffset += 1;
          });
        }
      }
      currentNode = treeWalker.nextNode();
    }

    const inputText = words.map((word) => word.word).join(' ');
    setTextSelection(
      inputText
        ? {
            words: words,
            inputText: inputText,
          }
        : undefined,
    );
    console.log('words', words);

    if ('Highlight' in window && words.length) {
      const selectionHighlight = new Highlight(document.createRange());
      CSS.highlights.set('selection', selectionHighlight);

      const wordHighlight = new Highlight();
      words.forEach((word) => {
        const wordRange = document.createRange();
        wordRange.setStart(word.node, word.startOffset);
        wordRange.setEnd(word.node, word.endOffset);
        wordHighlight.add(wordRange);
      });
      CSS.highlights.set('word', wordHighlight);

      const selectedWordRange = document.createRange();
      const selectedWord = words[0];
      selectedWordRange.setStart(selectedWord.node, selectedWord.startOffset);
      selectedWordRange.setEnd(selectedWord.node, selectedWord.endOffset);
      CSS.highlights.set('selected-word', new Highlight(selectedWordRange));
    } else {
      CSS.highlights.clear();
    }
  }, [range, selectedLanguage]);
};
