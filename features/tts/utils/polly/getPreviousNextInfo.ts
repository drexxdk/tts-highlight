import { Polly } from '../../interfaces/Polly';
import { PreviousNextInfo } from '../../interfaces/PreviousNextInfo';
import { currentTimeToPollyMarkTime } from './currentTimeToPollyMarkTime';

export const getPreviousNextInfo = ({
  polly,
  currentTime,
}: {
  polly: Polly;
  currentTime: number;
}): PreviousNextInfo => {
  const hasPreviousWord = polly.marks.some(
    (mark) => mark.type === 'word' && Number(mark.time) < currentTimeToPollyMarkTime(currentTime),
  );

  const hasNextWord = polly.marks.some(
    (mark) => mark.type === 'word' && Number(mark.time) > currentTimeToPollyMarkTime(currentTime),
  );

  // This button should always be enabled unless player currentTime is at 0
  // It should be available, even in first sentence
  const hasPreviousSentence = polly.marks.some(
    (mark) => mark.type === 'word' && Number(mark.time) < currentTimeToPollyMarkTime(currentTime),
  );

  const hasNextSentence = polly.marks.some(
    (mark) => mark.type === 'sentence' && Number(mark.time) > currentTimeToPollyMarkTime(currentTime),
  );

  return {
    hasPreviousWord,
    hasNextWord,
    hasPreviousSentence,
    hasNextSentence,
  };
};
