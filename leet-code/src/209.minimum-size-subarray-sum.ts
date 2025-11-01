/*
 * @lc app=leetcode id=209 lang=typescript
 *
 * [209] Minimum Size Subarray Sum
 */

minSubArrayLen(7, [2, 3, 1, 2, 4, 3]);

// @lc code=start
/**
 * Sliding window approach:
 * - Use two pointers to represent the current window (subarray).
 * - Expand the right pointer to increase the sum until it meets or exceeds the target.
 * - Once the sum is sufficient, move the left pointer to try and reduce the window size while still meeting the target.
 * - Keep track of the minimum length of valid windows found during the process.
 */
function minSubArrayLen(target: number, nums: number[]): number {
  let left = 0;
  let curSum = 0;
  let minLen = Infinity;

  for (let right = 0; right < nums.length; right++) {
    curSum += nums[right];

    while (curSum >= target) {
      minLen = Math.min(minLen, right - left + 1);
      curSum -= nums[left];
      left++;
    }
  }

  return minLen === Infinity ? 0 : minLen;
}
// @lc code=end
