import { PollyMark } from "../interfaces/PollyMark";
import { TTSWithHighlight } from "../stores/useTTSWithHighlightStore";

export const getPreviousWord = ({
  instance,
  currentTime,
}: {
  instance: TTSWithHighlight;
  currentTime: number;
}): PollyMark | undefined => {
  const word = instance.polly.Marks.findLast(
    (mark) => mark.type === "word" && Number(mark.time) / 1000 < currentTime
  );
  return word;
};
