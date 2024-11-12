import { PollyMark } from './PollyMark';

export interface Polly {
  audio: string[];
  marks: PollyMark[];
  hasMultipleWords: boolean;
  hasMultipleSentences: boolean;
}
export interface PollyRequest {
  Audio: string[];
  Marks: PollyMark[];
}
