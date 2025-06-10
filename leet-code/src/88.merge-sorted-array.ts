/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * @lc app=leetcode id=88 lang=typescript
 *
 * [88] Merge Sorted Array
 */

// @lc code=start
/**
 Do not return anything, modify nums1 in-place instead.
 */
merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3);

function merge(nums1: number[], m: number, nums2: number[], n: number): void {
  // solution1(nums1, m, nums2, n);
  solution2(nums1, m, nums2, n);
}

export function solution2(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number,
): void {
  let p1 = m - 1;
  let p2 = n - 1;
  let p = m + n - 1;

  while (p2 >= 0) {
    if (nums2[p2] >= nums1[p1] || nums1[p1] === undefined) {
      nums1[p] = nums2[p2];
      p2--;
    } else {
      nums1[p] = nums1[p1];
      p1--;
    }

    p--;
  }
}

export function solution1(
  nums1: number[],
  m: number,
  nums2: number[],
  n: number,
): void {
  if (m === 0) {
    nums1.splice(0, nums2.length, ...nums2);
    return;
  }

  for (const [n2Idx, num] of nums2.entries()) {
    for (let i = 0; i < nums1.length; i++) {
      if (num <= nums1[i]) {
        nums1.splice(i, 0, num);
        break;
      }
      if (i >= m + n2Idx && nums1[i] === 0) {
        nums1.splice(i, 1, num);
        break;
      }
    }
  }

  while (nums1.length > m + n && nums1[nums1.length - 1] === 0) {
    nums1.pop();
  }
}
// @lc code=end
