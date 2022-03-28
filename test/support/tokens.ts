import { TOKENS } from "../../lib/tokens"
import { asPublicKey, PublicKeyLike } from "../../lib/utils/public-key"

export const isSupportedToken = (symbol: string, mint: PublicKeyLike) => {
  return Boolean(
    TOKENS.find((token) => {
      return (
        token.symbol === symbol &&
        asPublicKey(token.mint).equals(asPublicKey(mint))
      )
    })
  )
}
