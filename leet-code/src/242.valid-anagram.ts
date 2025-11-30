/*
 * @lc app=leetcode id=242 lang=typescript
 *
 * [242] Valid Anagram
 */

isAnagram('anagram', 'nagaram');

// @lc code=start
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const charCount = new Map<string, number>();

  for (let i = 0; i < s.length; i++) {
    charCount.set(s[i], (charCount.get(s[i]) ?? 0) + 1);
    charCount.set(t[i], (charCount.get(t[i]) ?? 0) - 1);
  }

  for (const count of charCount.values()) {
    if (count !== 0) return false;
  }

  return true;
}
// @lc code=end
