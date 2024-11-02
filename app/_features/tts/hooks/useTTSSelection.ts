import { isBackwards } from "@/app/_features/tts/utils/isBackwards";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { TTSSelection } from "../interfaces/TTSSelection";
import { TTSSelectionNode } from "../interfaces/TTSSelectionNode";
import { fixRange } from "../utils/fixRange";
import { nodesInRange } from "../utils/nodesInRange";

export const useTTSSelection = () => {
  const DEBOUNCE_DELAY = 100;
  const [ttsSelection, setTTSSelection] = useState<TTSSelection>();
  const checkSelection = useDebouncedCallback(async () => {
    const selection = window.getSelection();
    if (selection?.type === "Range") {
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

      const body = {
        language: "da",
        inputText: selection.toString(),
      };
      if (!body.inputText.length) {
        return;
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
      const words: TTSSelectionNode[] = [];
      while (currentNode) {
        if (
          nodes.find(
            (node) =>
              node === currentNode &&
              currentNode.nodeValue !== "?" &&
              currentNode.nodeValue !== "."
          )
        ) {
          let offset =
            currentNode === range.startContainer ? range.startOffset : 0;
          const tempWords = currentNode.nodeValue
            ?.substring(offset)
            .split(" ")
            .filter((text) => text.length);
          tempWords?.forEach((word) => {
            words.push({
              startOffset: offset,
              endOffset: offset + word.length,
              node: currentNode as Node,
              text: word,
            });
            offset += word.length + 1;
          });
        }
        allTextNodes.push(currentNode);
        currentNode = treeWalker.nextNode();
      }
      setTTSSelection({
        nodes: words,
        text: selection.toString(),
      });
      selection.empty();

      const highlight = new Highlight(range);
      CSS.highlights.set("highlight", highlight);
    }
  }, DEBOUNCE_DELAY);

  useEffect(() => {
    document.addEventListener("click", checkSelection);

    return () => {
      document.removeEventListener("click", checkSelection);
    };
  }, [checkSelection]);

  return {
    ttsSelection: ttsSelection,
  };
};
