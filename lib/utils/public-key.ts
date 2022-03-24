import { PublicKey, PublicKeyInitData } from "@solana/web3.js"

export type PublicKeyLike = PublicKey | PublicKeyInitData

export const asPublicKey = (key: PublicKeyLike): PublicKey => {
  if (key instanceof PublicKey) {
    return key
  }

  return new PublicKey(key)
}
