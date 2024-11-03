"use client";

import { UtteranceContext } from "@/features/tts/providers/UtteranceProvider";
import { useContext, useState } from "react";

const TTSSelectionButton = () => {
  const [isPaused, setIsPaused] = useState(false);
  const utterance = useContext(UtteranceContext);

  const handlePlay = () => {
    if (!utterance) {
      return;
    }
    if (isPaused) {
      speechSynthesis.resume();
    } else {
      speechSynthesis.speak(utterance);
    }

    setIsPaused(false);
  };

  const handlePause = () => {
    speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleStop = () => {
    speechSynthesis.cancel();
    setIsPaused(false);
  };

  return utterance ? (
    <div className="bg-gray-800 p-2 flex gap-4">
      <button
        className="bg-gray-900 px-4 py-2 hover:bg-gray-700"
        onClick={handlePlay}
      >
        {isPaused ? "Resume" : "Play"}
      </button>
      <button
        className="bg-gray-900 px-4 py-2 hover:bg-gray-700"
        onClick={handlePause}
      >
        Pause
      </button>
      <button
        className="bg-gray-900 px-4 py-2 hover:bg-gray-700"
        onClick={handleStop}
      >
        Stop
      </button>
    </div>
  ) : null;
};
export default TTSSelectionButton;
