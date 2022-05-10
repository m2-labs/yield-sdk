import { findTokenByMint } from "@m2-labs/token-amount"
import { AssetRate } from "../../lib/types"
import { PublicKeyLike } from "../../lib/utils/public-key"

export const isSupportedToken = (symbol: string, mint: PublicKeyLike) => {
  const token = findTokenByMint(mint)

  return Boolean(token && token.symbol === symbol)
}

export const expectSupported = (rates: AssetRate[]) => {
  rates.map(({ token }) => {
    const isSupported = isSupportedToken(token.symbol, token.address)

    expect(isSupported).toBe(true)
  })
}
