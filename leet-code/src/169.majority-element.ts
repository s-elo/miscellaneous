/*
 * @lc app=leetcode id=169 lang=typescript
 *
 * [169] Majority Element
 */

majorityElement([3, 2, 3]);

// @lc code=start
function majorityElement(nums: number[]): number {
  // return solution1(nums);
  // return solution2(nums);
  return solution3(nums);
}

/**
 * Space: O(1), Time: O(n),
 * Boyer-Moore Voting Algorithm
 */
export function solution3(nums: number[]) {
  let cadidate;
  let count = 0;

  for (const num of nums) {
    if (count === 0) {
      cadidate = num;
    }

    count += cadidate === num ? 1 : -1;
  }

  return cadidate;
}

/** Space: O(1), Time: O(n*log n),
 * utilize the info that majority element is more than n/2
 * */
export function solution2(nums: number[]) {
  return nums.sort((a, b) => a - b)[Math.floor(nums.length / 2)];
}

export function solution1(nums: number[]) {
  const countMap = new Map<number, number>();

  for (const num of nums) {
    const count = countMap.get(num) ?? 0;
    countMap.set(num, count + 1);
  }

  return [...countMap.entries()].reduce(
    (max, [num, count]) => {
      if (count > max.count) {
        return { count, num };
      }
      return max;
    },
    { count: 0, num: nums[0] },
  ).num;
}
// @lc code=end
