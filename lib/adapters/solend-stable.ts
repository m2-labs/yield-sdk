import { findTokenByMint } from "@m2-labs/token-amount"
import { SolendMarket } from "@solendprotocol/solend-sdk"
import Decimal from "decimal.js"
import { fetchHandler } from "../utils/fetch-fns"
import { buildAssetRate } from "../utils/rate-fns"

export const fetch = fetchHandler(
  "solend-stable",
  async ({ connection, isDesiredToken }) => {
    const market = await SolendMarket.initialize(
      connection,
      "production",
      "GktVYgkstojYd8nVXGXKJHi7SstvgZ6pkQqQhUPD7y7Q"
    )
    await market.loadReserves()

    const rates = market.reserves.map((reserve) => {
      const token = findTokenByMint(reserve.config.mintAddress)

      if (!token || !reserve.stats) {
        return
      }

      if (isDesiredToken(token)) {
        return buildAssetRate({
          token,
          deposit: new Decimal(reserve.stats.supplyInterestAPY),
          borrow: new Decimal(reserve.stats.borrowInterestAPY)
        })
      }
    })

    return rates
  }
)
