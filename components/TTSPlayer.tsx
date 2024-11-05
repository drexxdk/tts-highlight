"use client";

import { useTTSWithHighlight } from "@/features/tts/hooks/useTTSWithHighlight";
import { useTTSWithHighlightStore } from "@/features/tts/stores/useTTSWithHighlightStore";
import classNames from "classnames";
import { SyntheticEvent, useRef, useState } from "react";

type AudioStatus = "loading" | "ready" | "playing" | "paused" | "ended";

const TTSPlayer = () => {
  const store = useTTSWithHighlightStore((state) => state.instance);
  const audio = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<AudioStatus>();
  const setInstance = useTTSWithHighlightStore((state) => state.setInstance);
  useTTSWithHighlight();

  const highlightWord = (e: SyntheticEvent<HTMLAudioElement>) => {
    if (!store || !("Highlight" in window)) {
      return;
    }
    const target = e.target as HTMLAudioElement;
    const currentTime = Math.round((target.currentTime || 0) * 1000);

    const words = store.polly.Marks.filter((mark) => mark.type === "word");
    if (!words.length) {
      return;
    }

    const marks = words.filter((mark) => Number(mark.time) <= currentTime);
    const mark = marks.length ? marks[marks.length - 1] : words[0];
    const index = words.findIndex((item) => item === mark);
    const word = store.selection.words[index];
    const range = document.createRange();
    range.setStart(word.node, word.startOffset);
    range.setEnd(word.node, word.endOffset);
    const highlight = new Highlight(range);
    CSS.highlights.set("word", highlight);
  };

  const onLoadedData = (e: SyntheticEvent<HTMLAudioElement>) => {
    setStatus("ready");
    highlightWord(e);
  };

  const onTimeUpdate = (e: SyntheticEvent<HTMLAudioElement>) => {
    highlightWord(e);
  };

  const onEnded = () => {
    if (!audio.current) {
      return;
    }
    audio.current.currentTime = 0;
    setStatus("ready");
  };

  const handlePlay = () => {
    if (!audio.current) {
      return;
    }
    audio.current.play();
    setStatus("playing");
  };

  const handlePause = () => {
    if (!audio.current) {
      return;
    }
    audio.current.pause();
    setStatus("paused");
  };

  const handleReset = () => {
    if (!audio.current) {
      return;
    }
    audio.current.pause();
    audio.current.currentTime = 0;
    setStatus("ready");
  };

  const handleClose = () => {
    if (!audio.current) {
      return;
    }
    audio.current.pause();
    setStatus(undefined);
    setInstance(undefined);
    if ("Highlight" in window) {
      CSS.highlights.clear();
    }
  };

  return (
    <>
      <audio
        ref={audio}
        src={store?.polly.Audio[0]}
        onLoadStart={() => setStatus("loading")}
        onLoadedData={onLoadedData}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
      />
      <div
        className={classNames(
          "bg-gray-800 p-1 flex gap-1 rounded-full",
          {
            "opacity-50": status === "loading",
          },
          { hidden: !status }
        )}
      >
        <button
          className={classNames(
            "bg-gray-900 px-4 py-1 hover:bg-gray-700 rounded-tl-full rounded-bl-full",
            { hidden: status !== "ready" && status !== "paused" }
          )}
          onClick={handlePlay}
        >
          Play
        </button>
        <button
          className={classNames(
            "bg-gray-900 px-4 py-1 hover:bg-gray-700 rounded-tl-full rounded-bl-full",
            { hidden: status !== "playing" }
          )}
          onClick={handlePause}
        >
          Pause
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
  );
};
export default TTSPlayer;
