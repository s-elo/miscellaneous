/* eslint-disable @typescript-eslint/no-non-null-assertion */
/*
 * @lc app=leetcode id=150 lang=typescript
 *
 * [150] Evaluate Reverse Polish Notation
 */

evalRPN(['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+']);

// @lc code=start
function evalRPN(tokens: string[]): number {
  const stack: number[] = [];

  const operators = new Set(['+', '-', '*', '/']);
  for (const token of tokens) {
    if (!operators.has(token)) {
      stack.push(Number(token));
    } else {
      const b = stack.pop()!;
      const a = stack.pop()!;
      // stack.push(eval(`(${a}) ${token} (${b})`) | 0);
      switch (token) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          stack.push((a / b) | 0); // Math.floor for positive, Math.ceil for negative
          break;
      }
    }
  }

  return stack.pop()!;
}
// @lc code=end
