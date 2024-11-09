import { PollyMark } from '../interfaces/PollyMark';
import { TTSWithHighlight } from '../interfaces/TTSWithHighlight';

export const getFirstWord = ({ instance }: { instance: TTSWithHighlight }): PollyMark | undefined => {
  const word = instance.polly.Marks.find((mark) => mark.type === 'word');
  return word;
};
