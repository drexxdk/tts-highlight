import { PollyMark } from '../interfaces/PollyMark';
import { TTSWithHighlight } from '../interfaces/TTSWithHighlight';
import { currentTimeToPollyMarkTime } from './currentTimeToPollyMarkTime';

export const getNextWord = ({
  instance,
  currentTime,
}: {
  instance: TTSWithHighlight;
  currentTime: number;
}): PollyMark | undefined => {
  const word = instance.polly.Marks.find(
    (mark) => mark.type === 'word' && Number(mark.time) / 1000 > currentTimeToPollyMarkTime(currentTime),
  );
  return word;
};
