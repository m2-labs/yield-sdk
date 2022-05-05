import BN from "bn.js"
import Decimal from "decimal.js"

export type DecimalLike = Decimal | string | number | BN

export const asDecimal = (
  number?: DecimalLike | null,
  fallback?: DecimalLike
): Decimal => {
  if (number === null || number === undefined) {
    return asDecimal(fallback)
  }

  try {
    const decimal = new Decimal(
      number instanceof BN ? number.toString() : number
    )
    return decimal
  } catch (e) {
    if (fallback !== undefined && fallback !== null) {
      return asDecimal(fallback)
    }

    throw e
  }
}

/**
 * Solend stores some Lamport values (9 decimals) in Wads (18 decimals), meaning
 * this number has 27 digits of precision.
 *
 * @param number
 * @returns
 */
export const convertWadsToLamports = (number?: DecimalLike | null): Decimal => {
  return asDecimal(number).div(new Decimal(1e18))
}
