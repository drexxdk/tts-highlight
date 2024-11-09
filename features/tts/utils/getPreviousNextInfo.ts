import { PreviousNextInfo } from '../interfaces/PreviousNextInfo';
import { TTSWithHighlight } from '../interfaces/TTSWithHighlight';
import { currentTimeToPollyMarkTime } from './currentTimeToPollyMarkTime';

export const getPreviousNextInfo = ({
  instance,
  currentTime,
}: {
  instance: TTSWithHighlight;
  currentTime: number;
}): PreviousNextInfo => {
  const hasPreviousWord = instance.polly.Marks.some(
    (mark) => mark.type === 'word' && Number(mark.time) < currentTimeToPollyMarkTime(currentTime),
  );

  const hasNextWord = instance.polly.Marks.some(
    (mark) => mark.type === 'word' && Number(mark.time) > currentTimeToPollyMarkTime(currentTime),
  );

  // This button should always be enabled unless player currentTime is at 0
  // It should be available, even in first sentence
  const hasPreviousSentence = instance.polly.Marks.some(
    (mark) => mark.type === 'word' && Number(mark.time) < currentTimeToPollyMarkTime(currentTime),
  );

  const hasNextSentence = instance.polly.Marks.some(
    (mark) => mark.type === 'sentence' && Number(mark.time) > currentTimeToPollyMarkTime(currentTime),
  );

  return {
    hasPreviousWord,
    hasNextWord,
    hasPreviousSentence,
    hasNextSentence,
  };
};
