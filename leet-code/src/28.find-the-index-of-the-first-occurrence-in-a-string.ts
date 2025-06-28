/*
 * @lc app=leetcode id=28 lang=typescript
 *
 * [28] Find the Index of the First Occurrence in a String
 */

strStr('hello', 'll');

// @lc code=start
function strStr(haystack: string, needle: string): number {
  // too easy
  // return haystack.indexOf(needle);

  for (let i = 0; i < haystack.length; i++) {
    let j = 0;
    while (j < needle.length) {
      if (haystack[i + j] !== needle[j]) break;
      j++;
    }
    if (j === needle.length) return i;
  }
  return -1;
}
// @lc code=end
