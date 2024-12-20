import { Polly } from '../../interfaces/Polly';
import { TextSelection } from '../../interfaces/TextSelection';
import { currentTimeToPollyMarkTime } from '../polly/currentTimeToPollyMarkTime';
import { highlightSupport } from './highlight-browser-support';
import { highlightSelectedWord } from './highlightSelectedWord';

export const highlightWord = ({
  currentTime,
  polly,
  textSelection,
}: {
  currentTime: number;
  polly: Polly;
  textSelection: TextSelection;
}) => {
  if (!highlightSupport()) {
    return;
  }
  const words = polly.marks.filter((mark) => mark.type === 'word');
  if (!words.length) {
    return;
  }

  const marks = words.filter((mark) => Number(mark.time) <= currentTimeToPollyMarkTime(currentTime));
  const mark = marks.length ? marks[marks.length - 1] : words[0];
  const index = words.findIndex((item) => item === mark);
  const word = textSelection.words[index];

  highlightSelectedWord({ word });
};
