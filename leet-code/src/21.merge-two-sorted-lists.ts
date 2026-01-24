/*
 * @lc app=leetcode id=21 lang=typescript
 *
 * [21] Merge Two Sorted Lists
 */

mergeTwoLists(
  new ListNode(1, new ListNode(2, new ListNode(4))),
  new ListNode(1, new ListNode(3, new ListNode(4))),
); // [1,1,2,3,4,4]

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

function mergeTwoLists(
  list1: ListNode | null,
  list2: ListNode | null,
): ListNode | null {
  const result = new ListNode(0);

  let p1 = list1;
  let p2 = list2;
  let cur = result;

  while (p1 !== null && p2 !== null) {
    if (p1.val < p2.val) {
      cur.next = p1;
      p1 = p1.next;
    } else {
      cur.next = p2;
      p2 = p2.next;
    }
    cur = cur.next;
  }

  if (p1 !== null) {
    cur.next = p1;
  } else {
    cur.next = p2;
  }

  return result.next;
}
// @lc code=end
