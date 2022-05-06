import { fetch } from "../../lib/adapters/solend-turbo"
import { expectSupported } from "../support/tokens"

test("fetches the solend rates", async () => {
  const rates = await fetch()

  expect(rates.protocol).toBe("solend-turbo")
  expect(rates.rates.length).toBeTruthy()

  expect(rates.rates.find(({ token }) => token.symbol === "SOL")).toBeDefined()
  expect(rates.rates.find(({ token }) => token.symbol === "USDC")).toBeDefined()

  await expectSupported(rates.rates)
})
