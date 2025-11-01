/*
 * @lc app=leetcode id=11 lang=typescript
 *
 * [11] Container With Most Water
 */

maxArea([1, 8, 6, 2, 5, 4, 8, 3, 7]);

// @lc code=start
/**
 * Two pointers approach:
 * - Start with two pointers at the beginning and end of the array.
 * - Calculate the area formed by the lines at the two pointers.
 * - Move the pointer pointing to the shorter line inward, as this may lead to a taller line and potentially a larger area.
 * - Repeat until the two pointers meet.
 */
function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxArea = 0;

  while (left < right) {
    const width = right - left;
    const curHeight = Math.min(height[left], height[right]);
    const area = width * curHeight;
    maxArea = Math.max(maxArea, area);

    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxArea;
}
// @lc code=end
