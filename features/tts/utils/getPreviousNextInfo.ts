import { PreviousNextInfo } from "../interfaces/PreviousNextInfo";
import { TTSWithHighlight } from "../stores/useTTSWithHighlightStore";

export const getPreviousNextInfo = ({
  instance,
  currentTime,
}: {
  instance: TTSWithHighlight;
  currentTime: number;
}): PreviousNextInfo => {
  const hasPreviousWord = instance.polly.Marks.some(
    (mark) => mark.type === "word" && Number(mark.time) < currentTime
  );

  const hasNextWord = instance.polly.Marks.some(
    (mark) => mark.type === "word" && Number(mark.time) > currentTime
  );

  // This button should always be enabled unless player currentTime is at 0
  // It should be available, even in first sentence
  const hasPreviousSentence = instance.polly.Marks.some(
    (mark) => mark.type === "word" && Number(mark.time) < currentTime
  );

  const hasNextSentence = instance.polly.Marks.some(
    (mark) => mark.type === "sentence" && Number(mark.time) > currentTime
  );

  return {
    hasPreviousWord,
    hasNextWord,
    hasPreviousSentence,
    hasNextSentence,
  };
};
