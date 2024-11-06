"use client";

import { useTTSWithHighlight } from "@/features/tts/hooks/useTTSWithHighlight";
import { useTTSWithHighlightStore } from "@/features/tts/stores/useTTSWithHighlightStore";
import classNames from "classnames";
import { SyntheticEvent, useRef, useState } from "react";
import {
  BsArrowCounterclockwise,
  BsPauseFill,
  BsPlayFill,
  BsSkipEndFill,
  BsSkipStartFill,
  BsX,
} from "react-icons/bs";

type AudioStatus = "loading" | "ready" | "playing" | "paused" | "ended";

const TTSPlayer = () => {
  const store = useTTSWithHighlightStore((state) => state.instance);
  const audio = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<AudioStatus>();
  const [hasPreviousSentence, setHasPreviousSentence] = useState<boolean>();
  const [hasNextSentence, setHasNextSentence] = useState<boolean>();
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
    setHasPreviousSentence(undefined);
    setHasNextSentence(undefined);

    const selection = window.getSelection();
    if (selection) {
      selection.empty();
    }
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
        {hasNextSentence !== undefined ? (
          <button
            className={classNames(
              "bg-gray-900 p-2 rounded-full",
              hasPreviousSentence ? "hover:bg-gray-700" : "opacity-50"
            )}
            disabled={!hasPreviousSentence}
          >
            <BsSkipStartFill size={24} />
          </button>
        ) : null}

        <button
          className={classNames(
            "bg-gray-200 p-2 rounded-full text-gray-950",
            status === "ready" || status === "paused"
              ? "hover:opacity-75"
              : "hidden"
          )}
          onClick={handlePlay}
          disabled={status !== "ready" && status !== "paused"}
        >
          <BsPlayFill size={24} />
        </button>
        <button
          className={classNames(
            "bg-gray-200 p-2 rounded-full text-gray-950",
            status === "playing" ? "hover:opacity-75" : "hidden"
          )}
          onClick={handlePause}
          disabled={status !== "playing"}
        >
          <BsPauseFill size={24} />
        </button>
        <button
          className={classNames(
            "bg-gray-900 p-2 rounded-full",
            status === "playing" || status === "paused"
              ? "hover:opacity-75"
              : "opacity-50"
          )}
          disabled={status !== "playing" && status !== "paused"}
          onClick={handleReset}
        >
          <BsArrowCounterclockwise />
        </button>
        {hasNextSentence !== undefined ? (
          <button
            className={classNames(
              "bg-gray-900 p-2 rounded-full",
              hasNextSentence ? "hover:opacity-75" : "opacity-50"
            )}
            disabled={!hasNextSentence}
          >
            <BsSkipEndFill size={24} />
          </button>
        ) : null}
        <button
          className="bg-gray-950 p-2 hover:opacity-75 rounded-full"
          onClick={handleClose}
        >
          <BsX size={24} />
        </button>
      </div>
    </>
  );
};
export default TTSPlayer;
