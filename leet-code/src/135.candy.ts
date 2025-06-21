/*
 * @lc app=leetcode id=135 lang=typescript
 *
 * [135] Candy
 */

candy([1, 0, 2]); // Output: 5

// @lc code=start
/**
 * @thoughts
 * - first pass to ensure all kids with higher rating than left kid get more candies
 * - second pass to ensure all kids with higher rating than right kid get more candies,
 * also make sure to **get the maximum of candies already assigned to the kids**
 * - return the sum of candies
 */
function candy(ratings: number[]): number {
  const candy: number[] = [];
  for (let i = 0; i < ratings.length; i++) {
    const curRate = ratings[i];
    const leftRate = i > 0 ? ratings[i - 1] : -1;
    if (curRate > leftRate) {
      candy[i] = (candy[i - 1] || 0) + 1;
    } else {
      candy[i] = 1;
    }
  }

  for (let i = ratings.length - 2; i >= 0; i--) {
    const curRate = ratings[i];
    const rightRate = ratings[i + 1];
    if (curRate > rightRate) {
      candy[i] = Math.max(candy[i], candy[i + 1] + 1);
    }
  }

  return candy.reduce((a, b) => a + b, 0);
}
// @lc code=end
