export interface TextSelectionWord {
  node: Node;
  text: string;
  startOffset: number;
  endOffset: number;
  punctuationParentElement?: HTMLElement;
}
