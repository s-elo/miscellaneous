/*
 * @lc app=leetcode id=13 lang=typescript
 *
 * [13] Roman to Integer
 */

romanToInt('III'); // Output: 3

// @lc code=start
function romanToInt(s: string): number {
  const map = {
    I: 1,
    IV: 4,
    V: 5,
    IX: 9,
    X: 10,
    XL: 40,
    L: 50,
    XC: 90,
    C: 100,
    CD: 400,
    D: 500,
    CM: 900,
    M: 1000,
  };

  let ret = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = s[i];
    const next = s[i + 1];
    const combinedKey = `${cur}${next}`;
    ret += map[combinedKey] || map[cur] || 0;

    if (map[combinedKey]) {
      i++; // Skip the next character if we used a combined key
    }
  }

  return ret;
}
// @lc code=end
