import { PublicKey } from "@solana/web3.js"

export type Protocol =
  | "apricot"
  | "francium"
  | "jet"
  | "mango"
  | "port"
  | "solend"
  | "tulip"

export type ProtocolRates = {
  protocol: Protocol
  rates: AssetRate[]
}

export type AssetRate = {
  asset: string
  mint: PublicKey
  deposit?: number
  borrow?: number
}
