import { fetch } from "../../lib/adapters/francium"
import { expectSupported } from "../support/tokens"

test("fetches the francium rates", async () => {
  const rates = await fetch()

  expect(rates.protocol).toBe("francium")
  expect(rates.rates.length).toBeTruthy()

  expect(rates.rates.find(({ asset }) => asset === "SOL")).toBeDefined()
  expect(rates.rates.find(({ asset }) => asset === "USDC")).toBeDefined()

  await expectSupported(rates.rates)
})
