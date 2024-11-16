import { ADD_PUNCTUATION_FOR_HTML_ELEMENT_TYPES } from '../const/add-punctuation-for-html-element-types';
import { POLLY_PUNCTUATION } from '../const/polly-punctuation';

export const shouldAddPunctuation = ({
  index,
  words,
  node,
  word,
}: {
  index: number;
  words: string[];
  node: Node | null;
  word: string;
}) => {
  // If this word is the last in the TextNode
  // If this TextNode does not have any siblings after itself
  if (index + 1 === words.length && !node?.nextSibling) {
    let parentElement = node?.parentNode;

    // This ensures that we add punctuation at the end of sentence
    // It goes from parentElement to parentElement and checks if it is a type that is within ADD_PUNCTUATION_FOR_ELEMENT_TYPES
    // It also checks that this TextNode doesn't already end with a sentence ender within DONT_ADD_PUNCTION_FOR_ELEMENT_ENDING_WITH
    while (parentElement) {
      if (POLLY_PUNCTUATION.some((value) => value === word.substring(word.length - 1, word.length))) {
        // This node already ends with punctuation, so no need to check if we need to add punctuatino
        break;
      } else if (
        // This ensures that specific elements will always be counted as a sentence for Polly
        ADD_PUNCTUATION_FOR_HTML_ELEMENT_TYPES.some((value) => value === parentElement?.nodeName.toLowerCase())
      ) {
        return true;
      } else if (parentElement.nextSibling) {
        // Stop looping through parentElement
        break;
      } else {
        // Check next parent element
        parentElement = parentElement.parentElement;
      }
    }
  }

  return false;
};
