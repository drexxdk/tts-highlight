"use client";

import { UtteranceContext } from "@/features/tts/providers/UtteranceProvider";
import { useContext } from "react";

const TTSSelectionButton = () => {
  const utterance = useContext(UtteranceContext);

  return utterance ? (
    <button
      className="bg-gray-800 px-4 py-2 hover:bg-gray-900"
      onClick={() => {
        speechSynthesis.speak(utterance);
      }}
    >
      TTS Button
    </button>
  ) : null;
};
export default TTSSelectionButton;
