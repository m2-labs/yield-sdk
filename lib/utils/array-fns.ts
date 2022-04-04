/**
 * Perform an async `Array.prototype.map()` operation
 *
 * @returns an array of the results of the async operation
 */
export function asyncMap<T, P>(
  arr: T[],
  fn: (arg0: T, i: number, arr: T[]) => Promise<P>
): Promise<P[]> {
  return Promise.all(arr.map(fn))
}

type ArrayWithEmpties<T> = (T | undefined | null | false)[]
export function compact<T>(arr: ArrayWithEmpties<T>): T[] {
  return arr.filter((x) => Boolean(x)) as T[]
}
