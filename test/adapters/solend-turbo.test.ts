import { fetch } from "../../lib/adapters/solend-turbo"
import { isSupportedToken } from "../support/tokens"

test("fetches the solend rates", async () => {
  const rates = await fetch()

  expect(rates.protocol).toBe("solend-turbo")
  expect(rates.rates.length).toBeTruthy()

  console.log(JSON.stringify(rates, null, 2))

  expect(rates.rates.find(({ asset }) => asset === "SOL")).toBeDefined()
  expect(rates.rates.find(({ asset }) => asset === "USDC")).toBeDefined()

  rates.rates.forEach(({ asset, mint }) => {
    expect(isSupportedToken(asset, mint)).toBe(true)
  })
})
