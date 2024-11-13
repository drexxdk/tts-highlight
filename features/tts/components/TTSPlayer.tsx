'use client';

import { useSelection } from '@/features/tts/hooks/useSelection';
import { useTTSWithHighlightStore } from '@/features/tts/stores/useTTSWithHighlightStore';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Popover,
  PopoverBackdrop,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';
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
} from 'react-icons/fa6';
import { useLoadPolly } from '../hooks/useLoadPolly';
import { Language } from '../interfaces/Language';
import { LanguageCode } from '../interfaces/LanguageCode';
import { PreviousNextInfo } from '../interfaces/PreviousNextInfo';
import DAFlagIcon from '../svg/flags/da-flag-icon';
import ENFlagIcon from '../svg/flags/en-flag-icon';
import { getFirstWord } from '../utils/getFirstWord';
import { getNextSentence } from '../utils/getNextSentence';
import { getNextWord } from '../utils/getNextWord';
import { getPreviousNextInfo } from '../utils/getPreviousNextInfo';
import { getPreviousSentence } from '../utils/getPreviousSentence';
import { getPreviousWord } from '../utils/getPreviousWord';
import { highlightWord } from '../utils/highlightWord';

type AudioStatus = 'loading' | 'ready' | 'playing' | 'paused';

const LanguageIcon = ({ code, className }: { code: LanguageCode; className?: string }) => {
  switch (code) {
    case 'en': {
      return <ENFlagIcon className={className} />;
    }
    case 'da':
      return <DAFlagIcon className={className} />;
    default:
      const _exhaustiveCheck: never = code;
      return _exhaustiveCheck;
  }
};

