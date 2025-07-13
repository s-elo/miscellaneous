/*
 * @lc app=leetcode id=392 lang=typescript
 *
 * [392] Is Subsequence
 */

isSubsequence('abc', 'ahbgdc'); // true

// @lc code=start
function isSubsequence(s: string, t: string): boolean {
  if (s.length > t.length) return false;

  let p1 = 0;
  let p2 = 0;

  while (p1 < s.length) {
    if (p2 >= t.length) return false;

    if (s[p1] === t[p2]) {
      p1++;
      p2++;
    } else {
      p2++;
    }
  }

  return true;
}
// @lc code=end
