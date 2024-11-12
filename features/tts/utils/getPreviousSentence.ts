import { Polly } from '../interfaces/Polly';
import { PollyMark } from '../interfaces/PollyMark';
import { currentTimeToPollyMarkTime } from './currentTimeToPollyMarkTime';

export const getPreviousSentence = ({
  polly,
  currentTime,
}: {
  polly: Polly;
  currentTime: number;
}): PollyMark | undefined => {
  const sentences = polly.marks.filter(
    (mark) => mark.type === 'sentence' && Number(mark.time) / 1000 < currentTimeToPollyMarkTime(currentTime),
  );
  if (!sentences.length) {
    return;
  }
  const sentenceIndex = polly.marks.findIndex(
    (sentence) => sentence === sentences[sentences.length - (sentences.length > 1 ? 2 : 1)],
  );
  const word = polly.marks[sentenceIndex + 1];
  return word;
};
