import { PollyMark } from "../interfaces/PollyMark";
import { TTSWithHighlight } from "../stores/useTTSWithHighlightStore";

export const getNextSentence = ({
  instance,
  currentTime,
}: {
  instance: TTSWithHighlight;
  currentTime: number;
}): PollyMark | undefined => {
  const sentenceIndex = instance.polly.Marks.findIndex(
    (mark) => mark.type === "sentence" && Number(mark.time) / 1000 > currentTime
  );
  if (!sentenceIndex || instance.polly.Marks.length <= sentenceIndex) {
    return;
  }
  const word = instance.polly.Marks[sentenceIndex + 1];
  return word;
};