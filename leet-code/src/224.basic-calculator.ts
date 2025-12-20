/*
 * @lc app=leetcode id=224 lang=typescript
 *
 * [224] Basic Calculator
 */

calculate('1 + 1'); // 2

// @lc code=start
function calculate(s: string): number {
  const stack: number[] = [];
  let result = 0;
  let number = 0;
  let sign = 1;

  for (const char of s) {
    if (char >= '0' && char <= '9') {
      number = number * 10 + Number(char);
    } else if (char === '+' || char === '-') {
      result += sign * number;
      number = 0;
      sign = char === '+' ? 1 : -1;
    } else if (char === '(') {
      stack.push(result);
      stack.push(sign);
      result = 0;
      sign = 1;
    } else if (char === ')') {
      result += sign * number;
      number = 0;
      result *= stack.pop()!;
      result += stack.pop()!;
    }
  }

  return result + sign * number;
}
// @lc code=end
