/*
 * @lc app=leetcode id=12 lang=typescript
 *
 * [12] Integer to Roman
 */

intToRoman(3); // Output: "III"

// @lc code=start
function intToRoman(num: number): string {
  // return solution1(num);
  return solution2(num);
}

export function solution2(num: number) {
  const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  const symbols = [
    'M',
    'CM',
    'D',
    'CD',
    'C',
    'XC',
    'L',
    'XL',
    'X',
    'IX',
    'V',
    'IV',
    'I',
  ];

  let result = '';

  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += symbols[i];
      num -= values[i];
    }
  }

  return result;
}

export function solution1(num: number) {
  const map = {
    1: 'I',
    4: 'IV',
    5: 'V',
    9: 'IX',
    10: 'X',
    40: 'XL',
    50: 'L',
    90: 'XC',
    100: 'C',
    400: 'CD',
    500: 'D',
    900: 'CM',
    1000: 'M',
  };
  const keys = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000];

  let ret = '';
  while (num > 0) {
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const nextKey = keys[i + 1];

      if (num < nextKey || !nextKey) {
        if ([1, 10, 100, 1000].includes(key)) {
          while (num >= key) {
            ret += map[key];
            num -= key;
          }
          break;
        } else {
          num -= key;
          ret += map[key];
          break;
        }
      }
    }
  }

  return ret;
}
// @lc code=end
