type ArrayWithEmpties<T> = (T | undefined | null | false)[]

export function compact<T>(arr: ArrayWithEmpties<T>): T[] {
  return arr.filter((x) => Boolean(x)) as T[]
}
