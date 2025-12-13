/*
 * @lc app=leetcode id=452 lang=typescript
 *
 * [452] Minimum Number of Arrows to Burst Balloons
 */

findMinArrowShots([
  [10, 16],
  [2, 8],
  [1, 6],
  [7, 12],
]);

// @lc code=start
function findMinArrowShots(points: number[][]): number {
  if (!points?.length) return 0;

  // sort by end coordinate
  points.sort((a, b) => a[0] - b[0]);

  let arrows = 0;
  let maxEnd = -Infinity;

  for (let i = 0; i < points.length; i++) {
    if (points[i][0] > maxEnd) {
      // overlap not found, need a new arrow
      arrows++;
      maxEnd = points[i][1];
    } else {
      // overlapping, update the maxEnd to the minimum end
      maxEnd = Math.min(maxEnd, points[i][1]);
    }
  }

  return arrows;
}
// @lc code=end
