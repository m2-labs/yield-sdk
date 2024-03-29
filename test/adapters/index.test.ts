import { fetchAll } from "../../lib"
import { expectSupported } from "../support/tokens"

test(".fetchAll() fetches the all rates", async () => {
  const rates = await fetchAll()

  expect(rates.map(({ protocol }) => protocol).sort()).toEqual(
    [
      "01",
      "apricot",
      "francium",
      "jet",
      "jetv2",
      "larix",
      "mango",
      "port",
      "solend",
      "solend-stable",
      "solend-turbo",
      "tulip"
    ].sort()
  )

  for (let i = 0; i < rates.length; i++) {
    const rate = rates[i]

    expect(
      rate.rates.find(({ token }) => token.symbol === "USDC")
    ).toBeDefined()
    await expectSupported(rate.rates)
  }
})
