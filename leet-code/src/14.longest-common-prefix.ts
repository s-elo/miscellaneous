/*
 * @lc app=leetcode id=14 lang=typescript
 *
 * [14] Longest Common Prefix
 */

longestCommonPrefix(['flower', 'flow', 'flight']);

// @lc code=start
function longestCommonPrefix(strs: string[]): string {
  const str = strs[0];
  if (str.length === 0) return '';

  let ret = '';
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    for (let j = 1; j < strs.length; j++) {
      if (strs[j][i] !== char) {
        return ret;
      }
    }
    ret += char;
  }

  return ret;
}
// @lc code=end
