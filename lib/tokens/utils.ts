import { asPublicKey, PublicKeyLike } from "../utils"
import TOKENS from "./tokens.json"

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

export const findTokenByMint = (mint: PublicKeyLike) => {
  return TOKENS.find((token) => {
    return asPublicKey(token.mint).equals(asPublicKey(mint))
  })
}
