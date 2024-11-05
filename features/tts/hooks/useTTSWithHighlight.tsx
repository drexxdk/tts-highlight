"use client";

import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Polly } from "../interfaces/Polly";
import { TTSSelection } from "../interfaces/TTSSelection";
import { TTSSelectionWord } from "../interfaces/TTSSelectionWord";
import { useTTSWithHighlightStore } from "../stores/useTTSWithHighlightStore";
import { fixRange } from "../utils/fixRange";
import { isBackwards } from "../utils/isBackwards";
import { nodesInRange } from "../utils/nodesInRange";
import { postRequest } from "../utils/requests";

const CHECK_SELECTION_DEBOUNCE_DELAY = 500;
const POLLY_LANGUAGE = "en";
const POLLY_API_ROOT = "https://web-next-api-dev.azurewebsites.net/api/";
const POLLY_API_URL = "polly/tts";
const IGNORE_NODE_IF_ONLY_CONTAINS_CHARACTERS_REGEX = new RegExp(
  /^[!?.,"'()[\]]+$/
);

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
                !IGNORE_NODE_IF_ONLY_CONTAINS_CHARACTERS_REGEX.test(
                  currentNode.nodeValue
                )
            )
          ) {
            const leadingZeroes = currentNode.nodeValue?.search(/\S/) || 0;
            let startOffset =
              currentNode === range.startContainer
                ? range.startOffset
                : leadingZeroes;
            const endOffset =
              currentNode === range.endContainer ? range.endOffset : undefined;
            const tempWords = currentNode.nodeValue
              ?.substring(startOffset, endOffset)
              .split(" ")
              .filter((text) => text.length);
            tempWords?.forEach((word) => {
              words.push({
                startOffset: startOffset,
                endOffset: startOffset + word.length,
                node: currentNode as Node,
                text: word,
              });
              startOffset += word.length + 1;
            });
          }
          allTextNodes.push(currentNode);
          currentNode = treeWalker.nextNode();
        }

        setTTSSelection({
          words: words,
          inputText: words.map((word) => word.text).join(" "),
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
            setInstance({
              polly: response,
              selection: ttsSelection,
            });
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
