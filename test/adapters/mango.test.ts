import { fetch } from "../../lib/adapters/mango"
import { expectSupported } from "../support/tokens"

test("fetches the mango rates", async () => {
  const rates = await fetch()

  expect(rates.protocol).toBe("mango")
  expect(rates.rates.length).toBeTruthy()

  expect(rates.rates.find(({ asset }) => asset === "SOL")).toBeDefined()
  expect(rates.rates.find(({ asset }) => asset === "USDC")).toBeDefined()

  await expectSupported(rates.rates)
})
