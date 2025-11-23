/*
 * @lc app=leetcode id=48 lang=typescript
 *
 * [48] Rotate Image
 */

rotate([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]);

// @lc code=start
/**
 Do not return anything, modify matrix in-place instead.
 */
function rotate(matrix: number[][]): void {
  // colLen === rowLen
  const len = matrix.length;
  const endRowIdx = Math.floor(len / 2) - 1;
  for (
    let r = 0, cStart = 0, cEnd = len - 1;
    r <= endRowIdx;
    r++, cStart++, cEnd--
  ) {
    for (let c = cStart; c < cEnd; c++) {
      // top-left
      const temp = matrix[r][c];
      // bottom-left to top-left
      matrix[r][c] = matrix[len - 1 - c][r];
      // bottom-right to bottom-left
      matrix[len - 1 - c][r] = matrix[len - 1 - r][len - 1 - c];
      // top-right to bottom-right
      matrix[len - 1 - r][len - 1 - c] = matrix[c][len - 1 - r];
      // top-left to top-right
      matrix[c][len - 1 - r] = temp;
    }
  }
}
// @lc code=end
