/*
 * @lc app=leetcode id=138 lang=typescript
 *
 * [138] Copy List with Random Pointer
 */

// Definition for _Node.
class _Node {
  val: number;
  next: _Node | null;
  random: _Node | null;

  constructor(val?: number, next?: _Node, random?: _Node) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
    this.random = random === undefined ? null : random;
  }
}

// @lc code=start
function copyRandomList(head: _Node | null): _Node | null {
  if (!head) return null;

  // original node <-> copied node
  const map = new Map<_Node, _Node>();

  const result = new _Node(0);
  let curOriginal: _Node | null = head;
  let curCopy: _Node | null = result;

  while (curOriginal) {
    const newNode = map.get(curOriginal) || new _Node(curOriginal.val);
    curCopy.next = newNode;
    if (!map.has(curOriginal)) {
      map.set(curOriginal, newNode);
    }

    if (curOriginal.random) {
      const newRanDomNode =
        map.get(curOriginal.random) || new _Node(curOriginal.random.val);
      if (!map.has(curOriginal.random)) {
        map.set(curOriginal.random, newRanDomNode);
      }
      newNode.random = newRanDomNode;
    }

    curOriginal = curOriginal.next;
    curCopy = curCopy.next;
  }

  return result.next;
}
// @lc code=end
