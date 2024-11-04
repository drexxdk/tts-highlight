"use client";

import { PollyContext } from "@/features/tts/providers/PollyProvider";
import { TTSSelectionContext } from "@/features/tts/providers/TTSSelectionProvider";
import classNames from "classnames";
import { SyntheticEvent, useContext, useRef, useState } from "react";

type AudioStatus = "loading" | "ready" | "playing" | "paused" | "ended";

const TTSSelectionButton = () => {
  const ttsSelection = useContext(TTSSelectionContext);
  const polly = useContext(PollyContext);
  const player = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<AudioStatus>();

  const onEnded = () => {
    if (!player.current) {
      return;
    }
    player.current.currentTime = 0;
    setStatus("ready");
  };

  const onTimeUpdate = (e: SyntheticEvent<HTMLAudioElement>) => {
    if (!polly || !ttsSelection) {
      return;
    }
    const target = e.target as HTMLAudioElement;
    const currentTime = Math.round((target.currentTime || 0) * 1000);

    const words = polly.Marks.filter((mark) => mark.type === "word");
    if (!words.length) {
      return;
    }

    const marks = words.filter((mark) => Number(mark.time) <= currentTime);
    const mark = marks.length ? marks[marks.length - 1] : words[0];
    const index = words.findIndex((item) => item === mark);
    const word = ttsSelection.words[index];
    const range = document.createRange();
    range.setStart(word.node, word.startOffset);
    range.setEnd(word.node, word.endOffset);
    const highlight = new Highlight(range);
    CSS.highlights.set("word", highlight);
  };

  const handlePlay = () => {
    if (!player.current) {
      return;
    }
    if (status === "ready" || status === "paused") {
      player.current.play();
      setStatus("playing");
    } else if (status === "playing") {
      player.current.pause();
      setStatus("paused");
    }
  };

  const handleReset = () => {
    if (!player.current) {
      return;
    }
    player.current.pause();
    player.current.currentTime = 0;
    setStatus("ready");
  };

  return polly ? (
    <>
      <audio
        ref={player}
        src={polly.Audio[0]}
        onLoadStart={() => setStatus("loading")}
        onLoadedData={() => setStatus("ready")}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
      />
      <div
        className={classNames("bg-gray-800 p-2 flex gap-4", {
          "pointer-events-none": status === "loading",
        })}
      >
        <button
          className="bg-gray-900 px-4 py-2 hover:bg-gray-700"
          onClick={handlePlay}
        >
          {status === "ready" || status === "paused" ? "Play" : null}
          {status === "playing" ? "Pause" : null}
        </button>
        <button
          className="bg-gray-900 px-4 py-2 hover:bg-gray-700"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </>
  ) : null;
};
export default TTSSelectionButton;
