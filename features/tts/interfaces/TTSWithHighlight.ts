import { Polly } from "./Polly";
import { TTSSelection } from "./TTSSelection";

export interface TTSWithHighlight {
  selection: TTSSelection;
  polly: Polly;
  hasMultipleWords: boolean;
  hasMultipleSentences: boolean;
}
