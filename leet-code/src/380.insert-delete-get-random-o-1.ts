/*
 * @lc app=leetcode id=380 lang=typescript
 *
 * [380] Insert Delete GetRandom O(1)
 */

// @lc code=start
class RandomizedSet {
  protected _store: number[] = [];
  protected _map = new Map<number, number>();

  insert(val: number): boolean {
    const idx = this._map.get(val);
    if (idx !== undefined) return false;

    this._store.push(val);
    this._map.set(val, this._store.length - 1);

    return true;
  }

  remove(val: number): boolean {
    const idx = this._map.get(val);
    if (idx === undefined) return false;

    const lastVal = this._store[this._store.length - 1];
    this._store[idx] = lastVal;
    this._map.set(lastVal, idx);
    this._store.pop();
    this._map.delete(val);

    return true;
  }

  getRandom(): number {
    const idx = Math.floor(Math.random() * this._store.length);
    return this._store[idx];
  }
}

/**
 * Your RandomizedSet object will be instantiated and called as such:
 * var obj = new RandomizedSet()
 * var param_1 = obj.insert(val)
 * var param_2 = obj.remove(val)
 * var param_3 = obj.getRandom()
 */

const obj = new RandomizedSet();
const param1 = obj.insert(1);
const param2 = obj.remove(2);
const param3 = obj.getRandom();
console.log(param1, param2, param3);
// @lc code=end
