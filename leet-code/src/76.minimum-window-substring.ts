/*
 * @lc app=leetcode id=76 lang=typescript
 *
 * [76] Minimum Window Substring
 */

minWindow('ADOBECODEBANC', 'ABC');

// @lc code=start
function minWindow(s: string, t: string): string {
  if (!s || !t || s.length < t.length) return '';

  const freqMap = new Map<string, number>();
  for (const char of t) {
    freqMap.set(char, (freqMap.get(char) ?? 0) + 1);
  }

  let right = 0;
  let left = 0;
  let minLength = Infinity;
  let minStart = 0;

  const required = freqMap.size;
  let formed = 0;
  const curWindowFreqMap = new Map<string, number>();

  while (right < s.length) {
    const char = s[right];
    curWindowFreqMap.set(char, (curWindowFreqMap.get(char) ?? 0) + 1);

    if (freqMap.has(char) && curWindowFreqMap.get(char) === freqMap.get(char)) {
      formed++;
    }

    // shrink the window until it is not valid
    while (left <= right && formed === required) {
      const windowLength = right - left + 1;
      if (windowLength < minLength) {
        minLength = windowLength;
        minStart = left;
      }

      const leftChar = s[left];
      const leftCharCount = curWindowFreqMap.get(leftChar) ?? 0;
      if (leftCharCount) {
        curWindowFreqMap.set(leftChar, leftCharCount - 1);
      } else {
        curWindowFreqMap.delete(leftChar);
      }

      if (
        freqMap.has(leftChar) &&
        (curWindowFreqMap.get(leftChar) ?? 0) < (freqMap.get(leftChar) ?? 0)
      ) {
        formed--;
      }

      left++;
    }

    right++;
  }

  return minLength === Infinity ? '' : s.slice(minStart, minStart + minLength);
}
// @lc code=end
