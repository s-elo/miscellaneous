/*
 * @lc app=leetcode id=26 lang=typescript
 *
 * [26] Remove Duplicates from Sorted Array
 */

removeDuplicates([0, 0, 1, 1, 1, 2, 2, 3, 3, 4]);

// @lc code=start
function removeDuplicates(nums: number[]): number {
  // return solution1(nums);
  return solution2(nums);
}

// Space complexity: O(1)
export function solution2(nums: number[]): number {
  let k = 0;

  for (let i = 0; i < nums.length; i++) {
    nums[k] = nums[i];
    k++;

    // Skip duplicates
    while (i + 1 < nums.length && nums[i] === nums[i + 1]) {
      i++;
    }
  }

  return k;
}

// Space complexity: O(n)
export function solution1(nums: number[]): number {
  let k = 0;
  const set = new Set<number>();

  for (let i = 0; i < nums.length; i++) {
    const val = nums[i];
    if (!set.has(val)) {
      set.add(val);
      nums[k] = val;
      k++;
    }
  }

  return k;
}
// @lc code=end
