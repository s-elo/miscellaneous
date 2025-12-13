/*
 * @lc app=leetcode id=20 lang=typescript
 *
 * [20] Valid Parentheses
 */

isValid('()[]{}');

// @lc code=start
function isValid(s: string): boolean {
  const stack: string[] = [];

  for (const char of s) {
    if (['(', '{', '['].includes(char)) {
      stack.push(char);
    } else {
      const last = stack.pop();
      if (
        (char === ')' && last !== '(') ||
        (char === '}' && last !== '{') ||
        (char === ']' && last !== '[')
      ) {
        return false;
      }
    }
  }

  return stack.length === 0;
}
// @lc code=end
