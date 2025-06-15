/*
 * @lc app=leetcode id=274 lang=typescript
 *
 * [274] H-Index
 */

hIndex([3, 0, 6, 1, 5]); // Output: 3
// hIndex([1, 3, 1]); // Output: 1

// @lc code=start
function hIndex(citations: number[]): number {
  return solution1(citations);
}

/** Note that h must be less than or equal to len */
export function solution1(citations: number[]) {
  const len = citations.length;
  citations.sort((a, b) => a - b);

  for (let i = 0; i < len; i++) {
    // it means that we have at least len-i papers with at least len-i citations
    // because the later citations must be even greater than current citation
    if (citations[i] >= len - i) {
      return len - i;
    }
  }

  return 0;
}
// @lc code=end
