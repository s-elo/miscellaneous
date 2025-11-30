/*
 * @lc app=leetcode id=1 lang=typescript
 *
 * [1] Two Sum
 */

twoSum([2, 7, 11, 15], 9);

// @lc code=start
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();

  for (let i = 0; i < nums.length; i++) {
    const val = map.get(nums[i]);
    if (val !== undefined) {
      return [val, i];
    } else {
      map.set(target - nums[i], i);
    }
  }

  return [];
}
// @lc code=end
