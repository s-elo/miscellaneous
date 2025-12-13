/*
 * @lc app=leetcode id=57 lang=typescript
 *
 * [57] Insert Interval
 */

insert(
  [
    [1, 3],
    [6, 9],
  ],
  [2, 5],
);

// @lc code=start

function insert(intervals: number[][], newInterval: number[]): number[][] {
  if (!intervals || intervals.length === 0) {
    return [newInterval];
  }

  const result: number[][] = [];
  let i = 0;
  const n = intervals.length;

  // Phase 1: Add all intervals that end before newInterval starts
  while (i < n && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i]);
    i++;
  }

  // Phase 2: Merge all overlapping intervals
  // While current interval starts before or at newInterval's end, they overlap
  while (i < n && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }

  // Add the merged interval
  result.push(newInterval);

  // Phase 3: Add remaining intervals
  while (i < n) {
    result.push(intervals[i]);
    i++;
  }

  return result;
}

export function insert1(
  intervals: number[][],
  newInterval: number[],
): number[][] {
  if (intervals.length === 0) {
    return [newInterval];
  }

  const result: number[][] = [];

  let inserted = false;
  for (let i = 0; i < intervals.length; i++) {
    if (inserted) {
      result.push(intervals[i]);
      continue;
    }

    if (newInterval[0] <= intervals[i][1]) {
      if (newInterval[1] >= intervals[i][0]) {
        // overlap
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
      } else {
        result.push(newInterval);
        result.push(intervals[i]);
        inserted = true;
      }
    } else {
      result.push(intervals[i]);
    }

    if (i === intervals.length - 1 && !inserted) {
      result.push(newInterval);
    }
  }

  return result;
}
// @lc code=end
