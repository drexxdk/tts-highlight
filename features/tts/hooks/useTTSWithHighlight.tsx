"use client";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Polly } from "../interfaces/Polly";
import { TTSSelection } from "../interfaces/TTSSelection";
import { TTSSelectionWord } from "../interfaces/TTSSelectionWord";
import {
  TTSWithHighlight,
  useTTSWithHighlightStore,
} from "../stores/useTTSWithHighlightStore";
import { fixRange } from "../utils/fixRange";
import { isBackwards } from "../utils/isBackwards";
import { nodesInRange } from "../utils/nodesInRange";
import { postRequest } from "../utils/requests";

const CHECK_SELECTION_DEBOUNCE_DELAY = 500;
const POLLY_LANGUAGE = "en";
const POLLY_API_ROOT = "https://web-next-api-dev.azurewebsites.net/api/";
const POLLY_API_URL = "polly/tts";
const IGNORE_TEXT_NODE_IF_ONLY_CONTAINS = new RegExp(/^[!?.,"'()[\]]+$/);

const REMOVE_CHARACTERS_FROM_TEXT_TO_POLLY = new RegExp(/[()_?\\\"]/g);

const ADD_PUNCTUATION_FOR_ELEMENT_TYPES: string[] = [
  "p",
  "li",
  "div",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
];

const DONT_ADD_PUNCTION_FOR_ELEMENT_ENDING_WITH: string[] = [".", "!", "?"];

export const useTTSWithHighlight = () => {
  const [ttsSelection, setTTSSelection] = useState<TTSSelection>();
  const setInstance = useTTSWithHighlightStore((state) => state.setInstance);

  const checkSelection = useDebouncedCallback(() => {
    const selection = window.getSelection();
    if (selection?.type === "Range") {
      if (!selection.toString().length) {
        return;
      }
      let range = document.createRange();
      if (isBackwards()) {
        range.setStart(selection.focusNode as Node, selection.focusOffset);
        range.setEnd(selection.anchorNode as Node, selection.anchorOffset);
      } else {
        range.setStart(selection.anchorNode as Node, selection.anchorOffset);
        range.setEnd(selection.focusNode as Node, selection.focusOffset);
      }
      range = fixRange(range);
      const originalRange = selection.getRangeAt(0);
      if (
        range.startOffset === originalRange.startOffset &&
        range.startContainer === originalRange.startContainer &&
        range.endOffset === originalRange.endOffset &&
        range.endContainer === originalRange.endContainer
      ) {
        if ("Highlight" in window && !("ontouchend" in document)) {
          // We dont want to keep the browser selection on desktop if that desktop supports Highlight API
          // Firefox will keep the selection
          selection.empty();
        }
        const nodes = nodesInRange(range);

        const treeWalker = document.createTreeWalker(
          range.commonAncestorContainer,
          NodeFilter.SHOW_TEXT
        );
        const allTextNodes = [];
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
                !IGNORE_TEXT_NODE_IF_ONLY_CONTAINS.test(currentNode.nodeValue)
            )
          ) {
            const leadingZeroes = currentNode.nodeValue?.search(/\S/) || 0;

            let startOffset =
              currentNode === range.startContainer
                ? range.startOffset
                : leadingZeroes;
            const endOffset =
              currentNode === range.endContainer ? range.endOffset : undefined;

            // TextNode can contain multiple words
            // Nolly's marks are for each individual word
            // This splits the textNode to match with Polly's marks
            const tempWords = currentNode.nodeValue
              ?.substring(startOffset, endOffset)
              .split(" ")
              .filter((text) => text.length);

            tempWords?.forEach((tempWord, i) => {
              // Polly will ignore words that only consist of the these characters
              // This ensures that our selection also ignores these words
              // We ignore these words, but they still exist, so we still need to add their offset to the other words offset
              if (IGNORE_TEXT_NODE_IF_ONLY_CONTAINS.test(tempWord)) {
                startOffset += tempWord.length + 1;
                return;
              }

              // Polly can't handle these characters
              // If the word contains these it would cause unpredictable sentences and words
              let word = tempWord.replaceAll(
                REMOVE_CHARACTERS_FROM_TEXT_TO_POLLY,
                ""
              );

              // If this word is the last in the TextNode
              if (i + 1 === tempWords.length) {
                // If this TextNode does not have any siblings after itself
                if (!currentNode?.nextSibling) {
                  let parentElement = currentNode?.parentElement;

                  // This ensures that we add punctuation at the end of sentence
                  // It goes from parentElement to parentElement and checks if it is a type that is within ADD_PUNCTUATION_FOR_ELEMENT_TYPES
                  // It also checks that this TextNode doesn't already end with a sentence ender within DONT_ADD_PUNCTION_FOR_ELEMENT_ENDING_WITH
                  while (parentElement) {
                    if (
                      ADD_PUNCTUATION_FOR_ELEMENT_TYPES.some(
                        (value) =>
                          value === parentElement?.nodeName.toLowerCase()
                      ) &&
                      !DONT_ADD_PUNCTION_FOR_ELEMENT_ENDING_WITH.some(
                        (value) =>
                          value === word.substring(word.length - 1, word.length)
                      )
                    ) {
                      // Add punctuation to make Polly understand this is the sentence ending
                      word = `${word}.`;

                      // Stop looping through parentElement
                      break;
                    }
                    parentElement = parentElement.parentElement;
                  }
                }
              }
              words.push({
                startOffset: startOffset,
                endOffset: startOffset + tempWord.length,
                node: currentNode as Node,
                word: word,
              });
              startOffset += tempWord.length + 1;
            });
            allTextNodes.push(currentNode);
          }
          currentNode = treeWalker.nextNode();
        }

        setTTSSelection({
          words: words,
          inputText: words.map((word) => word.word).join(" "),
        });
        if ("Highlight" in window) {
          const highlight = new Highlight(range);
          CSS.highlights.set("highlight", highlight);
        }
      } else {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, CHECK_SELECTION_DEBOUNCE_DELAY);

  useEffect(() => {
    if (ttsSelection) {
      const body = {
        Language: POLLY_LANGUAGE,
        InputText: ttsSelection.inputText,
      };

      postRequest<Polly>(POLLY_API_ROOT, POLLY_API_URL, body).then(
        (response) => {
          if (response) {
            const instance: TTSWithHighlight = {
              polly: response,
              selection: ttsSelection,
              hasSentences:
                response.Marks.filter((mark) => mark.type === "sentence")
                  .length > 1,
            };
            setInstance(instance);
            console.log("instance", instance);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }, [ttsSelection]);

  useEffect(() => {
    document.addEventListener("selectionchange", checkSelection);

    return () => {
      document.removeEventListener("selectionchange", checkSelection);
    };
  }, [checkSelection]);

  return ttsSelection;
};
