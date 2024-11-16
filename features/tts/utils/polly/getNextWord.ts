import { Polly } from '../../interfaces/Polly';
import { PollyMark } from '../../interfaces/PollyMark';
import { currentTimeToPollyMarkTime } from './currentTimeToPollyMarkTime';

export const getNextWord = ({ polly, currentTime }: { polly: Polly; currentTime: number }): PollyMark | undefined => {
  const word = polly.marks.find(
    (mark) => mark.type === 'word' && Number(mark.time) / 1000 > currentTimeToPollyMarkTime(currentTime),
  );
  return word;
};
