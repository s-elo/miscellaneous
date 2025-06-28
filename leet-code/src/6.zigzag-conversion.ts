/*
 * @lc app=leetcode id=6 lang=typescript
 *
 * [6] Zigzag Conversion
 */

// convert('PAYPALISHIRING', 3);
convert('AB', 1);

// @lc code=start
/** Space O(n), Time O(n) */
function convert(s: string, numRows: number): string {
  if (numRows === 1) return s;

  const ret: string[] = [];

  let row = 0;
  let up = false;

  for (let i = 0; i < s.length; i++) {
    const prevUp = up;
    // util change the direction
    while (up === prevUp && i < s.length) {
      ret[row] = ret[row] ?? '';
      ret[row] += s[i];

      // down to numRows - 1 idx
      if (!up && row === numRows - 1) {
        up = true;
        row = row - 1;
        break;
      }

      // up to 0
      if (up && row === 0) {
        up = false;
        row = row + 1;
        break;
      }

      if (up) row--;
      else row++;

      i++; // skip processed char
    }
  }

  return ret.join('');
}
// @lc code=end
