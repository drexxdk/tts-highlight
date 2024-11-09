import { TTSWithHighlight } from "../interfaces/TTSWithHighlight";
import { currentTimeToPollyMarkTime } from "./currentTimeToPollyMarkTime";

export const highlightWord = ({
  currentTime,
  store,
}: {
  currentTime: number;
  store: TTSWithHighlight;
}) => {
  if (!("Highlight" in window)) {
    return;
  }
  const words = store.polly.Marks.filter((mark) => mark.type === "word");
  if (!words.length) {
    return;
  }

  const marks = words.filter(
    (mark) => Number(mark.time) <= currentTimeToPollyMarkTime(currentTime)
  );
  const mark = marks.length ? marks[marks.length - 1] : words[0];
  const index = words.findIndex((item) => item === mark);
  const word = store.selection.words[index];
  const range = document.createRange();
  range.setStart(word.node, word.startOffset);
  range.setEnd(word.node, word.endOffset);
  const highlight = new Highlight(range);
  CSS.highlights.set("word", highlight);
};
