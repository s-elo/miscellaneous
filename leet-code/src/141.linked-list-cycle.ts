/*
 * @lc app=leetcode id=141 lang=typescript
 *
 * [141] Linked List Cycle
 */

class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val?: number, next?: ListNode | null) {
    this.val = val === undefined ? 0 : val;
    this.next = next === undefined ? null : next;
  }
}

hasCycle(new ListNode(3, new ListNode(2, new ListNode(0, new ListNode(-4))))); // false

// @lc code=start
function hasCycle(head: ListNode | null): boolean {
  let slot: ListNode | undefined | null = head;
  let fast: ListNode | undefined | null = head;

  while (fast !== null && fast.next !== null) {
    slot = slot?.next;
    fast = fast.next.next;

    if (slot === fast) {
      return true;
    }
  }

  return false;
}
// @lc code=end
