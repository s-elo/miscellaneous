/*
 * @lc app=leetcode id=189 lang=typescript
 *
 * [189] Rotate Array
 */

rotate([1, 2, 3, 4, 5, 6, 7], 3);

// @lc code=start
/**
 Do not return anything, modify nums in-place instead.
 */
function rotate(nums: number[], k: number): void {
  // return solution1(nums, k);
  return solution2(nums, k);
}

/** SPACE: O(1), TIME: O(2n) */
export function solution2(nums: number[], k: number) {
  const reverse = (nums: number[], start: number, end: number) => {
    while (start < end) {
      const temp = nums[start];
      nums[start] = nums[end];
      nums[end] = temp;
      start++;
      end--;
    }
  };

  // k might exceeds nums.length, making re-rotating
  k = k % nums.length;

  reverse(nums, 0, nums.length - 1);
  reverse(nums, 0, k - 1);
  reverse(nums, k, nums.length - 1);
}

/** SPACE: O(1), TIME: O(2kn) */
export function solution1(nums: number[], k: number) {
  while (k) {
    // here takes O(n) time
    const last = nums.pop();
    if (last === undefined) {
      return;
    }
    // here takes another O(n) time
    nums.unshift(last);
    k--;
  }
}
// @lc code=end
