/*
 * @lc app=leetcode id=73 lang=typescript
 *
 * [73] Set Matrix Zeroes
 */

setZeroes([
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
]);

// @lc code=start
// use first row and first column as markers
// O(m + n) time, O(1) space
function setZeroes(matrix: number[][]): void {
  const firstRowZero = matrix[0].some((val) => val === 0);
  const firstColZero = matrix.some((row) => row[0] === 0);

  for (let r = 1; r < matrix.length; r++) {
    for (let c = 1; c < matrix[0].length; c++) {
      if (matrix[r][c] === 0) {
        matrix[r][0] = 0; // mark row
        matrix[0][c] = 0; // mark col
      }
    }
  }

  // set zeroes based on markers
  for (let r = 1; r < matrix.length; r++) {
    for (let c = 1; c < matrix[0].length; c++) {
      if (matrix[r][0] === 0 || matrix[0][c] === 0) {
        matrix[r][c] = 0;
      }
    }
  }

  if (firstRowZero) {
    for (let c = 0; c < matrix[0].length; c++) {
      matrix[0][c] = 0;
    }
  }

  if (firstColZero) {
    for (let r = 0; r < matrix.length; r++) {
      matrix[r][0] = 0;
    }
  }
}

// use bit mask to reduce space usage, but only works when row and col size <= 32/52
export function setZeroes2(matrix: number[][]): void {
  let rowMark = 0;
  let colMark = 0;

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if (matrix[r][c] === 0) {
        rowMark |= 1 << r;
        colMark |= 1 << c;
      }
    }
  }

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if ((rowMark & (1 << r)) !== 0 || (colMark & (1 << c)) !== 0) {
        matrix[r][c] = 0;
      }
    }
  }
}

/**
 Do not return anything, modify matrix in-place instead.
 */
export function setZeroes1(matrix: number[][]): void {
  const rowSet = new Set<number>();
  const colSet = new Set<number>();

  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[0].length; c++) {
      if (matrix[r][c] === 0) {
        rowSet.add(r);
        colSet.add(c);
      }
    }
  }

  rowSet.forEach((r) => {
    for (let c = 0; c < matrix[0].length; c++) {
      matrix[r][c] = 0;
    }
  });

  colSet.forEach((c) => {
    for (let r = 0; r < matrix.length; r++) {
      matrix[r][c] = 0;
    }
  });
}
// @lc code=end
