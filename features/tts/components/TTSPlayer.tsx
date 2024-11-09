'use client';

import { useTTSWithHighlight } from '@/features/tts/hooks/useTTSWithHighlight';
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

type AudioStatus = 'loading' | 'ready' | 'playing' | 'paused' | 'ended';

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
  const instance = useTTSWithHighlightStore((state) => state.instance);
  const setInstance = useTTSWithHighlightStore((state) => state.setInstance);
  const selectedLanguage = useTTSWithHighlightStore((state) => state.selectedLanguage);
  const setSelectedLanguage = useTTSWithHighlightStore((state) => state.setSelectedLanguage);
  const availableLanguages = useTTSWithHighlightStore((state) => state.availableLanguages);
  const audio = useRef<HTMLAudioElement>(null);
  const [status, setStatus] = useState<AudioStatus>();
  const [previousNextInfo, setPreviousNextInfo] = useState<PreviousNextInfo>();
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  useTTSWithHighlight();

  const prepare = useCallback(
    (audio: HTMLAudioElement) => {
      if (!instance) {
        return;
      }

      const currentTime = Math.round((audio.currentTime || 0) * 1000);
      setPreviousNextInfo(getPreviousNextInfo({ instance: instance, currentTime }));
      highlightWord({ currentTime, store: instance });
    },
    [instance],
  );

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === 'playing') {
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
    if (!instance || !audio.current) {
      return;
    }
    audio.current.playbackRate = playbackRate;
    const mark = getFirstWord({ instance });
    if (mark) {
      audio.current.currentTime = Number(mark.time) / 1000;
      setStatus('ready');
      prepare(audio.current);
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
    audio.current.play();
    setStatus('playing');
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
    setStatus('ready');
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
    if ('Highlight' in window) {
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

  const onLanguageSelect = (language: Language) => {
    if (!audio.current) {
      return;
    }
    audio.current.pause();
    setStatus('loading');
    setSelectedLanguage(language);
  };

  return selectedLanguage ? (
    <>
      <audio
        ref={audio}
        src={instance?.polly.Audio[0]}
        onLoadStart={() => setStatus('loading')}
        onLoadedData={onLoadedData}
        onEnded={onEnded}
      />
      <div
        className={classNames(
          'ml-auto flex flex-wrap items-center justify-center gap-1 rounded-3xl bg-gray-800 p-1',
          {
            'opacity-50': status === 'loading',
          },
          { hidden: !status },
        )}
      >
        {instance?.hasMultipleSentences && previousNextInfo ? (
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
        {instance?.hasMultipleWords && previousNextInfo ? (
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
            status === 'ready' || status === 'paused' ? 'hover:opacity-75' : 'hidden',
          )}
          onClick={onPlay}
          disabled={status !== 'ready' && status !== 'paused'}
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
        <button
          className={classNames(
            'grid size-10 place-items-center rounded-full bg-gray-900',
            status === 'playing' || status === 'paused' ? 'hover:opacity-75' : 'opacity-50',
          )}
          onClick={onReset}
          disabled={status !== 'playing' && status !== 'paused'}
        >
          <FaRotateLeft size={16} />
        </button>
        {instance?.hasMultipleWords && previousNextInfo ? (
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
        {instance?.hasMultipleSentences && previousNextInfo ? (
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
        <Popover className="relative">
          <PopoverButton className="relative inline-flex h-10 w-20 items-center justify-between gap-2 rounded-full bg-gray-900 px-4 text-sm hover:opacity-75">
            <FaBoltLightning size={16} />
            <span>{playbackRate}</span>
          </PopoverButton>
          <PopoverBackdrop className="fixed inset-0 bg-black/15" />
          <PopoverPanel
            anchor={{
              gap: 16,
              offset: 0,
              padding: 16,
              to: 'bottom',
            }}
            className="flex flex-col rounded bg-gray-950 px-6 py-4"
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
            className="flex flex-col rounded bg-gray-950 p-2"
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
        <button className="grid size-10 place-items-center rounded-full bg-gray-950 hover:opacity-75" onClick={onClose}>
          <FaXmark size={16} />
        </button>
      </div>
    </>
  ) : null;
};
export default TTSPlayer;
