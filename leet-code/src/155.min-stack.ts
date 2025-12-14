/*
 * @lc app=leetcode id=155 lang=typescript
 *
 * [155] Min Stack
 */

// @lc code=start
class MinStack {
  constructor(private stack: number[] = [], private minStack: number[] = []) {}

  push(val: number): void {
    this.stack.push(val);
    if (this.minStack.length === 0 || val <= this.getMin()) {
      this.minStack.push(val);
    }
    return;
  }

  pop(): void {
    if (this.stack.pop() === this.getMin()) {
      this.minStack.pop();
    }

    return;
  }

  top(): number {
    return this.stack[this.stack.length - 1];
  }

  getMin(): number {
    return this.minStack[this.minStack.length - 1];
  }
}

new MinStack();

/**
 * Your MinStack object will be instantiated and called as such:
 * var obj = new MinStack()
 * obj.push(val)
 * obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.getMin()
 */
// @lc code=end
