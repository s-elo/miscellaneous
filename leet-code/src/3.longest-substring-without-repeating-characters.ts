/*
 * @lc app=leetcode id=3 lang=typescript
 *
 * [3] Longest Substring Without Repeating Characters
 */

lengthOfLongestSubstring('abcabcbb');

// @lc code=start
/**
 * Sliding window approach:
 * - Use two pointers to represent the current window (substring).
 * - Expand the right pointer to include new characters until a duplicate is found.
 * - When a duplicate is found, move the left pointer to the next index of that character.
 * - Keep track of the maximum length of valid substrings found during the process.
 */
function lengthOfLongestSubstring(s: string): number {
  const charIdxMap = new Map<string, number>();
  let left = 0;
  let maxLen = 0;

  for (let right = 0; right < s.length; right++) {
    const char = s[right];

    const charIdx = charIdxMap.get(char);
    if (charIdx !== undefined && charIdx >= left) {
      left = charIdx + 1;
    } else {
      maxLen = Math.max(maxLen, right - left + 1);
    }

    charIdxMap.set(char, right);
  }

  return maxLen;
}
// @lc code=end
