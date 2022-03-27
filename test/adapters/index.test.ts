import { fetchAll, isSupportedToken } from "../../lib"

test(".fetchAll() fetches the all rates", async () => {
  const rates = await fetchAll()

  expect(rates.map(({ protocol }) => protocol).sort()).toEqual(
    ["01", "apricot", "francium", "jet", "mango", "port", "solend"].sort()
  )

  rates.forEach((protocol) => {
    expect(protocol.rates.find(({ asset }) => asset === "SOL")).toBeDefined()
    expect(protocol.rates.find(({ asset }) => asset === "USDC")).toBeDefined()

    protocol.rates.forEach(({ asset, mint }) => {
      expect(isSupportedToken(asset, mint)).toBe(true)
    })
  })
})
