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
  setTextSelection: (textSelection?: TextSelection) => void;
  setPolly: (polly?: Polly) => void;
  setSelectedLanguage: (language: Language) => void;
  setAvailableLanguages: (languages: Language[]) => void;
}

const LANGUAGES: Language[] = [
  { id: 'en', name: 'English', chars: POLLY_SUPPORTED_ENGLISH_CHARS },
  { id: 'da', name: 'Dansk', chars: POLLY_SUPPORTED_DANISH_CHARS },
];

export const useTTSWithHighlightStore = create<TTSWithHighlightState>((set) => ({
  textSelection: undefined,
  polly: undefined,
  selectedLanguage: LANGUAGES[0],
  availableLanguages: LANGUAGES,
  setTextSelection: (textSelection?: TextSelection) => set((state) => ({ ...state, textSelection })),
  setPolly: (polly?: Polly) => set((state) => ({ ...state, polly })),
  setSelectedLanguage: (selectedLanguage: Language) => set((state) => ({ ...state, selectedLanguage })),
  setAvailableLanguages: (availableLanguages: Language[]) => set((state) => ({ ...state, availableLanguages })),
}));
