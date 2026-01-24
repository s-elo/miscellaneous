/*
 * @lc app=leetcode id=92 lang=typescript
 *
 * [92] Reverse Linked List II
 */

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

function reverseBetween(
  head: ListNode | null,
  left: number,
  right: number,
): ListNode | null {
  if (head === null) null;

  const dummy = new ListNode(0, head);
  let pre: ListNode | null = dummy;

  for (let i = 1; i < left; i++) {
    pre = pre?.next ?? null;
  }

  // now pre is the node before left
  let cur: ListNode | null = pre?.next ?? null;
  let n = cur?.next ?? null;

  // reverse from left to right
  for (let i = 0; i < right - left; i++) {
    if (n) {
      const nn = n?.next ?? null;
      n.next = cur;
      cur = n;
      n = nn;
    }
  }

  // point the next of the reversed left start node to next(traverse) node(can be null)
  if (pre?.next) {
    pre.next.next = n;
  }
  // point the next of pre node(the node before left) to the new start node(reversed)
  if (cur && pre) {
    pre.next = cur;
  }

  return dummy.next;
}
// @lc code=end