const TTSPlayer = () => {
  const textSelection = useTTSWithHighlightStore((state) => state.textSelection);
  const setTextSelection = useTTSWithHighlightStore((state) => state.setTextSelection);
  const polly = useTTSWithHighlightStore((state) => state.polly);
  const setInstance = useTTSWithHighlightStore((state) => state.setPolly);
  const selectedLanguage = useTTSWithHighlightStore((state) => state.selectedLanguage);
  const setSelectedLanguage = useTTSWithHighlightStore((state) => state.setSelectedLanguage);
  const availableLanguages = useTTSWithHighlightStore((state) => state.availableLanguages);
  const setPlayRequested = useTTSWithHighlightStore((state) => state.setPlayRequested);
  const audio = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<AudioStatus>();
  const [previousNextInfo, setPreviousNextInfo] = useState<PreviousNextInfo>();
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  useSelection();
  useLoadPolly();

  const prepare = useCallback(
    (audio: HTMLAudioElement) => {
      if (!polly || !textSelection) {
        return;
      }

      const currentTime = Math.round((audio.currentTime || 0) * 1000);
      setPreviousNextInfo(getPreviousNextInfo({ polly: polly, currentTime }));
      highlightWord({ currentTime, polly: polly, textSelection });
    },
    [polly, textSelection],
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (audio.current && status === 'playing') {
      if (audio.current.paused) {
        audio.current.play();
      }
      interval = setInterval(() => {
        if (audio.current) {
          prepare(audio.current);
        }
      }, 50);
    }
    return () => clearInterval(interval);
  }, [audio, prepare, status]);

  useEffect(() => {
    if (!audio.current) {
      return;
    }
    audio.current.playbackRate = playbackRate;
  }, [playbackRate]);

  const onLoadedData = () => {
    if (!polly || !audio.current) {
      return;
    }
    audio.current.playbackRate = playbackRate;
    const mark = getFirstWord({ polly: polly });
    if (mark) {
      audio.current.currentTime = Number(mark.time) / 1000;
      prepare(audio.current);
      setStatus('playing');
    }
  };

  const onEnded = () => {
    if (!audio.current) {
      return;
    }
    setStatus('ready');
  };

  const onPlay = () => {
    if (!audio.current) {
      return;
    }
    if (polly) {
      setStatus('playing');
    } else {
      setPlayRequested(true);
      setStatus('loading');
    }
  };

  const onPause = () => {
    if (!audio.current) {
      return;
    }
    audio.current.pause();
    setStatus('paused');
  };

  const onReset = () => {
    if (!audio.current) {
      return;
    }
    audio.current.pause();
    audio.current.currentTime = 0;
    prepare(audio.current);
    setStatus('ready');
  };

  const onClose = () => {
    if (!audio.current) {
      return;
    }
    audio.current.pause();
    setTextSelection(undefined);
    setInstance(undefined);
    setPreviousNextInfo(undefined);
    setPlayRequested(false);
    setStatus(undefined);

    const selection = window.getSelection();
    if (selection) {
      selection.empty();
    }
    if ('Highlight' in window) {
      CSS.highlights.clear();
    }
  };

  const onPreviousWord = () => {
    if (!polly || !audio.current) {
      return;
    }
    const mark = getPreviousWord({
      polly,
      currentTime: audio.current.currentTime,
    });
    if (mark) {
      audio.current.currentTime = Number(mark.time) / 1000;
      prepare(audio.current);
    }
  };

  const onNextWord = () => {
    if (!polly || !audio.current) {
      return;
    }
    const mark = getNextWord({
      polly,
      currentTime: audio.current.currentTime,
    });
    if (mark) {
      audio.current.currentTime = Number(mark.time) / 1000;
      prepare(audio.current);
    }
  };

  const onPreviousSentence = () => {
    if (!polly || !audio.current) {
      return;
    }
    const mark = getPreviousSentence({
      polly,
      currentTime: audio.current.currentTime,
    });
    if (mark) {
      audio.current.currentTime = Number(mark.time) / 1000;
      prepare(audio.current);
    }
  };

  const onNextSentence = () => {
    if (!polly || !audio.current) {
      return;
    }
    const mark = getNextSentence({
      polly,
      currentTime: audio.current.currentTime,
    });
    if (mark) {
      audio.current.currentTime = Number(mark.time) / 1000;
      prepare(audio.current);
    }
  };

  const onLanguageSelect = (language: Language) => {
    onClose();
    setSelectedLanguage(language);
  };

  return selectedLanguage ? (
    <div className="ml-auto flex flex-wrap items-center justify-center gap-2">
      <audio ref={audio} src={polly?.audio[0]} onLoadedData={onLoadedData} onEnded={onEnded} />
      <div
        className={classNames(
          'flex flex-wrap items-center justify-center gap-1 rounded-3xl bg-gray-800 p-1',
          {
            'opacity-50': status === 'loading',
          },
          { hidden: !textSelection },
        )}
      >
        {polly?.hasMultipleSentences && previousNextInfo ? (
          <button
            className={classNames(
              'grid size-10 place-items-center rounded-full bg-gray-900',
              previousNextInfo.hasPreviousSentence ? 'hover:bg-gray-700' : 'opacity-50',
            )}
            onClick={onPreviousSentence}
            disabled={!previousNextInfo.hasPreviousSentence}
          >
            <FaBackwardFast size={16} />
          </button>
        ) : null}
        {polly?.hasMultipleWords && previousNextInfo ? (
          <button
            className={classNames(
              'grid size-10 place-items-center rounded-full bg-gray-900',
              previousNextInfo.hasPreviousWord ? 'hover:bg-gray-700' : 'opacity-50',
            )}
            onClick={onPreviousWord}
            disabled={!previousNextInfo.hasPreviousWord}
          >
            <FaBackwardStep size={16} />
          </button>
        ) : null}

        <button
          className={classNames(
            'grid size-10 place-items-center rounded-full bg-gray-200 text-gray-950',
            status !== 'playing' ? 'hover:opacity-75' : 'hidden',
          )}
          onClick={onPlay}
        >
          <FaPlay size={24} />
        </button>
        <button
          className={classNames(
            'grid size-10 place-items-center rounded-full bg-gray-200 text-gray-950',
            status === 'playing' ? 'hover:opacity-75' : 'hidden',
          )}
          onClick={onPause}
          disabled={status !== 'playing'}
        >
          <FaPause size={24} />
        </button>
        {polly?.hasMultipleWords && previousNextInfo ? (
          <button
            className={classNames(
              'grid size-10 place-items-center rounded-full bg-gray-900',
              previousNextInfo.hasNextWord ? 'hover:opacity-75' : 'opacity-50',
            )}
            onClick={onNextWord}
            disabled={!previousNextInfo.hasNextWord}
          >
            <FaForwardStep size={16} />
          </button>
        ) : null}
        {polly?.hasMultipleSentences && previousNextInfo ? (
          <button
            className={classNames(
              'grid size-10 place-items-center rounded-full bg-gray-900',
              previousNextInfo.hasNextSentence ? 'hover:opacity-75' : 'opacity-50',
            )}
            onClick={onNextSentence}
            disabled={!previousNextInfo.hasNextSentence}
          >
            <FaForwardFast size={16} />
          </button>
        ) : null}
        {polly?.hasMultipleWords && previousNextInfo ? (
          <button
            className={classNames(
              'grid size-10 place-items-center rounded-full bg-gray-900',
              previousNextInfo.hasPreviousWord ? 'hover:opacity-75' : 'opacity-50',
            )}
            onClick={onReset}
            disabled={!previousNextInfo.hasPreviousWord}
          >
            <FaRotateLeft size={16} />
          </button>
        ) : null}
        <button className="grid size-10 place-items-center rounded-full bg-gray-950 hover:opacity-75" onClick={onClose}>
          <FaXmark size={16} />
        </button>
      </div>
      <Popover className="relative">
        <PopoverButton className="relative inline-flex h-10 w-20 items-center justify-between gap-2 rounded-full bg-gray-900 px-4 text-sm hover:opacity-75">
          <FaBoltLightning size={16} />
          <span className="whitespace-nowrap">{playbackRate}</span>
        </PopoverButton>
        <PopoverBackdrop className="fixed inset-0 z-10 bg-black/15" />
        <PopoverPanel
          anchor={{
            gap: 16,
            offset: 0,
            padding: 16,
            to: 'bottom',
          }}
          className="z-10 flex flex-col rounded bg-gray-950 px-6 py-4"
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
      <Listbox value={selectedLanguage} onChange={onLanguageSelect}>
        <ListboxButton
          aria-label={selectedLanguage.name}
          className="grid size-10 place-items-center gap-2 rounded-full bg-gray-900 hover:opacity-75"
        >
          <LanguageIcon code={selectedLanguage.id} className="size-6" />
        </ListboxButton>
        <ListboxOptions
          anchor={{
            gap: 16,
            offset: 0,
            padding: 16,
            to: 'bottom',
          }}
          className={classNames(
            'z-10 flex flex-col rounded bg-gray-950 p-2',
            'before:pointer-events-none before:fixed before:inset-0 before:z-10 before:bg-black/15',
          )}
        >
          {availableLanguages.map((availableLanguage) => (
            <ListboxOption
              as="button"
              key={availableLanguage.id}
              value={availableLanguage}
              className={classNames(
                'flex items-center gap-2 px-4 py-2 data-[focus]:bg-gray-600 data-[selected]:bg-gray-700',
              )}
            >
              <LanguageIcon code={availableLanguage.id} className="size-4" />
              <span>{availableLanguage.name}</span>
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Listbox>
    </div>
  ) : null;
};
export default TTSPlayer;
