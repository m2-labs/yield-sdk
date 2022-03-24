import {
  ApiAssetPool,
  createAssetPoolLoader,
  getConnection,
  TokenID
} from "@apricot-lend/sdk-ts"
import { Connection, PublicKey } from "@solana/web3.js"
import { findTokenByMint } from "../tokens"
import { AssetRate, ProtocolRates } from "../types"

export async function fetch(
  connection: Connection = getConnection()
): Promise<ProtocolRates> {
  const assetPoolLoader = await createAssetPoolLoader(connection)

  const rates: AssetRate[] = []

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

  assetPools.forEach(({ mintKey, depositRate, borrowRate }) => {
    const token = findTokenByMint(mintKey)

    if (token) {
      rates.push({
        asset: token.symbol,
        mint: new PublicKey(token.mint),
        deposit: depositRate,
        borrow: borrowRate
      })
    }
  })

  return {
    protocol: "apricot",
    rates
  }
}
