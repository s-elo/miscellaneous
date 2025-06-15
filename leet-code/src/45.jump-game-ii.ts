/*
 * @lc app=leetcode id=45 lang=typescript
 *
 * [45] Jump Game II
 */

jump([2, 3, 1, 1, 4]); // Output: 2

// @lc code=start
/**
 * try to jump as far as possible at each step;
 * at each position, compare the previous farthest position
 * with the current position plus the jump length;
 *
 * if current position is the previous farthest end,
 * that means we must be able to get to current position
 * and **all the previous positions**.
 */
function jump(nums: number[]): number {
  let end = 0;
  let farthest = 0;
  let jumps = 0;

  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i]);
    if (i === end) {
      jumps++;
      end = farthest;
    }
  }

  return jumps;
}
// @lc code=end
