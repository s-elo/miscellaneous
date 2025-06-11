/*
 * @lc app=leetcode id=80 lang=typescript
 *
 * [80] Remove Duplicates from Sorted Array II
 */

removeDuplicates([0, 0, 1, 1, 1, 1, 2, 3, 3]);

// @lc code=start
function removeDuplicates(nums: number[]): number {
  let k = 1;
  let count = 0;

  for (let i = 1; i < nums.length; i++) {
    if (nums[i] === nums[i - 1]) {
      count++;
      if (count < 2) {
        nums[k++] = nums[i];
      }
    } else {
      count = 0;
      nums[k++] = nums[i];
    }
  }

  return k;
}
// @lc code=end
