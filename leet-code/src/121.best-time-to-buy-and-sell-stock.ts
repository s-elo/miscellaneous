/*
 * @lc app=leetcode id=121 lang=typescript
 *
 * [121] Best Time to Buy and Sell Stock
 */

maxProfit([7, 1, 5, 3, 6, 4]); // Output: 5

// @lc code=start
export function maxProfit(prices: number[]): number {
  let profit = 0;

  let buyPrice = Infinity;
  for (const price of prices) {
    if (price < buyPrice) {
      buyPrice = price; // Update the minimum price to buy
    } else {
      const currentProfit = price - buyPrice; // Calculate profit if sold at current price
      profit = Math.max(profit, currentProfit); // Update maximum profit if current profit is higher
    }
  }

  return profit;
}
// @lc code=end
