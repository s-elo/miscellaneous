/*
 * @lc app=leetcode id=49 lang=typescript
 *
 * [49] Group Anagrams
 */

groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']);

// @lc code=start

function groupAnagrams(strs: string[]): string[][] {
  // a bit slow but works
  // return Object.values(
  //   strs.reduce((groups, str) => {
  //     const key = str.split('').sort().join('');
  //     groups[key] = groups[key] || [];
  //     groups[key].push(str);
  //     return groups;
  //   }, {}),
  // );

  if (!strs || strs.length === 0) return [];

  const anagramMap = new Map();

  for (const str of strs) {
    // Create character frequency signature
    const count = Array(26).fill(0);

    for (const char of str) {
      count[char.charCodeAt(0) - 'a'.charCodeAt(0)]++;
    }

    // Use frequency array as key
    const signature = count.join('#');

    if (!anagramMap.has(signature)) {
      anagramMap.set(signature, []);
    }
    anagramMap.get(signature).push(str);
  }

  return Array.from(anagramMap.values());
}

// product not accurate for long strings
// e.g. groupAnagrams(['xyzzzzzzzzzzzz', 'zzzzzzzzzzzzyx']);
// the product can be 9.727880485129294e+27 or 9.727880485129293e+27
export function groupAnagrams2(strs: string[]): string[] {
  if (!strs || strs.length === 0) return [];

  // First 26 prime numbers
  // so that every permutation of letters will result in a unique product
  const primes = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97, 101,
  ];
  const anagramMap = new Map();

  for (const str of strs) {
    let product = 1;

    for (const char of str) {
      const index = char.charCodeAt(0) - 'a'.charCodeAt(0);
      product *= primes[index];
    }

    // Use prime product as signature (mathematically unique for anagrams)
    if (!anagramMap.has(product)) {
      anagramMap.set(product, []);
    }
    anagramMap.get(product).push(str);
  }

  return Array.from(anagramMap.values());
}

// Time exceeded
export function groupAnagrams1(strs: string[]): string[][] {
  const groups: string[][] = [];

  for (const str of strs) {
    let found = false;
    for (const strings of groups) {
      const str2 = strings[0];
      if (str.length !== str2.length) {
        continue;
      }

      const map = new Map<string, number>();
      for (let i = 0; i < str.length; i++) {
        map.set(str[i], (map.get(str[i]) ?? 0) + 1);
        map.set(str2[i], (map.get(str2[i]) ?? 0) - 1);
      }

      if ([...map.values()].every((count) => count === 0)) {
        strings.push(str);
        found = true;
        break;
      }
    }

    if (!found) {
      groups.push([str]);
    }
  }

  return groups;
}
// @lc code=end
