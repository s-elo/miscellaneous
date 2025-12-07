/*
 * @lc app=leetcode id=56 lang=typescript
 *
 * [56] Merge Intervals
 */
merge([
  [1, 3],
  [2, 6],
  [8, 10],
  [15, 18],
]);

// @lc code=start
function merge(intervals: number[][]): number[][] {
  if (!intervals?.length) return [];

  intervals.sort((a, b) => a[0] - b[0]);

  const result: number[][] = [];

  let start = 0;
  let end = 0;

  while (end < intervals.length) {
    let maxEnd = intervals[end][1];
    while (
      end < intervals.length - 1 &&
      // overlapping
      maxEnd >= intervals[end + 1][0]
    ) {
      end++;
      // keep track of the farthest end
      // and maxEnd should be the end of the merged interval
      maxEnd = Math.max(maxEnd, intervals[end][1]);
    }

    const mergedInterval: number[] = [intervals[start][0], maxEnd];
    result.push(mergedInterval);
    start = end + 1;
    end++;
  }

  return result;
}
// @lc code=end
