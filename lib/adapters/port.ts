import { findTokenByMint } from "@m2-labs/token-amount"
import { Port, ReserveInfo } from "@port.finance/port-sdk"
import { fetchHandler } from "../utils/fetch-fns"
import { buildAssetRate } from "../utils/rate-fns"

export const fetch = fetchHandler(
  "port",
  async ({ connection, desiredTokens }) => {
    const port = Port.forMainNet({ connection })
    const context = await port.getReserveContext()
    const reserves: ReserveInfo[] = context.getAllReserves()

    const rates = reserves.map((reserve) => {
      const token = findTokenByMint(reserve.getAssetMintId())

      if (!token) {
        return
      }

      if (!desiredTokens || desiredTokens.includes(token)) {
        return buildAssetRate({
          token,
          deposit: reserve.getSupplyApy().getUnchecked().toNumber(),
          borrow: reserve.getBorrowApy().getUnchecked().toNumber()
        })
      }
    })

    return rates
  }
)
