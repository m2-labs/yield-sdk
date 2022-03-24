import { PublicKey } from "@solana/web3.js"
import { asPublicKey } from "../../lib/utils"

test("asPublicKey returns a PublicKey from a string", () => {
  const publicKey = asPublicKey("So11111111111111111111111111111111111111112")

  expect(publicKey instanceof PublicKey).toBe(true)
})

test("asPublicKey returns a PublicKey from a PublicKey", () => {
  const publicKey = asPublicKey(
    new PublicKey("So11111111111111111111111111111111111111112")
  )

  expect(publicKey instanceof PublicKey).toBe(true)
})
