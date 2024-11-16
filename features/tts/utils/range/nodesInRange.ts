export const nodesInRange = (range: Range) => {
  const start = range.startContainer;
  const end = range.endContainer;
  const commonAncestor = range.commonAncestorContainer;
  const nodes = [];
  let node;

  // walk parent nodes from start to common ancestor
  for (node = start.parentNode; node; node = node.parentNode) {
    nodes.push(node);
    if (node == commonAncestor) break;
  }
  nodes.reverse();

  // walk children and siblings from start until end is found
  for (node = start; node; node = getNextNode(node)) {
    nodes.push(node);
    if (node == end) break;
  }

  return nodes;
};

const getNextNode = (node: Node, skipChildren?: boolean): ChildNode | null => {
  //if there are child nodes and we didn't come from a child node
  if (node.firstChild && !skipChildren) {
    return node.firstChild;
  }
  if (!node.parentNode) {
    return null;
  }
  return node.nextSibling || getNextNode(node.parentNode, true);
};
