/*
 * @lc app=leetcode id=290 lang=typescript
 *
 * [290] Word Pattern
 */

wordPattern('abba', 'dog cat cat dog'); // true

// @lc code=start
function wordPattern(pattern: string, s: string): boolean {
  const words = s.split(' ');
  if (pattern.length !== words.length) return false;

  const charToWord = new Map<string, string>();
  const mappedWords = new Set<string>();

  for (let i = 0; i < pattern.length; i++) {
    const char = pattern[i];
    const word = words[i];

    if (charToWord.has(char)) {
      if (charToWord.get(char) !== word) {
        return false;
      }
    } else {
      if (mappedWords.has(word)) {
        return false;
      }
      charToWord.set(char, word);
      mappedWords.add(word);
    }
  }

  return true;
}
// @lc code=end
