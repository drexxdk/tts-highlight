'use client';

import { useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Polly } from '../interfaces/Polly';
import { PollyBody } from '../interfaces/PollyBody';
import { TTSSelection } from '../interfaces/TTSSelection';
import { TTSSelectionWord } from '../interfaces/TTSSelectionWord';
import { TTSWithHighlight } from '../interfaces/TTSWithHighlight';
import { useTTSWithHighlightStore } from '../stores/useTTSWithHighlightStore';
import { fixRange } from '../utils/fixRange';
import { nodesInRange } from '../utils/nodesInRange';
import { postRequest } from '../utils/requests';

const CHECK_SELECTION_DEBOUNCE_DELAY = 500;
const POLLY_API_ROOT = 'https://web-next-api-dev.azurewebsites.net/api/';
const POLLY_API_URL = 'polly/tts';
const SPLIT_IN_WORD = new RegExp(/(?=[<>#%=/])|(?<=[<>#%=/])/g);

// Danish does not understand this symbol: ¤. "¤" can't be trusted.
// English combines "a & a" into a single word. "&" can't be trusted.
const REMOVE_CHARACTERS_FROM_WORD = new RegExp(/[&¤:;(),\*\^\´\`\/\-\"\']/g);

// Polly will ignore these characters if they stand alone
const IGNORE_TEXT_NODE_IF_ONLY_CONTAINS = new RegExp(/^[!?.\¨\[\]]+$/);

const ADD_PUNCTUATION_FOR_HTML_ELEMENT_TYPES: string[] = [
  'p',
  'li',
  'div',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'th', // The Table Header element
  'td', // The Table Data Cell element
  'caption', // The Table Caption element
  'dt', // The Description List element
  'dd', // The Description Details element
  'figcaption', // The Figure Caption element
  'blockquote',
  'cite', // The Citation element
  'option',
  'legend', // The Field Set Legend element
  'label',
];

const DONT_ADD_PUNCTION_FOR_ELEMENTS_ENDING_WITH: string[] = ['.', '!', '?'];

export const useTTSWithHighlight = () => {
  const [ttsSelection, setTTSSelection] = useState<TTSSelection>();
  const setInstance = useTTSWithHighlightStore((state) => state.setInstance);
  const selectedLanguage = useTTSWithHighlightStore((state) => state.selectedLanguage);

  const checkSelection = useDebouncedCallback(() => {
    const selection = window.getSelection();
    if (selectedLanguage && selection?.type === 'Range' && selection.toString().trim().length) {
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
        if ('Highlight' in window && !('ontouchend' in document)) {
          // We dont want to keep the browser selection on desktop if that desktop supports Highlight API
          // Firefox will keep the selection
          selection.empty();
        }
        const nodes = nodesInRange(range);
        const treeWalker = document.createTreeWalker(range.commonAncestorContainer, NodeFilter.SHOW_TEXT);
        let currentNode: Node | null;

        if (range.startContainer === range.endContainer) {
          currentNode = range.startContainer;
        } else {
          currentNode = treeWalker.nextNode();
        }

        const words: TTSSelectionWord[] = [];
        while (currentNode) {
          if (
            nodes.find(
              (node) =>
                node === currentNode &&
                currentNode.nodeValue &&
                !IGNORE_TEXT_NODE_IF_ONLY_CONTAINS.test(currentNode.nodeValue),
            )
          ) {
            let startOffset = currentNode === range.startContainer ? range.startOffset : 0;
            const endOffset = currentNode === range.endContainer ? range.endOffset : undefined;

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

              const splitWord = tempWord.split(SPLIT_IN_WORD);
              splitWord.forEach((token, i) => {
                const word = token.replaceAll(REMOVE_CHARACTERS_FROM_WORD, '');
                if (word.length) {
                  words.push({
                    startOffset: startOffset,
                    endOffset: startOffset + token.length,
                    node: currentNode as Node,
                    word: word + (addSentenceEnding && i + 1 === splitWord.length ? '.' : ''),
                  });
                }
                startOffset += token.length;
              });
              startOffset += 1;
            });
          }
          currentNode = treeWalker.nextNode();
        }

        const inputText = words.map((word) => word.word).join(' ');
        setTTSSelection({
          words: words,
          inputText: inputText,
        });

        if ('Highlight' in window && inputText) {
          const highlight = new Highlight(range);
          CSS.highlights.set('highlight', highlight);
        } else {
          CSS.highlights.clear();
        }
      } else {
        // Remove the selection the user have made
        selection.removeAllRanges();
        // Change the range into the fixed range
        selection.addRange(range);
      }
    }
  }, CHECK_SELECTION_DEBOUNCE_DELAY);

  useEffect(() => {
    if (ttsSelection && selectedLanguage) {
      const body: PollyBody = {
        Language: selectedLanguage.id,
        InputText: ttsSelection.inputText,
      };

      if (ttsSelection.inputText) {
        postRequest<Polly>(POLLY_API_ROOT, POLLY_API_URL, body).then(
          (response) => {
            if (response) {
              const instance: TTSWithHighlight = {
                polly: response,
                selection: ttsSelection,
                hasMultipleWords: response.Marks.filter((mark) => mark.type === 'word').length > 1,
                hasMultipleSentences: response.Marks.filter((mark) => mark.type === 'sentence').length > 1,
              };
              setInstance(instance);
              console.log('instance', instance);
            }
          },
          (error) => {
            console.log(error);
          },
        );
      }
    }
  }, [ttsSelection, selectedLanguage, setInstance]);

  useEffect(() => {
    document.addEventListener('selectionchange', checkSelection);

    return () => {
      document.removeEventListener('selectionchange', checkSelection);
    };
  }, [checkSelection]);

  return ttsSelection;
};
