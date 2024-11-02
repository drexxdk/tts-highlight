import { TTSSelectionNode } from "./TTSSelectionNode";

export interface TTSSelection {
  nodes: TTSSelectionNode[];
  text: string;
  selection: Selection;
}
