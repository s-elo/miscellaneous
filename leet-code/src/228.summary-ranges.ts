/*
 * @lc app=leetcode id=228 lang=typescript
 *
 * [228] Summary Ranges
 */

summaryRanges([0, 1, 2, 4, 5, 7]);

// @lc code=start
function summaryRanges(nums: number[]): string[] {
  const result: string[] = [];

  let start = 0;
  let end = 0;

  while (end < nums.length) {
    while (end < nums.length - 1 && nums[end] + 1 === nums[end + 1]) {
      end++;
    }

    const startNum = nums[start];
    const endNum = nums[end];
    result.push(`${startNum}${startNum !== endNum ? `->${endNum}` : ''}`);
    start = end + 1;
    end++;
  }

  return result;
}
// @lc code=end
