"use client";

import HtmlDemo from "@/app/_components/HtmlDemo";
import "@vidstack/react/player/styles/base.css";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { isBackwards } from "./_utils/isBackwards";

export interface IPollyObject {
  Audio: string[];
  Marks: IPollyMark[];
  Status: "Success"; // What else can it return?
}

export interface IPollyMark {
  end: string;
  start: string;
  time: string;
  type: string;
  value: string;
}

const getNextNode = (node: Node, skipChildren?: boolean): ChildNode | null => {
  //if there are child nodes and we didn't come from a child node
  if (node.firstChild && !skipChildren) {
    return node.firstChild;
  }
  if (!node.parentNode) {
    return null;
  }
  return node.nextSibling || getNextNode(node.parentNode, true);
};

const getNodesInRange = (range: Range) => {
  const start = range.startContainer;
  const end = range.endContainer;
  const commonAncestor = range.commonAncestorContainer;
  const nodes = [];
  let node;

  // walk parent nodes from start to common ancestor
  for (node = start.parentNode; node; node = node.parentNode) {
    nodes.push(node);
    if (node == commonAncestor) break;
  }
  nodes.reverse();

  // walk children and siblings from start until end is found
  for (node = start; node; node = getNextNode(node)) {
    nodes.push(node);
    if (node == end) break;
  }

  return nodes;
};

const fixRange = (range: Range) => {
  let rangeString = range.toString();
  try {
    while (rangeString[0] != " ") {
      range.setStart(range.startContainer, range.startOffset - 1);
      rangeString = range.toString();
    }
    range.setStart(range.startContainer, range.startOffset + 1);
  } catch {}
  try {
    while (rangeString[rangeString.length - 1] != " ") {
      range.setEnd(range.endContainer, range.endOffset + 1);
      rangeString = range.toString();
    }
    range.setEnd(range.endContainer, range.endOffset - 1);
  } catch {}
  return range;
};

interface ITextSelectionItem {
  node: Node;
  text: string;
  startOffset: number;
  endOffset: number;
}

interface ITextSelection {
  nodes: ITextSelectionItem[];
  text: string;
  selection: Selection;
}

// interface ITiming {
//   start: number;
//   end: number;
// }

export default function Home() {
  const DELAY = 100;
  const [textSelection, setTextSelection] = useState<ITextSelection>();

  const utterance = new SpeechSynthesisUtterance();
  let wordIndex = 0;
  utterance.lang = "en-UK";
  utterance.rate = 1;

  // var currentTime = performance.now();
  // const TIMINGS: ITiming[] = []; // Object to store the timings

  // Function to set the desired voice
  function setVoice() {
    const voices = speechSynthesis.getVoices();
    const desiredVoice = voices.find(
      (voice) => voice.name === "Microsoft George - English (United Kingdom)"
    );
    if (desiredVoice) {
      utterance.voice = desiredVoice;
    } else {
      console.error("Desired voice not found");
    }
  }

  // Ensure voices are loaded
  speechSynthesis.onvoiceschanged = function () {
    setVoice();
  };

  utterance.onboundary = function (event) {
    if (!textSelection) {
      return;
    }
    if (event.name === "word") {
      const elem = textSelection.nodes[wordIndex];
      console.log("elem", elem, "event", event);

      const range = document.createRange();
      range.setStart(elem.node, elem.startOffset);
      range.setEnd(elem.node, elem.endOffset);
      const highlight = new Highlight(range);
      CSS.highlights.set("word", highlight);

      wordIndex++;
    }
  };

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
        console.log("nothing selected");
        return;
      } else {
        console.log("body", body);
      }
      const nodes = getNodesInRange(range);

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
      let words: ITextSelectionItem[] = [];
      while (currentNode) {
        let words2: ITextSelectionItem[] = [];
        if (
          nodes.find(
            (node) =>
              node === currentNode &&
              currentNode.nodeValue !== "?" &&
              currentNode.nodeValue !== "."
          )
        ) {
          if (currentNode === range.startContainer) {
            // start
            const words = currentNode.nodeValue
              ?.substring(range.startOffset)
              .split(" ")
              .filter((text) => text.length);
            let offset = range.startOffset;
            words?.forEach((word) => {
              words2.push({
                startOffset: offset,
                endOffset: offset + word.length,
                node: currentNode as Node,
                text: word,
              });
              offset += word.length + 1;
            });
          } else {
            // other
            const words = currentNode.nodeValue
              ?.split(" ")
              .filter((text) => text.length);
            let offset = 0;
            words?.forEach((word) => {
              words2.push({
                startOffset: offset,
                endOffset: offset + word.length,
                node: currentNode as Node,
                text: word,
              });
              offset += word.length + 1;
            });
          }
          words = words.concat(words2);
          // setTextSelection(words);

          // words.map((word) => {
          //   if (word.length) {
          //     console.log("Node is within text selection:", word);
          //   }
          // });
        }
        allTextNodes.push(currentNode);
        currentNode = treeWalker.nextNode();
      }
      console.log("textSeleciton", words);
      setTextSelection({
        nodes: words,
        text: selection.toString(),
        selection: selection,
      });
      selection.empty();

      // postRequest<IPollyObject>(
      //   "https://web-next-api-dev.azurewebsites.net/api/",
      //   "polly/TTS",
      //   body
      // ).then((value) => {
      //   setTTS(value || undefined);
      //   console.log("polly", value);
      //   if (!value) {
      //     return;
      //   }
      // });

      const highlight = new Highlight(range);
      CSS.highlights.set("highlight", highlight);
    }
  }, DELAY);

  useEffect(() => {
    document.addEventListener("click", checkSelection);

    return () => {
      document.removeEventListener("click", checkSelection);
    };
  }, [checkSelection]);

  return (
    <>
      <header>
        <button
          className="bg-orange-500"
          onClick={() => {
            if (!textSelection) {
              return;
            }
            wordIndex = 0;
            utterance.text = textSelection.text;
            speechSynthesis.speak(utterance);
          }}
        >
          audio player
        </button>
      </header>
      <main>
        <HtmlDemo />
        <HtmlDemo />
        <HtmlDemo />
      </main>
    </>
  );
}
