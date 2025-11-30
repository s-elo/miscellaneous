/*
 * @lc app=leetcode id=289 lang=typescript
 *
 * [289] Game of Life
 */

gameOfLife([
  [0, 1, 0],
  [0, 0, 1],
  [1, 1, 1],
  [0, 0, 0],
]);

// @lc code=start
/**
 Do not return anything, modify board in-place instead.
 */
function gameOfLife(board: number[][]): void {
  const rowLen = board.length;
  const colLen = board[0].length;

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  const MARK_AS_DEAD = 2; // 1 -> 0
  const MARK_AS_LIVE = 3; // 0 -> 1

  board.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      let liveNeighbors = 0;

      directions.forEach(([dRow, dCol]) => {
        const newRow = rIdx + dRow;
        const newCol = cIdx + dCol;

        if (newRow >= 0 && newRow < rowLen && newCol >= 0 && newCol < colLen) {
          const neighborCell = board[newRow][newCol];
          if (neighborCell === 1 || neighborCell === MARK_AS_DEAD) {
            liveNeighbors++;
          }
        }
      });

      if (cell === 1 && (liveNeighbors < 2 || liveNeighbors > 3)) {
        board[rIdx][cIdx] = MARK_AS_DEAD;
      } else if (cell === 0 && liveNeighbors === 3) {
        board[rIdx][cIdx] = MARK_AS_LIVE;
      }
    });
  });

  board.forEach((row, rIdx) => {
    row.forEach((cell, cIdx) => {
      if (cell === MARK_AS_DEAD) {
        board[rIdx][cIdx] = 0;
      } else if (cell === MARK_AS_LIVE) {
        board[rIdx][cIdx] = 1;
      }
    });
  });

  return;
}
// @lc code=end
