/*
 * @lc app=leetcode id=55 lang=typescript
 *
 * [55] Jump Game
 */

canJump([2, 3, 1, 1, 4]); // Output: true

// @lc code=start
/**
 * Note that as long as there is no 0 in the array, we must be able to reach the end.
 * If there is a 0, we need to check if we can jump over it.
 * The whole point is to see if we will end up with 0 steps left;
 * so at each position, we just try to record the maximum steps we can take,
 * and we need to record this info from the first position.
 */
function canJump(nums: number[]): boolean {
  let leftSteps = nums[0];

  for (let i = 1; i < nums.length; i++) {
    if (leftSteps === 0) return false;

    // get the maximum steps we can take from the current position
    // need to minus one for the left steps of the last position
    leftSteps = Math.max(leftSteps - 1, nums[i]);
  }

  return true;
}
// @lc code=end
