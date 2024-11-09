import { PollyMark } from "../interfaces/PollyMark";
import { TTSWithHighlight } from "../stores/useTTSWithHighlightStore";

export const getNextWord = ({
  instance,
  currentTime,
}: {
  instance: TTSWithHighlight;
  currentTime: number;
}): PollyMark | undefined => {
  const word = instance.polly.Marks.find(
    (mark) => mark.type === "word" && Number(mark.time) / 1000 > currentTime
  );
  return word;
};
