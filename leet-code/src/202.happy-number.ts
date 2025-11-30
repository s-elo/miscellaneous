/*
 * @lc app=leetcode id=202 lang=typescript
 *
 * [202] Happy Number
 */

isHappy(19);

// @lc code=start
function isHappy(n: number): boolean {
  function getSumOfSquares(num: number): number {
    let sum = 0;
    while (num > 0) {
      const digit = num % 10;
      sum += digit * digit;
      num = Math.floor(num / 10);
    }
    return sum;
  }

  let slow = n;
  let fast = n;

  // at least one iteration for 1, 10 etc which initially making slow === fast
  do {
    slow = getSumOfSquares(slow);
    fast = getSumOfSquares(getSumOfSquares(fast));
    if (fast === 1) return true;
  } while (slow !== fast);

  return false; // Cycle detected without reaching 1
}
// @lc code=end
