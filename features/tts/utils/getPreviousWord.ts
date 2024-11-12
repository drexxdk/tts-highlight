import { Polly } from '../interfaces/Polly';
import { PollyMark } from '../interfaces/PollyMark';
import { currentTimeToPollyMarkTime } from './currentTimeToPollyMarkTime';

export const getPreviousWord = ({
  polly,
  currentTime,
}: {
  polly: Polly;
  currentTime: number;
}): PollyMark | undefined => {
  const word = polly.marks.findLast(
    (mark) => mark.type === 'word' && Number(mark.time) / 1000 < currentTimeToPollyMarkTime(currentTime),
  );
  return word;
};
