import { findTokenByMint } from "@m2-labs/token-amount"
import { AssetRate } from "../../lib/types"
import { asyncMap } from "../../lib/utils/array-fns"
import { PublicKeyLike } from "../../lib/utils/public-key"

export const isSupportedToken = async (symbol: string, mint: PublicKeyLike) => {
  const token = await findTokenByMint(mint)

  return Boolean(token && token.symbol === symbol)
}

export const expectSupported = async (rates: AssetRate[]) => {
  await asyncMap(rates, async ({ token }) => {
    const isSupported = await isSupportedToken(token.symbol, token.address)

    expect(isSupported).toBe(true)
  })
}
