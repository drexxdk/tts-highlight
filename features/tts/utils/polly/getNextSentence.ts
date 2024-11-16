import { Polly } from '../../interfaces/Polly';
import { PollyMark } from '../../interfaces/PollyMark';
import { currentTimeToPollyMarkTime } from './currentTimeToPollyMarkTime';

export const getNextSentence = ({
  polly,
  currentTime,
}: {
  polly: Polly;
  currentTime: number;
}): PollyMark | undefined => {
  const sentenceIndex = polly.marks.findIndex(
    (mark) => mark.type === 'sentence' && Number(mark.time) / 1000 > currentTimeToPollyMarkTime(currentTime),
  );
  if (!sentenceIndex || polly.marks.length <= sentenceIndex) {
    return;
  }
  const word = polly.marks[sentenceIndex + 1];
  return word;
};
