/*
 * @lc app=leetcode id=205 lang=typescript
 *
 * [205] Isomorphic Strings
 */

isIsomorphic('egg', 'add'); // true

// @lc code=start
function isIsomorphic(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const map = new Map<string, string>();
  const mappedValues = new Set<string>();

  for (let i = 0; i < s.length; i++) {
    const charS = s[i];
    const charT = t[i];

    if (map.has(charS)) {
      if (map.get(charS) !== charT) {
        return false;
      }
    } else {
      if (mappedValues.has(charT)) {
        return false;
      }

      map.set(charS, charT);
      mappedValues.add(charT);
    }
  }

  return true;
}
// @lc code=end
