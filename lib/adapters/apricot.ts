import {
  ApiAssetPool,
  createAssetPoolLoader,
  TokenID
} from "@apricot-lend/sdk-ts"
import { Connection, PublicKey } from "@solana/web3.js"
import { ProtocolRates } from "../types"
import { asyncMap, compact } from "../utils/array-fns"
import { defaultConnection } from "../utils/connection"
import { findTokenByMint } from "../utils/tokens"

export const fetch = async (
  connection: Connection = defaultConnection("apricot")
): Promise<ProtocolRates> => {
  const assetPoolLoader = await createAssetPoolLoader(connection)

  const assetPools = (
    await Promise.all([
      assetPoolLoader.getAssetPool(TokenID.APT),
      assetPoolLoader.getAssetPool(TokenID.BTC),
      assetPoolLoader.getAssetPool(TokenID.ETH),
      assetPoolLoader.getAssetPool(TokenID.FTT),
      assetPoolLoader.getAssetPool(TokenID.mSOL),
      assetPoolLoader.getAssetPool(TokenID.ORCA),
      assetPoolLoader.getAssetPool(TokenID.RAY),
      assetPoolLoader.getAssetPool(TokenID.SOL),
      assetPoolLoader.getAssetPool(TokenID.SRM),
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

      return {
        asset: token.symbol,
        mint: new PublicKey(token.address),
        deposit: depositRate,
        borrow: borrowRate
      }
    }
  )

  return {
    protocol: "apricot",
    rates: compact(rates)
  }
}
