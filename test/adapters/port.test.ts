import { fetch } from "../../lib/adapters/port"
import { expectSupported } from "../support/tokens"

test("fetches the port rates", async () => {
  const rates = await fetch()

  expect(rates.protocol).toBe("port")
  expect(rates.rates.length).toBeTruthy()

  expect(rates.rates.find(({ token }) => token.symbol === "SOL")).toBeDefined()
  expect(rates.rates.find(({ token }) => token.symbol === "USDC")).toBeDefined()

  await expectSupported(rates.rates)
})
