/*
 * @lc app=leetcode id=2 lang=typescript
 *
 * [2] Add Two Numbers
 */

// class ListNode {
//   val: number;
//   next: ListNode | null;
//   constructor(val?: number, next?: ListNode | null) {
//     this.val = val === undefined ? 0 : val;
//     this.next = next === undefined ? null : next;
//   }
// }

addTwoNumbers(
  new ListNode(2, new ListNode(4, new ListNode(3))),
  new ListNode(5, new ListNode(6, new ListNode(4))),
); // [7,0,8]

// @lc code=start
function addTwoNumbers(
  l1: ListNode | null,
  l2: ListNode | null,
): ListNode | null {
  const result = new ListNode(0);
  let current = result;
  let overflow = 0;
  let p1 = l1;
  let p2 = l2;

  while (p1 !== null || p2 !== null) {
    const val1 = p1?.val ?? 0;
    const val2 = p2?.val ?? 0;
    const sum = val1 + val2 + overflow;

    overflow = Math.floor(sum / 10);
    current.next = new ListNode(sum % 10);
    current = current.next;

    p1 = p1?.next ?? null;
    p2 = p2?.next ?? null;
  }

  if (overflow > 0) {
    current.next = new ListNode(overflow);
  }

  return result.next;
}
// @lc code=end
