/*
 * @lc app=leetcode id=125 lang=typescript
 *
 * [125] Valid Palindrome
 */

isPalindrome('A man, a plan, a canal: Panama'); // true

// @lc code=start
function isPalindrome(s: string): boolean {
  // return solution1(s);
  return solution2(s);
}

/** looks like operating as string will be faster */
export function solution2(s: string) {
  const trimmed = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return trimmed === trimmed.split('').reverse().join('');
}

export function solution1(s: string) {
  if (!s) return true;

  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    let leftVal = s[left];
    let rightVal = s[right];
    while (!/[a-zA-Z0-9]/.test(leftVal)) {
      leftVal = s[++left];
    }
    while (!/[a-zA-Z0-9]/.test(rightVal)) {
      rightVal = s[--right];
    }
    if (rightVal === undefined || leftVal === undefined) return true;
    if (leftVal.toLowerCase() !== rightVal.toLowerCase()) {
      return false;
    }
    left++;
    right--;
  }

  return true;
}
// @lc code=end
