import { PollyMark } from "../interfaces/PollyMark";
import { TTSWithHighlight } from "../stores/useTTSWithHighlightStore";

export const getPreviousSentence = ({
  instance,
  currentTime,
}: {
  instance: TTSWithHighlight;
  currentTime: number;
}): PollyMark | undefined => {
  const sentences = instance.polly.Marks.filter(
    (mark) => mark.type === "sentence" && Number(mark.time) / 1000 < currentTime
  );
  if (!sentences.length) {
    return;
  }
  const sentenceIndex = instance.polly.Marks.findIndex(
    (sentence) =>
      sentence === sentences[sentences.length - (sentences.length > 1 ? 2 : 1)]
  );
  const word = instance.polly.Marks[sentenceIndex + 1];
  return word;
};
