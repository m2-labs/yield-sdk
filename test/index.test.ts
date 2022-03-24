import { TOKENS } from "../lib"

test("exports a TOKENS list", () => {
  expect(TOKENS).toBeDefined()

  expect(TOKENS.find((token) => token.symbol === "SOL")).toBeDefined()
  expect(TOKENS.find((token) => token.symbol === "USDC")).toBeDefined()
})
