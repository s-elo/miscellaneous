/*
 * @lc app=leetcode id=151 lang=typescript
 *
 * [151] Reverse Words in a String
 */

reverseWords('   fly me   to   the moon  ');

// @lc code=start
function reverseWords(s: string): string {
  return s.trim().split(/\s+/).reverse().join(' ');
}
// @lc code=end
