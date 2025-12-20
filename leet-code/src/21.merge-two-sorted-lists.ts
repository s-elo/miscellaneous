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

  return result.next;
}
// @lc code=end
