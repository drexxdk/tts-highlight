import { create } from "zustand";
import { Language } from "../interfaces/Language";
import { TTSWithHighlight } from "../interfaces/TTSWithHighlight";

export interface TTSWithHighlightState {
  instance?: TTSWithHighlight;
  selectedLanguage?: Language;
  availableLanguages: Language[];
  setInstance: (polly?: TTSWithHighlight) => void;
  setSelectedLanguage: (language: Language) => void;
  setAvailableLanguages: (languages: Language[]) => void;
}

const LANGUAGES: Language[] = [
  { id: "en", name: "English" },
  { id: "da", name: "Dansk" },
];

export const useTTSWithHighlightStore = create<TTSWithHighlightState>(
  (set) => ({
    instance: undefined,
    selectedLanguage: LANGUAGES[0],
    availableLanguages: LANGUAGES,
    setInstance: (polly?: TTSWithHighlight) =>
      set((state) => ({ ...state, instance: polly })),
    setSelectedLanguage: (language: Language) =>
      set((state) => ({ ...state, selectedLanguage: language })),
    setAvailableLanguages: (languages: Language[]) =>
      set((state) => ({ ...state, availableLanguages: languages })),
  })
);
