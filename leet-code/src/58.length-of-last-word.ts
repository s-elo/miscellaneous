/*
 * @lc app=leetcode id=58 lang=typescript
 *
 * [58] Length of Last Word
 */

lengthOfLastWord('   fly me   to   the moon  ');

// @lc code=start
function lengthOfLastWord(s: string): number {
  const words = s.trim().split(/\s+/);
  let word = words.pop();
  while (word === '') {
    word = words.pop();
  }

  return word?.length ?? 0;
}
// @lc code=end
