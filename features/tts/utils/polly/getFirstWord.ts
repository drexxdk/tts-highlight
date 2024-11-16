import { Polly } from '../../interfaces/Polly';
import { PollyMark } from '../../interfaces/PollyMark';

export const getFirstWord = ({ polly }: { polly: Polly }): PollyMark | undefined => {
  const word = polly.marks.find((mark) => mark.type === 'word');
  return word;
};
