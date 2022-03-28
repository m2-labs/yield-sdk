import { fetch } from "../../lib/adapters/01"
import { isSupportedToken } from "../support/tokens"

test("fetches the 01 rates", async () => {
  const rates = await fetch()

  expect(rates.protocol).toBe("01")
  expect(rates.rates.length).toBeTruthy()

  expect(rates.rates.find(({ asset }) => asset === "SOL")).toBeDefined()
  expect(rates.rates.find(({ asset }) => asset === "USDC")).toBeDefined()

  rates.rates.forEach(({ asset, mint }) => {
    expect(isSupportedToken(asset, mint)).toBe(true)
  })
})
