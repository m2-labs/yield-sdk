import {
  ApiAssetPool,
  createAssetPoolLoader,
  TokenID
} from "@apricot-lend/sdk-ts"
import { findTokenByMint } from "@m2-labs/token-amount"
import { fetchHandler } from "../utils/fetch-fns"
import { buildAssetRate } from "../utils/rate-fns"

export const fetch = fetchHandler(
  "apricot",
  async ({ connection, desiredTokens }) => {
    const assetPoolLoader = await createAssetPoolLoader(connection, () =>
      // skip price fetching
      Promise.resolve(0)
    )
    const assetPools = (
      await Promise.all(
        desiredTokens
          ? desiredTokens.map((t) =>
              assetPoolLoader.getAssetPool(t.symbol as TokenID)
            )
          : [
              assetPoolLoader.getAssetPool(TokenID.BTC),
              assetPoolLoader.getAssetPool(TokenID.ETH),
              assetPoolLoader.getAssetPool(TokenID.mSOL),
              assetPoolLoader.getAssetPool(TokenID.SOL),
              assetPoolLoader.getAssetPool(TokenID.USDC),
              assetPoolLoader.getAssetPool(TokenID.USDT)
            ]
      )
    ).filter(Boolean) as ApiAssetPool[]

    const rates = assetPools.map(({ mintKey, depositRate, borrowRate }) => {
      const token = findTokenByMint(mintKey)

      if (!token) {
        return
      }

      return buildAssetRate({
        token,
        deposit: depositRate,
        borrow: borrowRate
      })
    })

    return rates
  }
)
