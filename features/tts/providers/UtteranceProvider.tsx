"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { TTSSelectionContext } from "./TTSSelectionProvider";

export const UtteranceContext = createContext<
  SpeechSynthesisUtterance | undefined
>(undefined);

const useUtteranceInstance = () => {
  const ttsSelection = useContext(TTSSelectionContext);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance>();
  useEffect(() => {
    if (ttsSelection) {
      const instance = new SpeechSynthesisUtterance();
      instance.rate = 1;
      instance.lang = "en-UK";
      instance.text = ttsSelection.text;

      let wordIndex = 0;
      instance.onboundary = (event) => {
        if (event.name === "word") {
          const elem = ttsSelection.nodes[wordIndex];

          console.log("wordIndex", 0, elem.text);

          const range = document.createRange();
          range.setStart(elem.node, elem.startOffset);
          range.setEnd(elem.node, elem.endOffset);
          const highlight = new Highlight(range);
          CSS.highlights.set("word", highlight);
          wordIndex++;
        }
      };

      instance.onend = () => {
        wordIndex = 0;
        console.log("end");
      };

      setUtterance(instance);
    }

    return () => {
      speechSynthesis.cancel();
    };
  }, [ttsSelection]);

  const setVoice = useCallback(() => {
    if (utterance) {
      const voices = speechSynthesis.getVoices();
      const desiredVoice = voices.find(
        (voice) => voice.name === "Microsoft Zira - English (United States)"
      );
      if (desiredVoice) {
        utterance.voice = desiredVoice;
      }
    }
  }, [utterance]);

  useEffect(() => {
    if (utterance && speechSynthesis.onvoiceschanged) {
      setVoice();
    }

    speechSynthesis.onvoiceschanged = () => {
      setVoice();
    };
  }, [setVoice, utterance]);

  return utterance;
};

const UtteranceProvider = ({ children }: { children: ReactNode }) => {
  const utterance = useUtteranceInstance();

  return (
    <UtteranceContext.Provider value={utterance}>
      {children}
    </UtteranceContext.Provider>
  );
};
export default UtteranceProvider;
