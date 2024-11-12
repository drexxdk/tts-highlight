import { create } from 'zustand';
import { POLLY_SUPPORTED_DANISH_CHARS } from '../const/polly-supported-danish-chars';
import { POLLY_SUPPORTED_ENGLISH_CHARS } from '../const/polly-supported-english-chars';
import { Language } from '../interfaces/Language';
import { TTSWithHighlight } from '../interfaces/TTSWithHighlight';

export interface TTSWithHighlightState {
  instance?: TTSWithHighlight;
  selectedLanguage?: Language;
  availableLanguages: Language[];
  setInstance: (polly?: TTSWithHighlight) => void;
  setSelectedLanguage: (language: Language) => void;
  setAvailableLanguages: (languages: Language[]) => void;
}

const LANGUAGES: Language[] = [
  { id: 'en', name: 'English', chars: POLLY_SUPPORTED_ENGLISH_CHARS },
  { id: 'da', name: 'Dansk', chars: POLLY_SUPPORTED_DANISH_CHARS },
];

export const useTTSWithHighlightStore = create<TTSWithHighlightState>((set) => ({
  instance: undefined,
  selectedLanguage: LANGUAGES[0],
  availableLanguages: LANGUAGES,
  setInstance: (polly?: TTSWithHighlight) => set((state) => ({ ...state, instance: polly })),
  setSelectedLanguage: (language: Language) => set((state) => ({ ...state, selectedLanguage: language })),
  setAvailableLanguages: (languages: Language[]) => set((state) => ({ ...state, availableLanguages: languages })),
}));
