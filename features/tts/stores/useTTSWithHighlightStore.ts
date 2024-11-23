import { create } from 'zustand';
import { POLLY_SUPPORTED_DANISH_CHARS } from '../const/polly-supported-danish-chars';
import { POLLY_SUPPORTED_ENGLISH_CHARS } from '../const/polly-supported-english-chars';
import { Language } from '../interfaces/Language';
import { Polly } from '../interfaces/Polly';
import { TextSelection } from '../interfaces/TextSelection';

export interface TTSWithHighlightState {
  textSelection?: TextSelection;
  polly?: Polly;
  selectedLanguage?: Language;
  availableLanguages: Language[];
  playRequested: boolean;
  setTextSelection: (textSelection?: TextSelection) => void;
  setPolly: (polly?: Polly) => void;
  setSelectedLanguage: (language: Language) => void;
  setAvailableLanguages: (languages: Language[]) => void;
  setPlayRequested: (playRequested: boolean) => void;
}

const LANGUAGES: Language[] = [
  {
    id: 'en',
    name: 'English',
    supported: POLLY_SUPPORTED_ENGLISH_CHARS,
    definitions: [
      {
        char: '\\',
        name: 'backslash',
      },
      {
        char: '/',
        name: 'slash',
      },
      {
        char: '&',
        name: 'and',
      },
    ],
  },
  {
    id: 'da',
    name: 'Dansk',
    supported: POLLY_SUPPORTED_DANISH_CHARS,
    definitions: [
      {
        char: '\\',
        name: 'bagudstreg',
      },
      {
        char: '/',
        name: 'skråstreg',
      },
      {
        char: '&',
        name: 'og',
      },
    ],
  },
];

export const useTTSWithHighlightStore = create<TTSWithHighlightState>((set) => ({
  textSelection: undefined,
  polly: undefined,
  selectedLanguage: LANGUAGES[0],
  availableLanguages: LANGUAGES,
  playRequested: false,
  setTextSelection: (textSelection?: TextSelection) => set((state) => ({ ...state, textSelection, polly: undefined })),
  setPolly: (polly?: Polly) => set((state) => ({ ...state, polly })),
  setSelectedLanguage: (selectedLanguage: Language) => set((state) => ({ ...state, selectedLanguage })),
  setAvailableLanguages: (availableLanguages: Language[]) => set((state) => ({ ...state, availableLanguages })),
  setPlayRequested: (playRequested: boolean) => set((state) => ({ ...state, playRequested })),
}));
