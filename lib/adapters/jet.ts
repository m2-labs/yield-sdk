import {
  JetClient,
  JetMarket,
  JetReserve,
  JET_MARKET_ADDRESS
} from "@jet-lab/jet-engine"
import { findTokenByMint } from "@m2-labs/token-amount"
import Decimal from "decimal.js"
import { fetchHandler } from "../utils/fetch-fns"
import { buildAssetRate } from "../utils/rate-fns"

export const fetch = fetchHandler(
  "jet",
  async ({ provider, isDesiredToken }) => {
    const client = await JetClient.connect(provider, false)
    const market = await JetMarket.load(client, JET_MARKET_ADDRESS)
    const reserves = await JetReserve.loadMultiple(client, market)

    const rates = reserves.map((reserve) => {
      const token = findTokenByMint(reserve.data.tokenMint)

      if (!token) {
        return
      }

      if (isDesiredToken(token)) {
        return buildAssetRate({
          token,
          deposit: new Decimal(reserve.data.depositApy),
          borrow: new Decimal(reserve.data.borrowApr)
        })
      }
    })

    return rates
  }
)
