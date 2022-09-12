import { findTokenBySymbol } from "@m2-labs/token-amount"
import Decimal from "decimal.js"
import { lendingPoolList } from "francium-sdk/dist/constants/lend/pools"
import { getLendingPoolInfo } from "francium-sdk/dist/model"
import { fetchHandler } from "../utils/fetch-fns"
import { buildAssetRate } from "../utils/rate-fns"

export const fetch = fetchHandler(
  "francium",
  async ({ connection, desiredTokens }) => {
    const pools = desiredTokens
      ? lendingPoolList.filter((p) =>
          desiredTokens?.find((t) => t.symbol === p.pool)
        )
      : lendingPoolList

    const assets = await getLendingPoolInfo(connection, pools)

    const rates = assets.map(({ pool, apy }) => {
      const token = findTokenBySymbol(pool)

      if (!token) {
        return
      }

      return buildAssetRate({
        token,
        deposit: new Decimal(apy).div(100)
      })
    })

    return rates
  }
)
