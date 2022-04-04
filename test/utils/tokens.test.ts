import { findTokenByMint } from "../../lib/utils/tokens"

test("findTokenByMint() returns the token if the token is supported", async () => {
  await expect(
    findTokenByMint("So11111111111111111111111111111111111111112")
  ).resolves.toBeDefined()

  await expect(
    findTokenByMint("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v")
  ).resolves.toBeDefined()
})

test("findTokenByMint() returns undefined if the token is not supported", async () => {
  await expect(
    findTokenByMint("EP11111111111111111111111111111111111111112")
  ).resolves.toBeUndefined()
})
