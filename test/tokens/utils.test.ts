import { findTokenByMint } from "../../lib/tokens/utils"

test("findTokenByMint() returns the token if the token is supported", () => {
  expect(
    findTokenByMint("So11111111111111111111111111111111111111112")
  ).toBeDefined()
  expect(
    findTokenByMint("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
  ).toBeDefined()
})

test("findTokenByMint() returns undefined if the token is not supported", () => {
  expect(
    findTokenByMint("EP11111111111111111111111111111111111111112")
  ).toBeUndefined()
})
