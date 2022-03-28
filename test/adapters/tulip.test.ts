import { isSupportedToken } from "../../lib"
import { fetch } from "../../lib/adapters/tulip"

test("fetches the tulip rates", async () => {
  const rates = await fetch()

  expect(rates.protocol).toBe("tulip")
  expect(rates.rates.length).toBeTruthy()

  expect(rates.rates.find(({ asset }) => asset === "SOL")).toBeDefined()
  expect(rates.rates.find(({ asset }) => asset === "USDC")).toBeDefined()

  rates.rates.forEach(({ asset, mint }) => {
    expect(isSupportedToken(asset, mint)).toBe(true)
  })
})
