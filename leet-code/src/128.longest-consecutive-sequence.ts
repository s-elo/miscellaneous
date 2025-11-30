/*
 * @lc app=leetcode id=128 lang=typescript
 *
 * [128] Longest Consecutive Sequence
 */

longestConsecutive([100, 4, 200, 1, 3, 2]);

// @lc code=start

function longestConsecutive(nums: number[]): number {
  if (!nums || nums.length === 0) return 0;

  const numSet = new Set<number>(nums);
  let maxLen = 0;

  for (const num of numSet) {
    // only start counting when `num - 1` is not in the set
    if (!numSet.has(num - 1)) {
      let currNum = num;
      let currLen = 1;

      while (numSet.has(currNum + 1)) {
        currNum += 1;
        currLen += 1;
      }

      maxLen = Math.max(maxLen, currLen);
    }
  }

  return maxLen;
}

/**
 * walk through:
 * 1. 100: left=0, right=0, currLen=1, maxLen=1, map={100:1}
 * 2. 4:   left=0, right=0, currLen=1, maxLen=1, map={100:1,4:1}
 * 3. 200: left=0, right=0, currLen=1, maxLen=1, map={100:1,4:1,200:1}
 * 4. 1:   left=0, right=0, currLen=1, maxLen=1, map={100:1,4:1,200:1,1:1}
 * 5. 3:   left=0(2), right=1(4), currLen=2, maxLen=2, map={100:1,4:2,200:1,1:1,3:2}
 * 6. 2:   left=1(1), right=2(3), currLen=4, maxLen=4, map={100:1,4:3,200:1,1:4,3:4,2:4}
 *      update boundary lengths: map={100:1,4:4,200:1,1:4,3:4,2:4}
 */
export function longestConsecutive1(nums: number[]): number {
  if (!nums || nums.length === 0) return 0;

  const map = new Map<number, number>();

  let maxLen = 0;

  for (const num of nums) {
    // skip duplicates
    if (map.has(num)) continue;

    const left = map.get(num - 1) ?? 0;
    const right = map.get(num + 1) ?? 0;

    const currLen = left + right + 1;
    map.set(num, currLen);

    maxLen = Math.max(maxLen, currLen);

    // update the boundary lengths
    if (left > 0) {
      map.set(num - left, currLen);
    }
    if (right > 0) {
      map.set(num + right, currLen);
    }
  }

  return maxLen;
}
// @lc code=end
