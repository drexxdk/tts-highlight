"use client";

import {
  createContext,
  ReactNode,
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

      const voices = speechSynthesis.getVoices();
      const desiredVoice = voices.find(
        (voice) => voice.name === "Microsoft Zira - English (United States)"
      );
      if (desiredVoice) {
        instance.voice = desiredVoice;
      }

      let wordIndex = 0;
      instance.onboundary = (event) => {
        if (event.name === "word") {
          const elem = ttsSelection.nodes[wordIndex];
          const range = document.createRange();
          range.setStart(elem.node, elem.startOffset);
          range.setEnd(elem.node, elem.endOffset);
          const highlight = new Highlight(range);
          CSS.highlights.set("word", highlight);
          wordIndex++;
        }
      };

      instance.onend = () => {
        console.log("end");
      };

      setUtterance(instance);
    }
  }, [ttsSelection]);

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
