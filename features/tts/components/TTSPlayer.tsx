"use client";

import { useTTSWithHighlight } from "@/features/tts/hooks/useTTSWithHighlight";
import {
  TTSWithHighlight,
  useTTSWithHighlightStore,
} from "@/features/tts/stores/useTTSWithHighlightStore";
import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import {
  BsArrowCounterclockwise,
  BsPauseFill,
  BsPlayFill,
  BsSkipEndFill,
  BsSkipStartFill,
  BsX,
} from "react-icons/bs";

type AudioStatus = "loading" | "ready" | "playing" | "paused" | "ended";

const highlightWord = ({
  currentTime,
  store,
}: {
  currentTime: number;
  store: TTSWithHighlight;
}) => {
  if (!("Highlight" in window)) {
    return;
  }
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

const TTSPlayer = () => {
  const instance = useTTSWithHighlightStore((state) => state.instance);
  const setInstance = useTTSWithHighlightStore((state) => state.setInstance);
  const audio = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<AudioStatus>();
  const [hasPreviousSentence, setHasPreviousSentence] = useState<boolean>();
  const [hasNextSentence, setHasNextSentence] = useState<boolean>();
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  useTTSWithHighlight();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "playing") {
      interval = setInterval(() => {
        if (audio.current) {
          prepare(audio.current);
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [audio, status]);

  useEffect(() => {
    if (audio.current) {
      audio.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const prepare = (audio: HTMLAudioElement) => {
    if (!instance) {
      return;
    }

    const currentTime = Math.round((audio.currentTime || 0) * 1000);

    setHasPreviousSentence(
      instance.polly.Marks.some(
        (mark) => mark.type === "word" && Number(mark.time) < currentTime
      )
    );

    setHasNextSentence(
      instance.polly.Marks.some(
        (mark) => mark.type === "sentence" && Number(mark.time) > currentTime
      )
    );

    highlightWord({ currentTime, store: instance });
  };

  const onLoadedData = () => {
    setStatus("ready");
    if (audio.current) {
      prepare(audio.current);
    }
  };

  const onEnded = () => {
    if (!audio.current) {
      return;
    }
    setStatus("ready");
  };

  const onPlay = () => {
    if (!audio.current) {
      return;
    }
    audio.current.play();
    setStatus("playing");
  };

  const onPause = () => {
    if (!audio.current) {
      return;
    }
    audio.current.pause();
    setStatus("paused");
  };

  const onReset = () => {
    if (!audio.current) {
      return;
    }
    audio.current.pause();
    audio.current.currentTime = 0;
    setStatus("ready");
  };

  const onClose = () => {
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

  const onPreviousSentence = () => {
    if (!instance || !audio.current) {
      return;
    }

    const currentTime = audio.current.currentTime;
    const sentences = instance.polly.Marks.filter(
      (mark) =>
        mark.type === "sentence" && Number(mark.time) / 1000 < currentTime
    );
    if (!sentences.length) {
      return;
    }
    const sentenceIndex = instance.polly.Marks.findIndex(
      (sentence) =>
        sentence ===
        sentences[sentences.length - (sentences.length > 1 ? 2 : 1)]
    );
    const word = instance.polly.Marks[sentenceIndex + 1];
    audio.current.currentTime = Number(word.time) / 1000;
    prepare(audio.current);
  };

  const onNextSentence = () => {
    if (!instance || !audio.current) {
      return;
    }

    const currentTime = audio.current.currentTime;
    const sentenceIndex = instance.polly.Marks.findIndex(
      (mark) =>
        mark.type === "sentence" && Number(mark.time) / 1000 > currentTime
    );
    if (!sentenceIndex || instance.polly.Marks.length <= sentenceIndex) {
      return;
    }
    const word = instance.polly.Marks[sentenceIndex + 1];
    audio.current.currentTime = Number(word.time) / 1000;
    if (audio.current) {
      prepare(audio.current);
    }
  };

  return (
    <>
      <audio
        ref={audio}
        src={instance?.polly.Audio[0]}
        onLoadStart={() => setStatus("loading")}
        onLoadedData={onLoadedData}
        onEnded={onEnded}
      />
      <div
        className={classNames(
          "bg-gray-800 p-1 flex gap-1 rounded-full items-center",
          {
            "opacity-50": status === "loading",
          },
          { hidden: !status }
        )}
      >
        {instance?.hasSentences ? (
          <button
            className={classNames(
              "bg-gray-900 p-2 rounded-full",
              hasPreviousSentence ? "hover:bg-gray-700" : "opacity-50"
            )}
            onClick={onPreviousSentence}
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
          onClick={onPlay}
          disabled={status !== "ready" && status !== "paused"}
        >
          <BsPlayFill size={24} />
        </button>
        <button
          className={classNames(
            "bg-gray-200 p-2 rounded-full text-gray-950",
            status === "playing" ? "hover:opacity-75" : "hidden"
          )}
          onClick={onPause}
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
          onClick={onReset}
          disabled={status !== "playing" && status !== "paused"}
        >
          <BsArrowCounterclockwise />
        </button>
        {instance?.hasSentences ? (
          <button
            className={classNames(
              "bg-gray-900 p-2 rounded-full",
              hasNextSentence ? "hover:opacity-75" : "opacity-50"
            )}
            onClick={onNextSentence}
            disabled={!hasNextSentence}
          >
            <BsSkipEndFill size={24} />
          </button>
        ) : null}
        <Popover className="relative">
          <PopoverButton className="bg-gray-900 px-2 relative h-[34px] w-14 rounded-full text-sm">
            {playbackRate}
          </PopoverButton>
          <PopoverBackdrop className="fixed inset-0 bg-black/15" />
          <PopoverPanel
            anchor={{
              gap: 16,
              offset: 0,
              padding: 16,
              to: "bottom",
            }}
            className="flex flex-col px-6 py-4 bg-gray-950 rounded-full"
          >
            <input
              type="range"
              min={0.5}
              max={1.5}
              step={0.25}
              value={playbackRate}
              onChange={(e) => setPlaybackRate(Number(e.target.value))}
            ></input>
          </PopoverPanel>
        </Popover>
        <button
          className="bg-gray-950 p-2 hover:opacity-75 rounded-full"
          onClick={onClose}
        >
          <BsX size={24} />
        </button>
      </div>
    </>
  );
};
export default TTSPlayer;
