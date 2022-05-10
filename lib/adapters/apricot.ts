import {
  ApiAssetPool,
  createAssetPoolLoader,
  TokenID
} from "@apricot-lend/sdk-ts"
import { findTokenByMint } from "@m2-labs/token-amount"
import { Connection } from "@solana/web3.js"
import { ProtocolRates } from "../types"
import { asyncMap, compact } from "../utils/array-fns"
import { defaultConnection } from "../utils/connection"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

export const fetch = async (
  connection: Connection = defaultConnection("apricot")
): Promise<ProtocolRates> => {
  const assetPoolLoader = await createAssetPoolLoader(connection)

  const assetPools = (
    await Promise.all([
      assetPoolLoader.getAssetPool(TokenID.BTC),
      assetPoolLoader.getAssetPool(TokenID.ETH),
      assetPoolLoader.getAssetPool(TokenID.mSOL),
      assetPoolLoader.getAssetPool(TokenID.SOL),
      assetPoolLoader.getAssetPool(TokenID.USDC),
      assetPoolLoader.getAssetPool(TokenID.USDT),
      assetPoolLoader.getAssetPool(TokenID.USTv2)
    ])
  ).filter(Boolean) as ApiAssetPool[]

  const rates = await asyncMap(
    assetPools,
    async ({ mintKey, depositRate, borrowRate }) => {
      const token = await findTokenByMint(mintKey)

      if (!token) {
        return
      }

      return buildAssetRate({
        token,
        deposit: depositRate,
        borrow: borrowRate
      })
    }
  )

  return buildProtocolRates("apricot", rates)
}
