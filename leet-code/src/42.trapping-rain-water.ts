/*
 * @lc app=leetcode id=42 lang=typescript
 *
 * [42] Trapping Rain Water
 */

// trap([6, 8, 5, 0, 0, 6, 5]); // Output: 13
trap([0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]); // Output: 6

// @lc code=start
function trap(height: number[]): number {
  // return solution1(height);
  // return solution2(height);
  return solution3(height);
}

/**
 * SPACE: O(1), TIME: O(n)
 * - Two pointers, left and right, moving towards the center.
 * - Maintain the maximum heights seen from both sides.
 * - Calculate the water trapped at each step based on the minimum of the two maximum heights.
 */
export function solution3(height: number[]) {
  let water = 0;
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;

  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] < leftMax) {
        water += leftMax - height[left];
      } else {
        leftMax = height[left];
      }

      left++;
    } else {
      if (height[right] < rightMax) {
        water += rightMax - height[right];
      } else {
        rightMax = height[right];
      }

      right--;
    }
  }

  return water;
}

/** SPACE: O(2n), TIME: O(3n) */
export function solution2(height: number[]) {
  const leftMax: number[] = [];
  let max = 0;
  for (let i = 0; i < height.length; i++) {
    leftMax[i] = max;
    if (height[i] > max) {
      max = height[i];
    }
  }

  const rightMax: number[] = [];
  max = 0;
  for (let i = height.length - 1; i >= 0; i--) {
    rightMax[i] = max;
    if (height[i] > max) {
      max = height[i];
    }
  }

  let water = 0;
  for (let i = 0; i < height.length; i++) {
    const borderHeight = Math.min(leftMax[i], rightMax[i]);
    if (borderHeight > height[i]) {
      water += borderHeight - height[i];
    }
  }

  return water;
}

export function solution1(height: number[]) {
  let water = 0;

  for (let i = 0; i < height.length; i++) {
    const curHeight = height[i];
    const leftHeight = i > 0 ? height[i - 1] : 0;
    // all the shorter lefts should be handled already
    if (curHeight >= leftHeight) {
      continue;
    }

    const left = i - 1;

    if (i + 1 >= height.length) {
      return water;
    }
    let rightMax = i + 1;
    // Right border: higher than or equal to the left border
    // or just the highest right
    for (let r = i + 1; r < height.length; r++) {
      if (height[r] >= height[left]) {
        rightMax = r;
        break;
      }

      if (height[r] >= height[rightMax]) {
        rightMax = r;
      }
    }

    const borderHeight = Math.min(height[left], height[rightMax]);

    for (let b = i; b < rightMax; b++) {
      if (height[b] >= borderHeight) continue;
      water += borderHeight - height[b];
    }

    i = rightMax; // Skip to the right border
  }

  return water;
}
// @lc code=end
