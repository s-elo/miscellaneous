/*
 * @lc app=leetcode id=25 lang=typescript
 *
 * [25] Reverse Nodes in k-Group
 */

reverseKGroup(
  new ListNode(
    1,
    new ListNode(2, new ListNode(3, new ListNode(4, new ListNode(5)))),
  ),
  2,
);

// @lc code=start
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function reverseKGroup(head: ListNode | null, k: number): ListNode | null {
  if (head === null) null;

  let p = head;
  let count = 0;
  while (p) {
    count++;
    p = p.next;
  }
  const groupCount = Math.floor(count / k);

  const dummy = new ListNode(0, head);
  let pre: ListNode | null = dummy;

  for (let i = 0; i < groupCount; i++) {
    let cur = pre?.next ?? null;
    let next = cur?.next ?? null;

    for (let j = 0; j < k - 1; j++) {
      if (next) {
        const nn = next.next;
        next.next = cur;
        cur = next;
        next = nn;
      }
    }

    if (pre?.next) {
      // the start node now should be the last node, connect to the start node of the next k group
      const originalStart = pre.next;
      originalStart.next = next;

      // connect the pre to the original last node(now is the start)
      pre.next = cur;
      // update the pre as the current last node
      pre = originalStart;
    }
  }

  return dummy.next;
}
// @lc code=end
