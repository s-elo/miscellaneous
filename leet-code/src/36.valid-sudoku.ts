/*
 * @lc app=leetcode id=36 lang=typescript
 *
 * [36] Valid Sudoku
 */

isValidSudoku([
  ['5', '3', '.', '.', '7', '.', '.', '.', '.'],
  ['6', '.', '.', '1', '9', '5', '.', '.', '.'],
  ['.', '9', '8', '.', '.', '.', '.', '6', '.'],
  ['8', '.', '.', '.', '6', '.', '.', '.', '3'],
  ['4', '.', '6', '8', '.', '3', '.', '.', '1'],
  ['7', '.', '.', '.', '2', '.', '.', '.', '6'],
  ['.', '6', '.', '.', '.', '.', '2', '8', '.'],
  ['.', '.', '.', '4', '1', '9', '.', '.', '5'],
  ['.', '.', '.', '.', '8', '.', '.', '7', '9'],
]);

// @lc code=start

function isValidSudoku(board: string[][]): boolean {
  // traverse rows
  const seen = new Set<string>();
  for (let r = 0; r < 9; r++) {
    seen.clear();
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val === '.') continue;
      if (seen.has(val)) {
        return false;
      }
      seen.add(val);
    }
  }

  // traverse columns
  for (let c = 0; c < 9; c++) {
    seen.clear();
    for (let r = 0; r < 9; r++) {
      const val = board[r][c];
      if (val === '.') continue;
      if (seen.has(val)) {
        return false;
      }
      seen.add(val);
    }
  }

  // traverse boxes
  for (let rowStart = 0; rowStart < 9; rowStart += 3) {
    for (let colStart = 0; colStart < 9; colStart += 3) {
      seen.clear();
      for (let r = rowStart; r < rowStart + 3; r++) {
        for (let c = colStart; c < colStart + 3; c++) {
          const val = board[r][c];
          if (val === '.') continue;
          if (seen.has(val)) {
            return false;
          }
          seen.add(val);
        }
      }
    }
  }

  return true;
}

// use set map
export function isValidSudoku1(board: string[][]): boolean {
  const rows = new Array(9).fill(0).map(() => new Set<string>());
  const cols = new Array(9).fill(0).map(() => new Set<string>());
  const boxes = new Array(9).fill(0).map(() => new Set<string>());

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c];
      if (val === '.') continue;

      // check row
      if (rows[r].has(val)) {
        return false;
      }
      rows[r].add(val);

      // check column
      if (cols[c].has(val)) {
        return false;
      }
      cols[c].add(val);

      // check box
      //  floor(r / 3) is the row index, then *3 since there are 3 boxes per row
      //  floor(c / 3) is the column index
      const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      if (boxes[boxIdx].has(val)) {
        return false;
      }
      boxes[boxIdx].add(val);
    }
  }

  return true;
}
// @lc code=end
