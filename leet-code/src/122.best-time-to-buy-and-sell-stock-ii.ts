/*
 * @lc app=leetcode id=122 lang=typescript
 *
 * [122] Best Time to Buy and Sell Stock II
 */

maxProfit([7, 1, 5, 3, 6, 4]); // Output: 7

// @lc code=start
function maxProfit(prices: number[]): number {
  // return solution1(prices);
  return solution2(prices);
}

/** just use two pointers */
export function solution2(prices: number[]) {
  let p1 = 0;
  let p2 = 1;
  let profit = 0;

  while (p2 < prices.length) {
    if (prices[p1] < prices[p2]) {
      profit += prices[p2] - prices[p1];
    }

    p1++;
    p2++;
  }

  return profit;
}

export function solution1(prices: number[]) {
  let buyPrice = Infinity;
  let totalProfit = 0;
  let curMaxProfit = 0;
  let lastPrice;

  for (const price of prices) {
    // when the price is lower than the buyPrice or lastPrice,
    // it means we can buy at this price, so we reset the buyPrice
    // and add the curMaxProfit to totalProfit(sell at the lastPrice)
    if (price < buyPrice || price < lastPrice) {
      buyPrice = price;
      totalProfit += curMaxProfit;
      curMaxProfit = 0;
    } else {
      // when the price keep going up
      curMaxProfit = Math.max(curMaxProfit, price - buyPrice);
    }

    lastPrice = price;
  }

  // when prices all go up to the end, need to add the curMaxProfit
  // if curMaxProfit has been added to totalProfit, it will be 0
  return totalProfit + curMaxProfit;
}
// @lc code=end
