import { AssetRate } from "../../lib/types"
import { asyncMap } from "../../lib/utils/array-fns"
import { PublicKeyLike } from "../../lib/utils/public-key"
import { findTokenByMint } from "../../lib/utils/tokens"

export const isSupportedToken = async (symbol: string, mint: PublicKeyLike) => {
  const token = await findTokenByMint(mint)

  return Boolean(token && token.symbol === symbol)
}

export const expectSupported = async (rates: AssetRate[]) => {
  await asyncMap(rates, async ({ asset, mint }) => {
    const isSupported = await isSupportedToken(asset, mint)

    expect(isSupported).toBe(true)
  })
}
