import { isSupportedToken } from "../../lib/tokens/utils"

test("isSupportedToken() returns true if the token is supported", () => {
  expect(
    isSupportedToken("SOL", "So11111111111111111111111111111111111111112")
  ).toBe(true)
  expect(
    isSupportedToken("USDC", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
  ).toBe(true)
})

test("isSupportedToken() returns false if the token is not supported", () => {
  expect(
    isSupportedToken("USDC", "So11111111111111111111111111111111111111112")
  ).toBe(false)
  expect(
    isSupportedToken("SOL", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
  ).toBe(false)
})
