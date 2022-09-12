import {
  ApiAssetPool,
  createAssetPoolLoader,
  TokenID
} from "@apricot-lend/sdk-ts"
import { findToken, findTokenByMint } from "@m2-labs/token-amount"
import { FetchOptions, ProtocolRates } from "../types"
import { defaultConnection } from "../utils/connection"
import { buildAssetRate, buildProtocolRates } from "../utils/rate-fns"

export const fetch = async ({
  connection = defaultConnection("apricot"),
  tokens
}: FetchOptions = {}): Promise<ProtocolRates> => {
  const assetPoolLoader = await createAssetPoolLoader(connection, () =>
    Promise.resolve(0)
  )
  const desiredTokens = tokens?.length
    ? tokens.map(findToken).filter(Boolean)
    : undefined

  const assetPools = (
    await Promise.all(
      desiredTokens
        ? desiredTokens.map((t) =>
            assetPoolLoader.getAssetPool(t?.symbol as TokenID)
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

  return buildProtocolRates("apricot", rates)
}
