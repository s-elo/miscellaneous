/*
 * @lc app=leetcode id=71 lang=typescript
 *
 * [71] Simplify Path
 */

simplifyPath('/home/'); // "/home"

// @lc code=start
function simplifyPath(path: string): string {
  const stack: string[] = [];

  const components = path.split('/');
  for (const component of components) {
    // /// and ./
    if (component === '' || component === '.') {
      continue;
    } else if (component === '..') {
      if (stack.length > 0) {
        stack.pop();
      }
    } else {
      stack.push(component);
    }
  }

  return '/' + stack.join('/');
}
// @lc code=end
