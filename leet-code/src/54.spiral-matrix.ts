/*
 * @lc app=leetcode id=54 lang=typescript
 *
 * [54] Spiral Matrix
 */

spiralOrder([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
]);

// @lc code=start
function spiralOrder(matrix: number[][]): number[] {
  const result: number[] = [];
  if (matrix.length === 0) return result;

  let dir = 0; // 0:right, 1:down, 2:left, 3:up
  let rightLimit = matrix[0].length - 1;
  let leftLimit = 0;
  let topLimit = 0;
  let bottomLimit = matrix.length - 1;

  let r = 0;
  let c = 0;
  while (result.length < matrix.length * matrix[0].length) {
    result.push(matrix[r][c]);

    const curDir = dir;
    if (c === rightLimit && curDir === 0) {
      dir = 1;
      topLimit++;
      r++;
    }
    if (r === bottomLimit && curDir === 1) {
      dir = 2;
      rightLimit--;
      c--;
    }
    if (c === leftLimit && curDir === 2) {
      dir = 3;
      bottomLimit--;
      r--;
    }
    if (r === topLimit && curDir === 3) {
      dir = 0;
      leftLimit++;
      c++;
    }

    if (curDir === 0 && c < rightLimit) {
      c++;
    } else if (curDir === 1 && r < bottomLimit) {
      r++;
    } else if (curDir === 2 && c > leftLimit) {
      c--;
    } else if (curDir === 3 && r > topLimit) {
      r--;
    }
  }
  return result;
}
// @lc code=end
