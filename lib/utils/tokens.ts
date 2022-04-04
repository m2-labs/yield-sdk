import {
  TokenListProvider,
  TokenInfo,
  Strategy
} from "@solana/spl-token-registry"
import { asPublicKey, PublicKeyLike } from "."

let TOKEN_LIST: TokenInfo[] = []

export const tokenList = async () => {
  if (!TOKEN_LIST.length) {
    const tokens = await new TokenListProvider().resolve(Strategy.Static)
    TOKEN_LIST = tokens.filterByClusterSlug("mainnet-beta").getList()
  }

  return TOKEN_LIST
}

export const findTokenByMint = async (mint?: PublicKeyLike) => {
  if (!mint) {
    return
  }

  const tokens = await tokenList()

  return tokens.find((token) => {
    return asPublicKey(token.address).equals(asPublicKey(mint))
  })
}

export const findTokenBySymbol = async (symbol?: string) => {
  if (!symbol) {
    return
  }

  const tokens = await tokenList()

  return tokens.find((token) => {
    return token.symbol === symbol
  })
}
