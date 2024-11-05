"use client";

import { useTTSWithHighlight } from "@/features/tts/hooks/useTTSWithHighlight";
import { useTTSWithHighlightStore } from "@/features/tts/stores/useTTSWithHighlightStore";
import classNames from "classnames";
import { SyntheticEvent, useRef, useState } from "react";

type AudioStatus = "loading" | "ready" | "playing" | "paused" | "ended";

const TTSPlayer = () => {
  const instance = useTTSWithHighlightStore((state) => state.instance);
  const player = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<AudioStatus>();
  const setInstance = useTTSWithHighlightStore((state) => state.setInstance);
  useTTSWithHighlight();

  const onEnded = () => {
    if (!player.current) {
      return;
    }
    player.current.currentTime = 0;
    setStatus("ready");
  };

  const onTimeUpdate = (e: SyntheticEvent<HTMLAudioElement>) => {
    if (!instance || !("Highlight" in window)) {
      return;
    }
    const target = e.target as HTMLAudioElement;
    const currentTime = Math.round((target.currentTime || 0) * 1000);

    const words = instance.polly.Marks.filter((mark) => mark.type === "word");
    if (!words.length) {
      return;
    }

    const marks = words.filter((mark) => Number(mark.time) <= currentTime);
    const mark = marks.length ? marks[marks.length - 1] : words[0];
    const index = words.findIndex((item) => item === mark);
    const word = instance.selection.words[index];
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

  const handleClose = () => {
    console.log("close");
    if (player.current) {
      player.current.pause();
    }
    setStatus(undefined);
    setInstance(undefined);
    if ("Highlight" in window) {
      CSS.highlights.clear();
    }
  };

  return instance ? (
    <>
      <audio
        ref={player}
        src={instance.polly.Audio[0]}
        onLoadStart={() => setStatus("loading")}
        onLoadedData={() => setStatus("ready")}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
      />
      <div
        className={classNames("bg-gray-800 p-1 flex gap-1 rounded-full", {
          "opacity-50": status === "loading",
        })}
      >
        <button
          className="bg-gray-900 px-4 py-1 hover:bg-gray-700 rounded-tl-full rounded-bl-full"
          onClick={
            status === "ready" || status === "paused" ? handlePlay : undefined
          }
        >
          {/* {status === "ready" || status === "paused" ? "Play" : null} */}
          {status === "playing" ? "Pause" : "Play"}
        </button>
        <button
          className="bg-gray-900 px-4 py-1 hover:bg-gray-700"
          onClick={
            status === "playing" || status === "paused"
              ? handleReset
              : undefined
          }
        >
          Reset
        </button>
        <button
          className="bg-gray-900 px-4 py-1 hover:bg-gray-700 rounded-tr-full rounded-br-full"
          onClick={handleClose}
        >
          Close
        </button>
      </div>
    </>
  ) : null;
};
export default TTSPlayer;
