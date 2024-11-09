"use client";

import { useTTSWithHighlight } from "@/features/tts/hooks/useTTSWithHighlight";
import { useTTSWithHighlightStore } from "@/features/tts/stores/useTTSWithHighlightStore";
import {
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import {
  FaBackwardFast,
  FaBackwardStep,
  FaBoltLightning,
  FaForwardFast,
  FaForwardStep,
  FaPause,
  FaPlay,
  FaRotateLeft,
  FaXmark,
} from "react-icons/fa6";
import { PreviousNextInfo } from "../interfaces/PreviousNextInfo";
import { getNextSentence } from "../utils/getNextSentence";
import { getNextWord } from "../utils/getNextWord";
import { getPreviousNextInfo } from "../utils/getPreviousNextInfo";
import { getPreviousSentence } from "../utils/getPreviousSentence";
import { getPreviousWord } from "../utils/getPreviousWord";
import { highlightWord } from "../utils/highlightWord";

type AudioStatus = "loading" | "ready" | "playing" | "paused" | "ended";

const TTSPlayer = () => {
  const instance = useTTSWithHighlightStore((state) => state.instance);
  const setInstance = useTTSWithHighlightStore((state) => state.setInstance);
  const audio = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<AudioStatus>();
  const [previousNextInfo, setPreviousNextInfo] = useState<PreviousNextInfo>();
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
    setPreviousNextInfo(
      getPreviousNextInfo({ instance: instance, currentTime })
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
    prepare(audio.current);
  };

  const onClose = () => {
    if (!audio.current) {
      return;
    }
    audio.current.pause();
    setStatus(undefined);
    setInstance(undefined);
    setPreviousNextInfo(undefined);

    const selection = window.getSelection();
    if (selection) {
      selection.empty();
    }
    if ("Highlight" in window) {
      CSS.highlights.clear();
    }
  };

  const onPreviousWord = () => {
    if (!instance || !audio.current) {
      return;
    }
    const mark = getPreviousWord({
      instance,
      currentTime: audio.current.currentTime,
    });
    if (mark) {
      audio.current.currentTime = Number(mark.time) / 1000;
      prepare(audio.current);
    }
  };

  const onNextWord = () => {
    if (!instance || !audio.current) {
      return;
    }
    const mark = getNextWord({
      instance,
      currentTime: audio.current.currentTime,
    });
    if (mark) {
      audio.current.currentTime = Number(mark.time) / 1000;
      prepare(audio.current);
    }
  };

  const onPreviousSentence = () => {
    if (!instance || !audio.current) {
      return;
    }
    const mark = getPreviousSentence({
      instance,
      currentTime: audio.current.currentTime,
    });
    if (mark) {
      audio.current.currentTime = Number(mark.time) / 1000;
      prepare(audio.current);
    }
  };

  const onNextSentence = () => {
    if (!instance || !audio.current) {
      return;
    }
    const mark = getNextSentence({
      instance,
      currentTime: audio.current.currentTime,
    });
    if (mark) {
      audio.current.currentTime = Number(mark.time) / 1000;
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
          "bg-gray-800 p-1 flex gap-1 rounded-3xl items-center flex-wrap justify-center ml-auto",
          {
            "opacity-50": status === "loading",
          },
          { hidden: !status }
        )}
      >
        {instance?.hasSentences && previousNextInfo ? (
          <>
            <button
              className={classNames(
                "bg-gray-900 rounded-full size-10 grid place-items-center",
                previousNextInfo.hasPreviousSentence
                  ? "hover:bg-gray-700"
                  : "opacity-50"
              )}
              onClick={onPreviousSentence}
              disabled={!previousNextInfo.hasPreviousSentence}
            >
              <FaBackwardFast size={16} />
            </button>
            <button
              className={classNames(
                "bg-gray-900 rounded-full size-10 grid place-items-center",
                previousNextInfo.hasPreviousWord
                  ? "hover:bg-gray-700"
                  : "opacity-50"
              )}
              onClick={onPreviousWord}
              disabled={!previousNextInfo.hasPreviousWord}
            >
              <FaBackwardStep size={16} />
            </button>
          </>
        ) : null}

        <button
          className={classNames(
            "bg-gray-200 rounded-full text-gray-950 size-10 grid place-items-center",
            status === "ready" || status === "paused"
              ? "hover:opacity-75"
              : "hidden"
          )}
          onClick={onPlay}
          disabled={status !== "ready" && status !== "paused"}
        >
          <FaPlay size={24} />
        </button>
        <button
          className={classNames(
            "bg-gray-200 rounded-full text-gray-950 size-10 grid place-items-center",
            status === "playing" ? "hover:opacity-75" : "hidden"
          )}
          onClick={onPause}
          disabled={status !== "playing"}
        >
          <FaPause size={24} />
        </button>
        <button
          className={classNames(
            "bg-gray-900 rounded-full size-10 grid place-items-center",
            status === "playing" || status === "paused"
              ? "hover:opacity-75"
              : "opacity-50"
          )}
          onClick={onReset}
          disabled={status !== "playing" && status !== "paused"}
        >
          <FaRotateLeft size={16} />
        </button>
        {instance?.hasSentences && previousNextInfo ? (
          <>
            <button
              className={classNames(
                "bg-gray-900 rounded-full size-10 grid place-items-center",
                previousNextInfo.hasNextWord ? "hover:opacity-75" : "opacity-50"
              )}
              onClick={onNextWord}
              disabled={!previousNextInfo.hasNextWord}
            >
              <FaForwardStep size={16} />
            </button>
            <button
              className={classNames(
                "bg-gray-900 rounded-full size-10 grid place-items-center",
                previousNextInfo.hasNextSentence
                  ? "hover:opacity-75"
                  : "opacity-50"
              )}
              onClick={onNextSentence}
              disabled={!previousNextInfo.hasNextSentence}
            >
              <FaForwardFast size={16} />
            </button>
          </>
        ) : null}
        <Popover className="relative">
          <PopoverButton className="bg-gray-900 px-4 relative w-20 rounded-full text-sm inline-flex gap-2 items-center justify-between h-10">
            <FaBoltLightning size={16} />
            <span>{playbackRate}</span>
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
          className="bg-gray-950 hover:opacity-75 rounded-full size-10 grid place-items-center"
          onClick={onClose}
        >
          <FaXmark size={16} />
        </button>
      </div>
    </>
  );
};
export default TTSPlayer;
