/*
 * @lc app=leetcode id=383 lang=typescript
 *
 * [383] Ransom Note
 */

canConstruct('a', 'b');

// @lc code=start
function canConstruct(ransomNote: string, magazine: string): boolean {
  if (ransomNote.length > magazine.length) return false;

  const magCount = new Map<string, number>();
  for (const char of magazine) {
    magCount.set(char, (magCount.get(char) ?? 0) + 1);
  }

  for (const char of ransomNote) {
    const count = magCount.get(char) ?? 0;
    if (count === 0) {
      return false;
    }
    magCount.set(char, count - 1);
  }

  return true;
}
// @lc code=end
