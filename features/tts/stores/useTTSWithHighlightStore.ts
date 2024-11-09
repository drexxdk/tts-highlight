import { create } from "zustand";
import { Polly } from "../interfaces/Polly";
import { TTSSelection } from "../interfaces/TTSSelection";

export interface TTSWithHighlight {
  selection: TTSSelection;
  polly: Polly;
  hasMultipleWords: boolean;
  hasMultipleSentences: boolean;
}

export interface TTSWithHighlightState {
  instance?: TTSWithHighlight;
  setInstance: (polly?: TTSWithHighlight) => void;
}

export const useTTSWithHighlightStore = create<TTSWithHighlightState>(
  (set) => ({
    instance: undefined,
    setInstance: (polly?: TTSWithHighlight) =>
      set((state) => ({ ...state, instance: polly })),
  })
);
