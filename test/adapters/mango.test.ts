import { fetch } from "../../lib/adapters/mango"
import { isSupportedToken } from "../support/tokens"

test("fetches the mango rates", async () => {
  const rates = await fetch()

  expect(rates.protocol).toBe("mango")
  expect(rates.rates.length).toBeTruthy()

  expect(rates.rates.find(({ asset }) => asset === "SOL")).toBeDefined()
  expect(rates.rates.find(({ asset }) => asset === "USDC")).toBeDefined()

  rates.rates.forEach(({ asset, mint }) => {
    expect(isSupportedToken(asset, mint)).toBe(true)
  })
})
