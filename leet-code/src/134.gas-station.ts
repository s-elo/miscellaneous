/*
 * @lc app=leetcode id=134 lang=typescript
 *
 * [134] Gas Station
 */

canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]);

// @lc code=start
/**
 * @thoughts
 * - if the total gas is less than the total cost, there is no way to complete the circuit
 * - start from the i station, keep tracking the current gas,
 * if at j station, the current gas is not enough to reach the next station,
 * then it means we cannot start from any station between i and j,
 * so we can set the next start station to j + 1
 */
function canCompleteCircuit(gas: number[], cost: number[]): number {
  let start = 0;
  let totalGas = 0;
  let totalCost = 0;
  let curGas = 0;

  for (let i = 0; i < gas.length; i++) {
    const gasAtStation = gas[i];
    const costToNext = cost[i];

    if (curGas < 0) {
      start = i;
      curGas = 0;
    }

    curGas += gasAtStation - costToNext;
    totalGas += gasAtStation;
    totalCost += costToNext;
  }

  return totalGas < totalCost ? -1 : start;
}
// @lc code=end
