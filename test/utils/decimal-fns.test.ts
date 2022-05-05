import BN from "bn.js"
import Decimal from "decimal.js"
import { asDecimal } from "../../lib/utils/decimal-fns"

test("asDecimal returns a Decimal from a Decimal", () => {
  expect(asDecimal(new Decimal(1.0)).eq(new Decimal(1.0))).toBe(true)
})

test("asDecimal returns a Decimal from a string", () => {
  expect(asDecimal(new Decimal("7")).eq(new Decimal(7.0))).toBe(true)
})

test("asDecimal returns a Decimal from a number", () => {
  expect(asDecimal(new Decimal(420)).eq(new Decimal(420))).toBe(true)
})

test("asDecimal returns a Decimal from a BN", () => {
  expect(asDecimal(new BN(22)).eq(new Decimal(22))).toBe(true)
})

test("asDecimal returns the fallback on error", () => {
  expect(asDecimal("not a number", 100).eq(new Decimal(100))).toBe(true)
})

test("asDecimal throws on error if the fallback is invalid", () => {
  expect(() => {
    asDecimal("not a number", "also not a number")
  }).toThrow()
})

test("asDecimal throws on error if no fallback is given", () => {
  expect(() => {
    asDecimal("not a number")
  }).toThrow()
})

test("asDecimal throws if given no arguments", () => {
  expect(() => {
    asDecimal()
  }).toThrow()
})
