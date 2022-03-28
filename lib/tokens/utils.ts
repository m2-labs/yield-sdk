import { asPublicKey, PublicKeyLike } from "../utils"
import TOKENS from "./tokens.json"

export const findTokenByMint = (mint: PublicKeyLike) => {
  return TOKENS.find((token) => {
    return asPublicKey(token.mint).equals(asPublicKey(mint))
  })
}

export const findTokenBySymbol = (symbol: string) => {
  return TOKENS.find((token) => {
    return token.symbol === symbol
  })
}
