"use client";

import { useCallback, useEffect, useState } from "react";
import { Polly } from "../interfaces/Polly";
import { TTSSelection } from "../interfaces/TTSSelection";
import { TTSSelectionWord } from "../interfaces/TTSSelectionWord";
import { useTTSWithHighlightStore } from "../stores/useTTSWithHighlightStore";
import { fixRange } from "../utils/fixRange";
import { isBackwards } from "../utils/isBackwards";
import { nodesInRange } from "../utils/nodesInRange";
import { postRequest } from "../utils/requests";

export const useTTSWithHighlight = () => {
  const [ttsSelection, setTTSSelection] = useState<TTSSelection>();
  const setInstance = useTTSWithHighlightStore((state) => state.setInstance);

  const checkSelection = useCallback(() => {
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
      selection.removeAllRanges();
      selection.addRange(range);

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
        const ignoreNodeIfOnlyContainsCharactersRegex =
          /^[\!\?\.\,\"\'\(\)\[\]]+$/;
        if (
          nodes.find(
            (node) =>
              node === currentNode &&
              currentNode.nodeValue &&
              !ignoreNodeIfOnlyContainsCharactersRegex.test(
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
        text: words.map((word) => word.text).join(" "),
      });
      selection.empty();

      const highlight = new Highlight(range);
      CSS.highlights.set("highlight", highlight);
    }
  }, []);

  useEffect(() => {
    if (ttsSelection) {
      const body = {
        Language: "en",
        InputText: ttsSelection.text,
      };

      postRequest<Polly>(
        "https://web-next-api-dev.azurewebsites.net/api/",
        "polly/tts",
        body
      ).then(
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
    document.addEventListener("click", checkSelection);

    return () => {
      document.removeEventListener("click", checkSelection);
    };
  }, [checkSelection]);

  return ttsSelection;
};
