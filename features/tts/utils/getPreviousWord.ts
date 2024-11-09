import { PollyMark } from "../interfaces/PollyMark";
import { TTSWithHighlight } from "../interfaces/TTSWithHighlight";
import { currentTimeToPollyMarkTime } from "./currentTimeToPollyMarkTime";

export const getPreviousWord = ({
  instance,
  currentTime,
}: {
  instance: TTSWithHighlight;
  currentTime: number;
}): PollyMark | undefined => {
  const word = instance.polly.Marks.findLast(
    (mark) =>
      mark.type === "word" &&
      Number(mark.time) / 1000 < currentTimeToPollyMarkTime(currentTime)
  );
  return word;
};
