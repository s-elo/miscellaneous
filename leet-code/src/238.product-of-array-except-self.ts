/*
 * @lc app=leetcode id=238 lang=typescript
 *
 * [238] Product of Array Except Self
 */

productExceptSelf([1, 2, 3, 4]);

// @lc code=start
function productExceptSelf(nums: number[]): number[] {
  // return solution1(nums);
  return solution2(nums);
}

/** O(2n) and no need to handle 0 cases */
export function solution2(nums: number[]) {
  const ret: number[] = [];

  // calculate all the left product of corresponding element
  // and store the val in the position
  let left = 1;
  nums.forEach((num, i) => {
    ret[i] = left;
    left *= num;
  });

  // calculate all the right product of corresponding element
  // multiply with the value in the position, namely the previous all the left product
  let right = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    ret[i] *= right;
    right *= nums[i];
  }

  return ret;
}

/** O(2n) */
export function solution1(nums: number[]) {
  let zeroCount = 0;
  const totalProduct = nums.reduce((total, num) => {
    if (num === 0) zeroCount++;
    return total * (num === 0 ? 1 : num);
  }, 1);

  if (zeroCount > 1) return new Array(nums.length).fill(0);

  const ret: number[] = [];
  for (const num of nums) {
    if (num === 0) {
      ret.push(totalProduct);
    } else if (zeroCount > 0) {
      ret.push(0);
    } else {
      ret.push(totalProduct / num);
    }
  }

  return ret;
}
// @lc code=end
