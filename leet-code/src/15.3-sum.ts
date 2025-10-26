/*
 * @lc app=leetcode id=15 lang=typescript
 *
 * [15] 3Sum
 */

threeSum([-1, 0, 1, 2, -1, -4]);

// -4, -1, -1, 0, 1, 2;

// @lc code=start
function threeSum(nums: number[]): number[][] {
  nums.sort((a, b) => a - b);
  const result: number[][] = [];

  for (let i = 0; i < nums.length - 2; i++) {
    // skip duplicates sets
    if (i > 0 && nums[i] === nums[i - 1]) continue;

    let left = i + 1;
    let right = nums.length - 1;
    const target = nums[i];

    while (left < right) {
      const sum = nums[left] + nums[right] + target;
      if (sum === 0) {
        result.push([nums[left], target, nums[right]]);

        // skip duplicates sets
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;

        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }

  return result;
}
// @lc code=end
